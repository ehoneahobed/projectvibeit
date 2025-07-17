import { Suspense } from "react"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { auth } from "@/lib/auth/auth"
import { AuthCheck } from "@/components/auth/auth-check"
import { CourseDetail } from "@/components/courses/course-detail"
import { CourseDetailSkeleton } from "@/components/courses/course-detail-skeleton"
import { connectToDatabase } from "@/lib/mongoose"
import { Course } from "@/lib/models"

interface CoursePageProps {
  params: {
    courseSlug: string
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

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
      notFound()
    }

    return (
      <AuthCheck>
        <Suspense fallback={<CourseDetailSkeleton />}>
          <CourseDetail course={course} />
        </Suspense>
      </AuthCheck>
    )
  } catch (error) {
    console.error("Error loading course:", error)
    notFound()
  }
}