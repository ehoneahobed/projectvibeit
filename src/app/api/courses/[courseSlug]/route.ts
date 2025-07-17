import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import { Course } from "@/lib/models"

interface RouteParams {
  params: {
    courseSlug: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase()
    
    const course = await Course.findOne({ 
      slug: params.courseSlug,
      isPublished: true 
    })
      .populate({
        path: "modules",
        match: { isPublished: true },
        options: { sort: { order: 1 } },
        populate: {
          path: "lessons",
          match: { isPublished: true },
          options: { sort: { order: 1 } },
        },
      })
      .lean()

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error("Error fetching course:", error)
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    )
  }
}