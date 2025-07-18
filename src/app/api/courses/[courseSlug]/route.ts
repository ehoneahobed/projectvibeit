import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Course, User } from "@/lib/models"

interface CourseParams {
  params: Promise<{
    courseSlug: string
  }>
}

interface TransformedLesson {
  id: string
  title: string
  description: string
  slug: string
  order: number
  type: string
  isPublished: boolean
  content?: string
  resources?: Array<{ title: string; url: string; type: string }>
  assignment?: Record<string, unknown>
}

interface TransformedModule {
  id: string
  title: string
  description: string
  slug: string
  order: number
  estimatedHours: number
  lessons: TransformedLesson[]
}

interface TransformedCourse {
  id: string
  title: string
  description: string
  slug: string
  order: number
  isPublished: boolean
  estimatedHours: number
  prerequisites: string[]
  modules: TransformedModule[]
  totalModules: number
  totalLessons: number
  totalProjects: number
  students: number
  createdAt: Date
  updatedAt: Date
}

interface DatabaseModule {
  _id: string
  title: string
  description: string
  slug: string
  order: number
  estimatedHours: number
  lessons?: DatabaseLesson[]
}

interface DatabaseLesson {
  _id: string
  title: string
  description: string
  slug: string
  order: number
  type: string
  isPublished: boolean
  content?: string
  resources?: Array<{ title: string; url: string; type: string }>
  assignment?: Record<string, unknown>
}

export async function GET(request: NextRequest, { params }: CourseParams) {
  try {
    await connectDB()
    
    const { courseSlug } = await params
    
    const course = await Course.findOne({ 
      slug: courseSlug,
      isPublished: true 
    })
    .populate({
      path: 'modules',
      select: 'title description slug order lessons estimatedHours',
      match: { isPublished: true },
      populate: {
        path: 'lessons',
        select: 'title description slug order type isPublished content resources assignment',
        match: { isPublished: true },
        options: { sort: { order: 1 } }
      },
      options: { sort: { order: 1 } }
    })
    .lean() as unknown as {
      _id: string
      title: string
      description: string
      slug: string
      order: number
      isPublished: boolean
      estimatedHours: number
      prerequisites: string[]
      modules: DatabaseModule[]
      createdAt: Date
      updatedAt: Date
    }

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }

    // Get enrollment count for this specific course
    const enrollmentCount = await User.countDocuments({
      'progress.courseId': courseSlug
    })

    // Transform the data
    const totalLessons = course.modules.reduce((acc: number, module) => {
      return acc + (module.lessons?.length || 0)
    }, 0)
    
    const totalProjects = course.modules.reduce((acc: number, module) => {
      return acc + (module.lessons?.filter((lesson) => lesson.type === 'project').length || 0)
    }, 0)

    const transformedCourse: TransformedCourse = {
      id: course._id,
      title: course.title,
      description: course.description,
      slug: course.slug,
      order: course.order,
      isPublished: course.isPublished,
      estimatedHours: course.estimatedHours,
      prerequisites: course.prerequisites,
      modules: course.modules.map(module => ({
        id: module._id,
        title: module.title,
        description: module.description,
        slug: module.slug,
        order: module.order,
        estimatedHours: module.estimatedHours,
        lessons: (module.lessons || []).map(lesson => ({
          id: lesson._id,
          title: lesson.title,
          description: lesson.description,
          slug: lesson.slug,
          order: lesson.order,
          type: lesson.type,
          isPublished: lesson.isPublished,
          content: lesson.content,
          resources: lesson.resources,
          assignment: lesson.assignment
        }))
      })),
      totalModules: course.modules.length,
      totalLessons,
      totalProjects,
      students: enrollmentCount,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    }

    return NextResponse.json({
      success: true,
      data: transformedCourse
    })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch course' 
      },
      { status: 500 }
    )
  }
} 