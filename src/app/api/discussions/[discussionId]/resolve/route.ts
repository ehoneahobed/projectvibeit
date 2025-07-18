import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { connectDB } from "@/lib/db"
import { Discussion, User } from "@/lib/models"

type DiscussionParams = {
  params: Promise<{
    discussionId: string
  }>
}

/**
 * PATCH /api/discussions/[discussionId]/resolve
 * Mark a discussion as resolved or unresolved
 */
export async function PATCH(request: NextRequest, { params }: DiscussionParams) {
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
    const { isResolved } = body

    if (typeof isResolved !== 'boolean') {
      return NextResponse.json(
        { success: false, error: "isResolved must be a boolean" },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if user has permission to resolve discussions (admin, contributor, or discussion author)
    const currentUser = await User.findById(session.user.id, { role: 1 })
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    const discussion = await Discussion.findById(discussionId)
    if (!discussion) {
      return NextResponse.json(
        { success: false, error: "Discussion not found" },
        { status: 404 }
      )
    }

    // Only allow admin, contributor, or discussion author to resolve
    const canResolve = ['admin', 'contributor'].includes(currentUser.role) || 
                      discussion.userId.toString() === session.user.id

    if (!canResolve) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    // Update the discussion
    discussion.isResolved = isResolved
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
    console.error('Error updating discussion:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update discussion' },
      { status: 500 }
    )
  }
} 