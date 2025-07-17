import { Suspense } from "react"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { auth } from "@/lib/auth/auth"
import { AuthCheck } from "@/components/auth/auth-check"
import { LessonView } from "@/components/lessons/lesson-view"
import { LessonViewSkeleton } from "@/components/lessons/lesson-view-skeleton"
import { connectToDatabase } from "@/lib/mongoose"
import { Course, Module, Lesson } from "@/lib/models"

interface LessonPageProps {
  params: {
    courseSlug: string
    moduleSlug: string
    lessonSlug: string
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  try {
    await connectToDatabase()
    
    // First find the course
    const course = await Course.findOne({ 
      slug: params.courseSlug,
      isPublished: true 
    }).lean()

    if (!course) {
      notFound()
    }

    // Find the module
    const module = await Module.findOne({
      slug: params.moduleSlug,
      courseId: course._id,
    }).lean()

    if (!module) {
      notFound()
    }

    // Find the lesson
    const lesson = await Lesson.findOne({
      slug: params.lessonSlug,
      moduleId: module._id,
      isPublished: true,
    }).lean()

    if (!lesson) {
      notFound()
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

    const lessonData = {
      course,
      module,
      lesson,
      navigation,
    }

    return (
      <AuthCheck>
        <Suspense fallback={<LessonViewSkeleton />}>
          <LessonView lessonData={lessonData} />
        </Suspense>
      </AuthCheck>
    )
  } catch (error) {
    console.error("Error loading lesson:", error)
    notFound()
  }
}