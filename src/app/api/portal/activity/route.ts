import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"
import { formatDistanceToNow } from "date-fns"

type Activity = {
  id: string
  type: "user_registered" | "course_completed" | "project_submitted"
  title: string
  description: string
  time: string
  timestamp: Date
}

/**
 * GET /api/portal/activity
 * Get real recent activity for admin/contributor dashboard
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

    // Get recent user registrations
    const recentUsers = await User.find(
      { 
        archivedAt: { $exists: false },
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
      },
      { name: 1, email: 1, createdAt: 1 }
    )
    .sort({ createdAt: -1 })
    .limit(5)
    .lean()

    // Get recent course completions (users who completed all lessons in a course)
    const recentCompletions = await User.aggregate([
      { $unwind: '$progress' },
      {
        $lookup: {
          from: 'courses',
          localField: 'progress.courseId',
          foreignField: 'slug',
          as: 'course'
        }
      },
      { $unwind: '$course' },
      {
        $lookup: {
          from: 'modules',
          localField: 'course._id',
          foreignField: 'courseId',
          as: 'modules'
        }
      },
      { $unwind: '$modules' },
      {
        $lookup: {
          from: 'lessons',
          localField: 'modules._id',
          foreignField: 'moduleId',
          as: 'lessons'
        }
      },
      {
        $addFields: {
          totalLessons: { $size: '$lessons' },
          completedLessons: { $size: '$progress.completedLessons' }
        }
      },
      {
        $match: {
          $expr: { $eq: ['$totalLessons', '$completedLessons'] },
          'progress.completedAt': { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      },
      {
        $project: {
          userName: '$name',
          userEmail: '$email',
          courseTitle: '$course.title',
          completedAt: '$progress.completedAt'
        }
      },
      { $sort: { completedAt: -1 } },
      { $limit: 5 }
    ])

    // Get recent project submissions (users who completed project lessons)
    const recentProjects = await User.aggregate([
      { $unwind: '$progress' },
      {
        $lookup: {
          from: 'courses',
          localField: 'progress.courseId',
          foreignField: 'slug',
          as: 'course'
        }
      },
      { $unwind: '$course' },
      {
        $lookup: {
          from: 'modules',
          localField: 'course._id',
          foreignField: 'courseId',
          as: 'modules'
        }
      },
      { $unwind: '$modules' },
      {
        $lookup: {
          from: 'lessons',
          localField: 'modules._id',
          foreignField: 'moduleId',
          as: 'lessons'
        }
      },
      { $unwind: '$lessons' },
      {
        $match: {
          'lessons.type': 'project',
          'progress.completedLessons': { $in: ['$lessons._id'] }
        }
      },
      {
        $project: {
          userName: '$name',
          userEmail: '$email',
          projectTitle: '$lessons.title',
          courseTitle: '$course.title',
          completedAt: '$progress.completedAt'
        }
      },
      { $sort: { completedAt: -1 } },
      { $limit: 5 }
    ])

    // Combine and format activities
    const activities: Activity[] = []

    // Add user registrations
    recentUsers.forEach(user => {
      activities.push({
        id: `user_${user._id}`,
        type: "user_registered",
        title: "New user registered",
        description: `${user.name || user.email} joined the platform`,
        time: formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }),
        timestamp: user.createdAt
      })
    })

    // Add course completions
    recentCompletions.forEach(completion => {
      activities.push({
        id: `completion_${completion._id}`,
        type: "course_completed",
        title: "Course completed",
        description: `${completion.userName || completion.userEmail} completed ${completion.courseTitle}`,
        time: formatDistanceToNow(new Date(completion.completedAt), { addSuffix: true }),
        timestamp: completion.completedAt
      })
    })

    // Add project submissions
    recentProjects.forEach(project => {
      activities.push({
        id: `project_${project._id}`,
        type: "project_submitted",
        title: "Project submitted",
        description: `${project.userName || project.userEmail} submitted ${project.projectTitle}`,
        time: formatDistanceToNow(new Date(project.completedAt), { addSuffix: true }),
        timestamp: project.completedAt
      })
    })

    // Sort by timestamp and limit to 10 most recent
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
      .map(({ timestamp: _timestamp, ...activity }) => activity) // Remove timestamp from response

    return NextResponse.json({
      success: true,
      data: sortedActivities
    })
  } catch (error) {
    console.error('Error fetching portal activity:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recent activity' },
      { status: 500 }
    )
  }
} 