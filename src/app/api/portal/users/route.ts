import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"

/**
 * GET /api/portal/users
 * Get all users for admin/contributor management
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
    
    // Check if user has admin role
    const currentUser = await User.findById(session.user.id, { role: 1 })
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    // Get all users with their progress count
    const users = await User.aggregate([
      { $match: { archivedAt: { $exists: false } } },
      {
        $addFields: {
          progressCount: { $size: "$progress" }
        }
      },
      {
        $project: {
          id: "$_id",
          name: 1,
          email: 1,
          role: 1,
          planName: 1,
          subscriptionStatus: 1,
          createdAt: 1,
          updatedAt: 1,
          progressCount: 1,
          lastActive: "$updatedAt"
        }
      },
      { $sort: { createdAt: -1 } }
    ])

    return NextResponse.json({
      success: true,
      data: users
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
} 