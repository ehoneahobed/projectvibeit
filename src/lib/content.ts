import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface ContentMeta {
  title: string
  description: string
  type: 'lesson' | 'project' | 'assignment'
  order: number
  resources?: Array<{
    title: string
    url: string
    type: 'article' | 'video' | 'tool' | 'documentation'
  }>
  assignment?: {
    title: string
    description: string
    instructions: string
    submissionType: 'github' | 'url' | 'text'
    starterCode?: string
  }
}

export interface CourseMeta {
  id: string
  title: string
  description: string
  slug: string
  order: number
  isPublished: boolean
  estimatedHours: number
  prerequisites: string[]
  rating?: number
  students?: number
  modules: Array<{
    id: string
    title: string
    description: string
    slug: string
    order: number
    estimatedHours: number
    lessons: Array<{
      id: string
      title: string
      description: string
      slug: string
      order: number
      type: 'lesson' | 'project' | 'assignment'
      isPublished: boolean
    }>
  }>
}

export interface LessonContent {
  meta: ContentMeta
  content: string
}

const contentDirectory = path.join(process.cwd(), 'content')

/**
 * Get all course metadata from the content directory
 */
export function getAllCourses(): CourseMeta[] {
  const coursesDir = path.join(contentDirectory, 'courses')
  
  if (!fs.existsSync(coursesDir)) {
    return []
  }

  const courseSlugs = fs.readdirSync(coursesDir)
  
  return courseSlugs
    .map(slug => {
      const metaPath = path.join(coursesDir, slug, 'meta.json')
      
      if (!fs.existsSync(metaPath)) {
        return null
      }

      try {
        const metaContent = fs.readFileSync(metaPath, 'utf8')
        return JSON.parse(metaContent) as CourseMeta
      } catch (error) {
        console.error(`Error parsing course meta for ${slug}:`, error)
        return null
      }
    })
    .filter((course): course is CourseMeta => course !== null)
    .sort((a, b) => a.order - b.order)
}

/**
 * Get a specific course by slug
 */
export function getCourseBySlug(slug: string): CourseMeta | null {
  const courses = getAllCourses()
  return courses.find(course => course.slug === slug) || null
}

/**
 * Get all published courses
 */
export function getPublishedCourses(): CourseMeta[] {
  const courses = getAllCourses()
  return courses.filter(course => course.isPublished)
}

/**
 * Get lesson content by course, module, and lesson slugs
 */
export function getLessonContent(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
): LessonContent | null {
  try {
    const lessonPath = path.join(
      contentDirectory,
      'courses',
      courseSlug,
      'modules',
      moduleSlug,
      'lessons',
      `${lessonSlug}.mdx`
    )

    if (!fs.existsSync(lessonPath)) {
      return null
    }

    const fileContent = fs.readFileSync(lessonPath, 'utf8')
    const { data, content } = matter(fileContent)

    return {
      meta: data as ContentMeta,
      content
    }
  } catch (error) {
    console.error(`Error loading lesson content:`, error)
    return null
  }
}

/**
 * Get module content by course and module slugs
 */
export function getModuleContent(courseSlug: string, moduleSlug: string) {
  const course = getCourseBySlug(courseSlug)
  if (!course) return null

  const module = course.modules.find(m => m.slug === moduleSlug)
  if (!module) return null

  // Load all lessons for this module
  const lessons = module.lessons
    .map(lesson => {
      const lessonContent = getLessonContent(courseSlug, moduleSlug, lesson.slug)
      return lessonContent ? { ...lesson, content: lessonContent } : null
    })
    .filter((lesson): lesson is any => lesson !== null)
    .sort((a, b) => a.order - b.order)

  return {
    ...module,
    lessons
  }
}

/**
 * Get navigation data for a lesson (previous/next)
 */
export function getLessonNavigation(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
) {
  const course = getCourseBySlug(courseSlug)
  if (!course) return null

  const module = course.modules.find(m => m.slug === moduleSlug)
  if (!module) return null

  const currentLessonIndex = module.lessons.findIndex(l => l.slug === lessonSlug)
  if (currentLessonIndex === -1) return null

  const currentLesson = module.lessons[currentLessonIndex]
  const previousLesson = currentLessonIndex > 0 ? module.lessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < module.lessons.length - 1 ? module.lessons[currentLessonIndex + 1] : null

  return {
    current: currentLesson,
    previous: previousLesson,
    next: nextLesson,
    module,
    course
  }
}

/**
 * Get all lessons for a course
 */
export function getCourseLessons(courseSlug: string) {
  const course = getCourseBySlug(courseSlug)
  if (!course) return []

  const lessons: Array<{
    courseSlug: string
    moduleSlug: string
    lessonSlug: string
    title: string
    description: string
    type: 'lesson' | 'project' | 'assignment'
    order: number
    moduleTitle: string
    moduleOrder: number
  }> = []

  course.modules.forEach(module => {
    module.lessons.forEach(lesson => {
      lessons.push({
        courseSlug,
        moduleSlug: module.slug,
        lessonSlug: lesson.slug,
        title: lesson.title,
        description: lesson.description,
        type: lesson.type,
        order: lesson.order,
        moduleTitle: module.title,
        moduleOrder: module.order
      })
    })
  })

  return lessons.sort((a, b) => {
    if (a.moduleOrder !== b.moduleOrder) {
      return a.moduleOrder - b.moduleOrder
    }
    return a.order - b.order
  })
} 