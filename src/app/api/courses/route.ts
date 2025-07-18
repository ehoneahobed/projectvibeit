import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Course, User } from "@/lib/models"

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
  modules: number
  lessons: number
  projects: number
  students: number
  createdAt: Date
  updatedAt: Date
}

export async function GET(_request: NextRequest) {
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
      .lean() as unknown as Array<{
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
      }>

    // Get enrollment counts for all courses
    const enrollmentCounts = await User.aggregate([
      {
        $match: {
          'progress.courseId': { $exists: true, $ne: [] }
        }
      },
      {
        $unwind: '$progress'
      },
      {
        $group: {
          _id: '$progress.courseId',
          studentCount: { $addToSet: '$_id' }
        }
      },
      {
        $project: {
          courseId: '$_id',
          studentCount: { $size: '$studentCount' }
        }
      }
    ])

    // Create a map for quick lookup
    const enrollmentMap = new Map(
      enrollmentCounts.map(item => [item.courseId, item.studentCount])
    )

    // Transform the data to include calculated fields
    const transformedCourses: TransformedCourse[] = courses.map(course => {
      const totalLessons = course.modules.reduce((acc: number, module) => {
        return acc + (module.lessons?.length || 0)
      }, 0)
      
      const totalProjects = course.modules.reduce((acc: number, module) => {
        return acc + (module.lessons?.filter((lesson) => lesson.type === 'project').length || 0)
      }, 0)

      // Get enrollment count for this course
      const studentCount = enrollmentMap.get(course.slug) || 0

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
        students: studentCount,
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