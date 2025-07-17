import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import { User } from "@/lib/models"
import { auth } from "@/lib/auth/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectToDatabase()
    
    const user = await User.findOne({ email: session.user.email })
      .select("progress")
      .lean()

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(user.progress || [])
  } catch (error) {
    console.error("Error fetching progress:", error)
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { courseId, moduleId, lessonId, completedLessons, completedProjects, totalProgress } = body

    if (!courseId || !moduleId || !lessonId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    await connectToDatabase()
    
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Find existing progress for this course
    const existingProgressIndex = user.progress.findIndex(
      (p) => p.courseId === courseId
    )

    const progressData = {
      courseId,
      moduleId,
      lessonId,
      completedLessons: completedLessons || [],
      completedProjects: completedProjects || [],
      totalProgress: totalProgress || 0,
    }

    if (existingProgressIndex >= 0) {
      // Update existing progress
      user.progress[existingProgressIndex] = progressData
    } else {
      // Add new progress
      user.progress.push(progressData)
    }

    await user.save()

    return NextResponse.json(progressData)
  } catch (error) {
    console.error("Error updating progress:", error)
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    )
  }
}