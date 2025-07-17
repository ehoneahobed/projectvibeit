import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Course } from "@/lib/models"

interface CourseParams {
  params: {
    courseSlug: string
  }
}

export async function GET(request: NextRequest, { params }: CourseParams) {
  try {
    await connectDB()
    
    const course = await Course.findOne({ 
      slug: params.courseSlug,
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
    .lean() as any

    if (!course) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Course not found' 
        },
        { status: 404 }
      )
    }

    // Transform the data to include calculated fields
    const transformedCourse = {
      id: course._id,
      title: course.title,
      description: course.description,
      slug: course.slug,
      order: course.order,
      isPublished: course.isPublished,
      estimatedHours: course.estimatedHours,
      prerequisites: course.prerequisites,
      modules: (course.modules || []).map((module: any) => ({
        id: module._id,
        title: module.title,
        description: module.description,
        slug: module.slug,
        order: module.order,
        estimatedHours: module.estimatedHours,
        lessons: (module.lessons || []).map((lesson: any) => ({
          id: lesson._id,
          title: lesson.title,
          description: lesson.description,
          slug: lesson.slug,
          order: lesson.order,
          type: lesson.type,
          isPublished: lesson.isPublished,
          hasContent: !!lesson.content,
          hasResources: lesson.resources?.length > 0,
          hasAssignment: !!lesson.assignment
        })),
        totalLessons: (module.lessons || []).length,
        completedLessons: 0 // This will be calculated based on user progress
      })),
      totalModules: (course.modules || []).length,
      totalLessons: (course.modules || []).reduce((acc: number, module: any) => {
        return acc + ((module.lessons || []).length)
      }, 0),
      totalProjects: (course.modules || []).reduce((acc: number, module: any) => {
        return acc + ((module.lessons || []).filter((lesson: any) => lesson.type === 'project').length)
      }, 0),
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