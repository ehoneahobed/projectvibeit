import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { connectDB } from "@/lib/db"
import { Discussion, User } from "@/lib/models"

/**
 * GET /api/portal/community/discussions
 * Get all discussions for admin/contributor management
 */
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()
    
    // Check if user has admin or contributor role
    const currentUser = await User.findById(session.user.id, { role: 1 })
    if (!currentUser || !['admin', 'contributor'].includes(currentUser.role)) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    // Get all discussions with author information
    const discussions = await Discussion.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      {
        $project: {
          id: '$_id',
          title: 1,
          content: 1,
          courseSlug: 1,
          lessonSlug: 1,
          replies: { $size: '$replies' },
          likes: { $size: '$likes' },
          views: 1,
          isResolved: 1,
          createdAt: 1,
          updatedAt: 1,
          author: {
            id: '$author._id',
            name: '$author.name',
            email: '$author.email'
          }
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