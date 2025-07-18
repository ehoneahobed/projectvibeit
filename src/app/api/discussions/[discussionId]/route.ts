import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { connectDB } from "@/lib/db"
import { Discussion } from "@/lib/models"

/**
 * DELETE /api/discussions/[discussionId]
 * Delete a discussion (only by author or admin)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ discussionId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { discussionId } = await params

    await connectDB()

    // Find the discussion
    const discussion = await Discussion.findById(discussionId)
    if (!discussion) {
      return NextResponse.json(
        { success: false, error: "Discussion not found" },
        { status: 404 }
      )
    }

    // Check if user is the author or an admin
    const isAuthor = discussion.userId.toString() === session.user.id
    const userRole = (session.user as { role?: string }).role
    const isAdmin = userRole === 'admin' || userRole === 'contributor'

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "You can only delete your own discussions" },
        { status: 403 }
      )
    }

    // Delete the discussion
    await Discussion.findByIdAndDelete(discussionId)

    return NextResponse.json({
      success: true,
      message: "Discussion deleted successfully"
    })
  } catch (error) {
    console.error('Error deleting discussion:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete discussion' },
      { status: 500 }
    )
  }
} 