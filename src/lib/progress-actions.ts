"use server"

import { auth } from "@/lib/auth/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"

/**
 * Get user's progress for all courses
 */
export async function getUserProgress() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized", data: null }
    }

    await connectDB()
    
    const user = await User.findById(session.user.id, { progress: 1 }).lean()
    if (!user) {
      return { success: false, error: "User not found", data: null }
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

    return { success: true, data: serializedProgress, error: null }
  } catch (error) {
    console.error('Error fetching user progress:', error)
    return { success: false, error: 'Failed to fetch progress', data: null }
  }
}

/**
 * Mark a lesson as completed
 */
export async function completeLesson(
  courseId: string,
  moduleId: string,
  lessonId: string
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized", data: null }
    }

    await connectDB()
    
    const user = await User.findById(session.user.id)
    if (!user) {
      return { success: false, error: "User not found", data: null }
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

    // Add lesson to completed if not already there
    if (!courseProgress.completedLessons.includes(lessonId)) {
      courseProgress.completedLessons.push(lessonId)
      
      // Check if course is now completed
      const course = await import('@/lib/content').then(m => m.getCourseBySlug(courseId))
      if (course) {
        const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0)
        if (courseProgress.completedLessons.length >= totalLessons && !courseProgress.completedAt) {
          courseProgress.completedAt = new Date()
        }
      }
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

    return { success: true, data: serializedProgress, error: null }
  } catch (error) {
    console.error('Error completing lesson:', error)
    return { success: false, error: 'Failed to complete lesson', data: null }
  }
}

/**
 * Mark a lesson as incomplete
 */
export async function uncompleteLesson(
  courseId: string,
  moduleId: string,
  lessonId: string
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized", data: null }
    }

    await connectDB()
    
    const user = await User.findById(session.user.id)
    if (!user) {
      return { success: false, error: "User not found", data: null }
    }

    // Find existing progress for this course
    const courseProgress = user.progress.find((p: any) => p.courseId === courseId)
    
    if (!courseProgress) {
      return { success: false, error: "No progress found for this course", data: null }
    }

    // Update the current module and lesson
    courseProgress.moduleId = moduleId
    courseProgress.lessonId = lessonId

    // Remove lesson from completed
    courseProgress.completedLessons = courseProgress.completedLessons.filter(
      (id: string) => id !== lessonId
    )

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

    return { success: true, data: serializedProgress, error: null }
  } catch (error) {
    console.error('Error uncompleting lesson:', error)
    return { success: false, error: 'Failed to uncomplete lesson', data: null }
  }
} 