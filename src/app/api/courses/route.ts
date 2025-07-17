import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Course } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const courses = await Course.find({ isPublished: true })
      .populate({
        path: 'modules',
        select: 'title description slug order lessons estimatedHours',
        populate: {
          path: 'lessons',
          select: 'title description slug order type isPublished',
          match: { isPublished: true }
        }
      })
      .sort({ order: 1 })
      .lean()

    // Transform the data to include calculated fields
    const transformedCourses = courses.map(course => {
      const totalLessons = course.modules.reduce((acc: number, module: any) => {
        return acc + (module.lessons?.length || 0)
      }, 0)
      
      const totalProjects = course.modules.reduce((acc: number, module: any) => {
        return acc + (module.lessons?.filter((lesson: any) => lesson.type === 'project').length || 0)
      }, 0)

      return {
        id: course._id,
        title: course.title,
        description: course.description,
        slug: course.slug,
        order: course.order,
        isPublished: course.isPublished,
        estimatedHours: course.estimatedHours,
        prerequisites: course.prerequisites,
        modules: course.modules.length,
        lessons: totalLessons,
        projects: totalProjects,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt
      }
    })

    return NextResponse.json({
      success: true,
      data: transformedCourses
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch courses' 
      },
      { status: 500 }
    )
  }
} 