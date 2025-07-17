import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/auth"
import { AuthCheck } from "@/components/auth/auth-check"
import { CoursesList } from "@/components/courses/courses-list"
import { CoursesListSkeleton } from "@/components/courses/courses-list-skeleton"

export default async function CoursesPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Available Courses
          </h1>
          <p className="text-gray-600">
            Start your learning journey with our comprehensive courses
          </p>
        </div>
        
        <Suspense fallback={<CoursesListSkeleton />}>
          <CoursesList />
        </Suspense>
      </div>
    </AuthCheck>
  )
}