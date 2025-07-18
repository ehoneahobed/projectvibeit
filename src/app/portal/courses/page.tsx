"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Eye, 
  Clock, 
  Target,
  Loader2,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

type Course = {
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
  createdAt: string
  updatedAt: string
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/courses')
        if (!response.ok) {
          throw new Error('Failed to fetch courses')
        }

        const data = await response.json()
        if (data.success) {
          setCourses(data.data)
        } else {
          throw new Error(data.error || 'Failed to fetch courses')
        }
      } catch (err) {
        console.error('Error fetching courses:', err)
        setError('Failed to load courses')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Courses</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Course Management
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Manage and organize your learning content
            </p>
          </div>
          <Button asChild>
            <Link href="/portal/courses/add">
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Link>
          </Button>
        </div>
      </div>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </div>
                  <Badge variant={course.isPublished ? "default" : "secondary"}>
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Course Stats */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {course.modules}
                      </div>
                      <div className="text-muted-foreground">Modules</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {course.lessons}
                      </div>
                      <div className="text-muted-foreground">Lessons</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {course.projects}
                      </div>
                      <div className="text-muted-foreground">Projects</div>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{course.estimatedHours} hours estimated</span>
                    </div>
                    {course.prerequisites.length > 0 && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Target className="w-4 h-4" />
                        <span>{course.prerequisites.length} prerequisites</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/portal/courses/${course.slug}/edit`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/courses/${course.slug}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
          <p className="text-muted-foreground mb-6">
            Get started by creating your first course
          </p>
          <Button asChild>
            <Link href="/portal/courses/add">
              <Plus className="w-4 h-4 mr-2" />
              Create First Course
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
} 