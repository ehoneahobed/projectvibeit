import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"

/**
 * GET /api/auth/check-role
 * Check the current user's role for authorization
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", role: null },
        { status: 401 }
      )
    }

    await connectDB()
    
    const user = await User.findById(session.user.id, { role: 1 })
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found", role: null },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      role: user.role,
      error: null
    })
  } catch (error) {
    console.error('Error checking user role:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check user role', role: null },
      { status: 500 }
    )
  }
} 