import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { connectDB } from "@/lib/db"
import { Discussion } from "@/lib/models"

/**
 * GET /api/discussions
 * Get discussions for a specific lesson
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lessonId')
    const courseSlug = searchParams.get('courseSlug')
    const moduleSlug = searchParams.get('moduleSlug')
    const lessonSlug = searchParams.get('lessonSlug')

    if (!lessonId && (!courseSlug || !moduleSlug || !lessonSlug)) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      )
    }

    await connectDB()

    const query: Record<string, unknown> = {}
    
    if (lessonId) {
      // If lessonId is provided, it might be a virtual lesson ID or a slug
      if (lessonId.includes('/')) {
        // It's a virtual lesson ID (courseSlug/moduleSlug/lessonSlug)
        query.virtualLessonId = lessonId
      } else {
        // It's a lesson slug, construct the virtual lesson ID
        query.virtualLessonId = `${courseSlug}/${moduleSlug}/${lessonId}`
      }
    } else {
      // Construct virtual lesson ID from course/module/lesson slugs
      query.virtualLessonId = `${courseSlug}/${moduleSlug}/${lessonSlug}`
    }

    // Get discussions with author information
    const discussions = await Discussion.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      {
        $lookup: {
          from: 'users',
          localField: 'replies.userId',
          foreignField: '_id',
          as: 'replyAuthors'
        }
      },
      {
        $addFields: {
          replyCount: { $size: '$replies' }
        }
      },
      {
        $project: {
          id: '$_id',
          lessonId: 1,
          virtualLessonId: 1,
          content: 1,
          isResolved: 1,
          createdAt: 1,
          updatedAt: 1,
          author: {
            id: '$author._id',
            name: '$author.name',
            email: '$author.email',
            image: '$author.image'
          },
          replies: {
            $map: {
              input: '$replies',
              as: 'reply',
              in: {
                id: '$$reply._id',
                content: '$$reply.content',
                createdAt: '$$reply.createdAt',
                userId: '$$reply.userId'
              }
            }
          },
          replyCount: 1
        }
      },
      { $sort: { createdAt: -1 } }
    ])

    return NextResponse.json({
      success: true,
      data: discussions
    })
  } catch (error) {
    console.error('Error fetching discussions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch discussions' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/discussions
 * Create a new discussion
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content, courseSlug, moduleSlug, lessonSlug } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Discussion content is required" },
        { status: 400 }
      )
    }

    if (!courseSlug || !moduleSlug || !lessonSlug) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters: courseSlug, moduleSlug, lessonSlug" },
        { status: 400 }
      )
    }

    await connectDB()

    // For content-based lessons, we'll use a virtual lesson ID system
    // The lessonId will be a combination of courseSlug/moduleSlug/lessonSlug
    const virtualLessonId = `${courseSlug}/${moduleSlug}/${lessonSlug}`
    
    // Check if this lesson exists in our content system
    const { getLessonContent } = await import("@/lib/content")
    const lessonContent = getLessonContent(courseSlug, moduleSlug, lessonSlug)
    
    if (!lessonContent) {
      return NextResponse.json(
        { success: false, error: "Lesson not found in content system" },
        { status: 404 }
      )
    }

    const discussion = new Discussion({
      virtualLessonId: virtualLessonId,
      userId: session.user.id,
      content: content.trim(),
      replies: [],
      isResolved: false
    })

    await discussion.save()

    // Get the created discussion with author information
    const createdDiscussion = await Discussion.aggregate([
      { $match: { _id: discussion._id } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      {
        $addFields: {
          replyCount: { $size: '$replies' }
        }
      },
      {
        $project: {
          id: '$_id',
          lessonId: 1,
          virtualLessonId: 1,
          content: 1,
          isResolved: 1,
          createdAt: 1,
          updatedAt: 1,
          author: {
            id: '$author._id',
            name: '$author.name',
            email: '$author.email',
            image: '$author.image'
          },
          replies: 1,
          replyCount: 1
        }
      }
    ])

    return NextResponse.json({
      success: true,
      data: createdDiscussion[0]
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating discussion:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create discussion' },
      { status: 500 }
    )
  }
}

 