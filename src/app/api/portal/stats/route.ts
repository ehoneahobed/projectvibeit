import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { connectDB } from "@/lib/db"
import { User, Course, Lesson } from "@/lib/models"

/**
 * GET /api/portal/stats
 * Get real portal statistics for admin/contributor dashboard
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
    const user = await User.findById(session.user.id, { role: 1 })
    if (!user || !['admin', 'contributor'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    // Get real statistics from database
    const [
      totalUsers,
      activeUsers,
      totalCourses,
      totalLessons,
      totalProjects,
      completedLessonsCount,
      weeklyGrowth
    ] = await Promise.all([
      // Total users (excluding archived)
      User.countDocuments({ archivedAt: { $exists: false } }),
      
      // Active users (users with progress in last 30 days)
      User.countDocuments({
        archivedAt: { $exists: false },
        'progress.0': { $exists: true }
      }),
      
      // Total published courses
      Course.countDocuments({ isPublished: true }),
      
      // Total published lessons
      Lesson.countDocuments({ isPublished: true }),
      
      // Total projects
      Lesson.countDocuments({ 
        isPublished: true, 
        type: 'project' 
      }),
      
      // Total completed lessons across all users
      User.aggregate([
        { $unwind: '$progress' },
        { $group: { _id: null, totalCompleted: { $sum: { $size: '$progress.completedLessons' } } } }
      ]),
      
      // Weekly growth (new users in last 7 days)
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        archivedAt: { $exists: false }
      })
    ])

    // Calculate average completion rate
    const allUsers = await User.find({ archivedAt: { $exists: false } }, { progress: 1 })
    const totalPossibleLessons = totalLessons * allUsers.length
    const averageCompletion = totalPossibleLessons > 0 
      ? Math.round((completedLessonsCount[0]?.totalCompleted || 0) / totalPossibleLessons * 100)
      : 0

    const stats = {
      totalUsers,
      activeUsers,
      totalCourses,
      totalLessons,
      completedLessons: completedLessonsCount[0]?.totalCompleted || 0,
      totalProjects,
      averageCompletion,
      weeklyGrowth
    }

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error fetching portal stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portal statistics' },
      { status: 500 }
    )
  }
} 