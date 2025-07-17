import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"

/**
 * GET /api/progress
 * Get user's progress for all courses
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

    await connectDB()
    
    const user = await User.findById(session.user.id, { progress: 1 }).lean()
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    // Ensure proper serialization of progress data
    const progress = (user as any).progress || []
    const serializedProgress = progress.map((p: any) => ({
      courseId: p.courseId,
      moduleId: p.moduleId,
      lessonId: p.lessonId,
      completedLessons: p.completedLessons || [],
      completedProjects: p.completedProjects || [],
      totalProgress: p.totalProgress || 0
    }))

    return NextResponse.json({
      success: true,
      data: serializedProgress
    })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/progress
 * Update user's progress for a specific course/module/lesson
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
    const { courseId, moduleId, lessonId, action } = body

    if (!courseId || !moduleId || !lessonId || !action) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!['complete', 'uncomplete'].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      )
    }

    await connectDB()
    
    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    // Find existing progress for this course
    let courseProgress = user.progress.find((p: any) => p.courseId === courseId)
    
    if (!courseProgress) {
      // Create new progress entry for this course
      courseProgress = {
        courseId,
        moduleId,
        lessonId,
        completedLessons: [],
        completedProjects: [],
        totalProgress: 0
      }
      user.progress.push(courseProgress)
    }

    // Update the current module and lesson
    courseProgress.moduleId = moduleId
    courseProgress.lessonId = lessonId

    // Handle lesson completion
    if (action === 'complete') {
      if (!courseProgress.completedLessons.includes(lessonId)) {
        courseProgress.completedLessons.push(lessonId)
      }
    } else {
      // Remove from completed lessons
      courseProgress.completedLessons = courseProgress.completedLessons.filter(
        (id: string) => id !== lessonId
      )
    }

    await user.save()

    // Return serialized progress data to prevent circular references
    const serializedProgress = {
      courseId: courseProgress.courseId,
      moduleId: courseProgress.moduleId,
      lessonId: courseProgress.lessonId,
      completedLessons: courseProgress.completedLessons || [],
      completedProjects: courseProgress.completedProjects || [],
      totalProgress: courseProgress.totalProgress || 0
    }

    return NextResponse.json({
      success: true,
      data: serializedProgress
    })
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update progress' },
      { status: 500 }
    )
  }
} 