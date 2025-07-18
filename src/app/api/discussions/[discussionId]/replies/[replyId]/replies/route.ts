import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { connectDB } from "@/lib/db"
import { Discussion } from "@/lib/models"

type ReplyParams = {
  params: Promise<{
    discussionId: string
    replyId: string
  }>
}

/**
 * POST /api/discussions/[discussionId]/replies/[replyId]/replies
 * Add a threaded reply to an existing reply
 */
export async function POST(request: NextRequest, { params }: ReplyParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { discussionId, replyId } = await params
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

    // Find the parent reply using a simpler approach
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parentReply: any = null
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const findReply = (replies: any[], targetId: string): any => {
      for (const reply of replies) {
        if (reply._id.toString() === targetId) {
          return reply
        }
        if (reply.replies && reply.replies.length > 0) {
          const found = findReply(reply.replies, targetId)
          if (found) return found
        }
      }
      return null
    }

    parentReply = findReply(discussion.replies, replyId)
    if (!parentReply) {
      return NextResponse.json(
        { success: false, error: "Parent reply not found" },
        { status: 404 }
      )
    }

    // Add the threaded reply
    const newReply = {
      userId: session.user.id,
      content: content.trim(),
      createdAt: new Date(),
      parentReplyId: replyId,
      replies: []
    }

    // Initialize replies array if it doesn't exist
    if (!parentReply.replies) {
      parentReply.replies = []
    }

    parentReply.replies.push(newReply)
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
          replies: 1,
          replyCount: { $size: '$replies' }
        }
      }
    ])

    return NextResponse.json({
      success: true,
      data: updatedDiscussion[0]
    })
  } catch (error) {
    console.error('Error adding threaded reply:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add threaded reply' },
      { status: 500 }
    )
  }
} 