"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, Users } from "lucide-react"

interface Course {
  _id: string
  title: string
  description: string
  slug: string
  estimatedHours: number
  modules: any[]
  prerequisites: string[]
}

export function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("/api/courses")
        if (!response.ok) {
          throw new Error("Failed to fetch courses")
        }
        const data = await response.json()
        setCourses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) {
    return <div>Loading courses...</div>
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
        <p className="text-gray-600">Check back soon for new courses!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Link key={course._id} href={`/courses/${course.slug}`}>
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-xl">{course.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {course.estimatedHours} hours
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {course.modules?.length || 0} modules
                </div>
              </div>
              
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Prerequisites:</p>
                  <div className="flex flex-wrap gap-1">
                    {course.prerequisites.map((prereq, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <Badge variant="default">Start Learning</Badge>
                <Users className="w-4 h-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}