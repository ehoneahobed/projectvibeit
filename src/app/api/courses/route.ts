import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import { Course } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const courses = await Course.find({ isPublished: true })
      .sort({ order: 1 })
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

    return NextResponse.json(courses)
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    )
  }
}