import type { IProgress } from "@/lib/models/User"

/**
 * Calculate progress percentage for a course
 */
export function calculateCourseProgress(
  userProgress: IProgress[],
  courseId: string,
  totalLessons: number
): number {
  const courseProgress = userProgress.find(p => p.courseId === courseId)
  if (!courseProgress || totalLessons === 0) {
    return 0
  }
  
  return Math.round((courseProgress.completedLessons.length / totalLessons) * 100)
}

/**
 * Calculate progress percentage for a module
 */
export function calculateModuleProgress(
  userProgress: IProgress[],
  courseId: string,
  moduleLessons: string[]
): number {
  const courseProgress = userProgress.find(p => p.courseId === courseId)
  if (!courseProgress || moduleLessons.length === 0) {
    return 0
  }
  
  const completedModuleLessons = courseProgress.completedLessons.filter(
    lessonId => moduleLessons.includes(lessonId)
  )
  
  return Math.round((completedModuleLessons.length / moduleLessons.length) * 100)
}

/**
 * Check if a lesson is completed
 */
export function isLessonCompleted(
  userProgress: IProgress[],
  courseId: string,
  lessonId: string
): boolean {
  const courseProgress = userProgress.find(p => p.courseId === courseId)
  if (!courseProgress) {
    return false
  }
  
  return courseProgress.completedLessons.includes(lessonId)
}

/**
 * Get completed lessons count for a course
 */
export function getCompletedLessonsCount(
  userProgress: IProgress[],
  courseId: string
): number {
  const courseProgress = userProgress.find(p => p.courseId === courseId)
  if (!courseProgress) {
    return 0
  }
  
  return courseProgress.completedLessons.length
}

/**
 * Get completed lessons count for a module
 */
export function getCompletedModuleLessonsCount(
  userProgress: IProgress[],
  courseId: string,
  moduleLessons: string[]
): number {
  const courseProgress = userProgress.find(p => p.courseId === courseId)
  if (!courseProgress) {
    return 0
  }
  
  return courseProgress.completedLessons.filter(
    lessonId => moduleLessons.includes(lessonId)
  ).length
}

/**
 * Check if a course is completed
 */
export function isCourseCompleted(
  userProgress: IProgress[],
  courseId: string,
  totalLessons: number
): boolean {
  const courseProgress = userProgress.find(p => p.courseId === courseId)
  if (!courseProgress) {
    return false
  }
  
  return courseProgress.completedLessons.length >= totalLessons
}

/**
 * Check if a lesson can be accessed (previous lesson completed or first lesson)
 */
export function canAccessLesson(
  userProgress: IProgress[],
  courseId: string,
  lessonIndex: number,
  moduleLessons: string[]
): boolean {
  if (lessonIndex === 0) {
    return true // First lesson is always accessible
  }
  
  const previousLessonId = moduleLessons[lessonIndex - 1]
  return isLessonCompleted(userProgress, courseId, previousLessonId)
}

/**
 * Get user's current progress for a specific course
 */
export function getCourseProgress(
  userProgress: IProgress[],
  courseId: string
): IProgress | null {
  return userProgress.find(p => p.courseId === courseId) || null
} 