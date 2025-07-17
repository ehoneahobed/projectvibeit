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
    .map((slug, index) => {
      const metaPath = path.join(coursesDir, slug, 'meta.json')
      
      if (!fs.existsSync(metaPath)) {
        return null
      }

      try {
        const metaContent = fs.readFileSync(metaPath, 'utf8')
        const rawData = JSON.parse(metaContent)
        
        // Transform the raw JSON data to match the CourseMeta interface
        const course: CourseMeta = {
          id: slug, // Use slug as id since it's not in the JSON
          title: rawData.title,
          description: rawData.description,
          slug: rawData.slug,
          order: rawData.order || index, // Use index as fallback
          isPublished: rawData.published || rawData.isPublished || false, // Handle both published and isPublished
          estimatedHours: rawData.estimatedHours || Math.ceil((rawData.modules?.length || 0) * 2), // Estimate based on modules
          prerequisites: rawData.prerequisites || [],
          rating: rawData.rating,
          students: rawData.students,
          modules: (rawData.modules || []).map((moduleData: Record<string, unknown>, moduleIndex: number) => ({
            id: (moduleData.slug as string) || `module-${moduleIndex}`, // Use slug as id
            title: moduleData.title as string,
            description: moduleData.description as string,
            slug: moduleData.slug as string,
            order: (moduleData.order as number) || moduleIndex, // Use index as fallback
            estimatedHours: (moduleData.estimatedHours as number) || Math.ceil(((moduleData.lessons as unknown[])?.length || 0) * 0.5), // Estimate based on lessons
            lessons: ((moduleData.lessons as unknown[]) || []).map((lessonData: unknown, lessonIndex: number) => {
              const lesson = lessonData as Record<string, unknown>
              return {
                id: (lesson.slug as string) || `lesson-${lessonIndex}`, // Use slug as id
                title: lesson.title as string,
                description: lesson.description as string,
                slug: lesson.slug as string,
                order: (lesson.order as number) || lessonIndex, // Use index as fallback
                type: (lesson.type as 'lesson' | 'project' | 'assignment') || 'lesson', // Default to lesson type
                isPublished: (lesson.isPublished as boolean) !== false // Default to true unless explicitly false
              }
            })
          }))
        }
        
        return course
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

  const courseModule = course.modules.find(m => m.slug === moduleSlug)
  if (!courseModule) return null

  // Load all lessons for this module
  const lessons = courseModule.lessons
    .map(lesson => {
      const lessonContent = getLessonContent(courseSlug, moduleSlug, lesson.slug)
      return lessonContent ? { ...lesson, content: lessonContent } : null
    })
    .filter((lesson): lesson is NonNullable<typeof lesson> => lesson !== null)
    .sort((a, b) => a.order - b.order)

  return {
    ...courseModule,
    lessons
  }
}

/**
 * Get navigation data for a lesson (previous/next) with cross-module support
 */
export function getLessonNavigation(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string
) {
  const course = getCourseBySlug(courseSlug)
  if (!course) return null

  const courseModule = course.modules.find(m => m.slug === moduleSlug)
  if (!courseModule) return null

  const currentLessonIndex = courseModule.lessons.findIndex(l => l.slug === lessonSlug)
  if (currentLessonIndex === -1) return null

  const currentLesson = courseModule.lessons[currentLessonIndex]
  
  // Find previous lesson (within same module or from previous module)
  let previousLesson = null
  if (currentLessonIndex > 0) {
    // Previous lesson in same module
    previousLesson = {
      ...courseModule.lessons[currentLessonIndex - 1],
      moduleSlug: courseModule.slug
    }
  } else {
    // Look for last lesson in previous module
    const currentModuleIndex = course.modules.findIndex(m => m.slug === moduleSlug)
    if (currentModuleIndex > 0) {
      const previousModule = course.modules[currentModuleIndex - 1]
      if (previousModule.lessons.length > 0) {
        previousLesson = {
          ...previousModule.lessons[previousModule.lessons.length - 1],
          moduleSlug: previousModule.slug
        }
      }
    }
  }

  // Find next lesson (within same module or from next module)
  let nextLesson = null
  if (currentLessonIndex < courseModule.lessons.length - 1) {
    // Next lesson in same module
    nextLesson = {
      ...courseModule.lessons[currentLessonIndex + 1],
      moduleSlug: courseModule.slug
    }
  } else {
    // Look for first lesson in next module
    const currentModuleIndex = course.modules.findIndex(m => m.slug === moduleSlug)
    if (currentModuleIndex < course.modules.length - 1) {
      const nextModule = course.modules[currentModuleIndex + 1]
      if (nextModule.lessons.length > 0) {
        nextLesson = {
          ...nextModule.lessons[0],
          moduleSlug: nextModule.slug
        }
      }
    }
  }

  return {
    current: currentLesson,
    previous: previousLesson,
    next: nextLesson,
    module: courseModule,
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