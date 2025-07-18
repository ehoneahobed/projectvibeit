import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { connectDB } from "@/lib/db"
import { Discussion } from "@/lib/models"

type DiscussionParams = {
  params: Promise<{
    discussionId: string
  }>
}

/**
 * POST /api/discussions/[discussionId]/replies
 * Add a reply to a discussion
 */
export async function POST(request: NextRequest, { params }: DiscussionParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { discussionId } = await params
    const body = await request.json()
    const { content } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Reply content is required" },
        { status: 400 }
      )
    }

    await connectDB()

    const discussion = await Discussion.findById(discussionId)
    if (!discussion) {
      return NextResponse.json(
        { success: false, error: "Discussion not found" },
        { status: 404 }
      )
    }

    // Add the reply
    discussion.replies.push({
      userId: session.user.id,
      content: content.trim(),
      createdAt: new Date()
    })

    await discussion.save()

    // Get the updated discussion with author information
    const updatedDiscussion = await Discussion.aggregate([
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
        $lookup: {
          from: 'users',
          localField: 'replies.userId',
          foreignField: '_id',
          as: 'replyAuthors'
        }
      },
      {
        $project: {
          id: '$_id',
          lessonId: 1,
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
          replyCount: { $size: '$replies' }
        }
      }
    ])

    return NextResponse.json({
      success: true,
      data: updatedDiscussion[0]
    })
  } catch (error) {
    console.error('Error adding reply:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add reply' },
      { status: 500 }
    )
  }
} 