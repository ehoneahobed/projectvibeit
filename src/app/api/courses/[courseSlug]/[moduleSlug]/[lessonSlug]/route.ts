import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import { Course, Module, Lesson } from "@/lib/models"

interface RouteParams {
  params: {
    courseSlug: string
    moduleSlug: string
    lessonSlug: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase()
    
    // First find the course
    const course = await Course.findOne({ 
      slug: params.courseSlug,
      isPublished: true 
    }).lean()

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }

    // Find the module
    const module = await Module.findOne({
      slug: params.moduleSlug,
      courseId: course._id,
    }).lean()

    if (!module) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      )
    }

    // Find the lesson
    const lesson = await Lesson.findOne({
      slug: params.lessonSlug,
      moduleId: module._id,
      isPublished: true,
    }).lean()

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      )
    }

    // Get navigation info (previous/next lessons)
    const allLessonsInModule = await Lesson.find({
      moduleId: module._id,
      isPublished: true,
    })
      .sort({ order: 1 })
      .select("_id title slug order")
      .lean()

    const currentLessonIndex = allLessonsInModule.findIndex(
      (l) => l._id.toString() === lesson._id.toString()
    )

    const navigation = {
      previous: currentLessonIndex > 0 ? allLessonsInModule[currentLessonIndex - 1] : null,
      next: currentLessonIndex < allLessonsInModule.length - 1 ? allLessonsInModule[currentLessonIndex + 1] : null,
    }

    return NextResponse.json({
      course,
      module,
      lesson,
      navigation,
    })
  } catch (error) {
    console.error("Error fetching lesson:", error)
    return NextResponse.json(
      { error: "Failed to fetch lesson" },
      { status: 500 }
    )
  }
}