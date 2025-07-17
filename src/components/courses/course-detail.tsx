"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, BookOpen, CheckCircle, Circle, Play } from "lucide-react"

interface Lesson {
  _id: string
  title: string
  slug: string
  type: "lesson" | "project" | "assignment"
}

interface Module {
  _id: string
  title: string
  description: string
  slug: string
  lessons: Lesson[]
  estimatedHours: number
}

interface Course {
  _id: string
  title: string
  description: string
  slug: string
  modules: Module[]
  estimatedHours: number
  prerequisites: string[]
}

interface UserProgress {
  courseId: string
  moduleId: string
  lessonId: string
  completedLessons: string[]
  completedProjects: string[]
  totalProgress: number
}

interface CourseDetailProps {
  course: Course
}

export function CourseDetail({ course }: CourseDetailProps) {
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProgress() {
      try {
        const response = await fetch("/api/progress")
        if (response.ok) {
          const data = await response.json()
          setUserProgress(data)
        }
      } catch (error) {
        console.error("Error fetching progress:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [])

  const courseProgress = userProgress.find(p => p.courseId === course._id)
  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0)
  const completedLessons = courseProgress?.completedLessons.length || 0
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  const isLessonCompleted = (lessonId: string) => {
    return courseProgress?.completedLessons.includes(lessonId) || false
  }

  const getNextLesson = () => {
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (!isLessonCompleted(lesson._id)) {
          return {
            courseSlug: course.slug,
            moduleSlug: module.slug,
            lessonSlug: lesson.slug,
          }
        }
      }
    }
    return null
  }

  const nextLesson = getNextLesson()

  return (
    <div className="max-w-4xl mx-auto">
      {/* Course Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/courses" className="text-blue-600 hover:underline">
            Courses
          </Link>
          <span>/</span>
          <span className="text-gray-600">{course.title}</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
        <p className="text-gray-600 text-lg mb-6">{course.description}</p>
        
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            {course.estimatedHours} hours
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <BookOpen className="w-4 h-4 mr-1" />
            {course.modules.length} modules
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Play className="w-4 h-4 mr-1" />
            {totalLessons} lessons
          </div>
        </div>

        {course.prerequisites && course.prerequisites.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Prerequisites:</h3>
            <div className="flex flex-wrap gap-2">
              {course.prerequisites.map((prereq, index) => (
                <Badge key={index} variant="secondary">
                  {prereq}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Progress Section */}
        {!loading && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Your Progress</h3>
              <span className="text-sm text-gray-600">
                {completedLessons} of {totalLessons} lessons completed
              </span>
            </div>
            <Progress value={progressPercentage} className="mb-4" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {Math.round(progressPercentage)}% complete
              </span>
              {nextLesson && (
                <Link href={`/courses/${nextLesson.courseSlug}/${nextLesson.moduleSlug}/${nextLesson.lessonSlug}`}>
                  <Button>
                    Continue Learning
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Course Modules</h2>
        {course.modules.map((module, moduleIndex) => (
          <Card key={module._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    Module {moduleIndex + 1}: {module.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {module.description}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    {module.lessons.length} lessons
                  </div>
                  <div className="text-sm text-gray-600">
                    ~{module.estimatedHours} hours
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {module.lessons.map((lesson, lessonIndex) => (
                  <Link
                    key={lesson._id}
                    href={`/courses/${course.slug}/${module.slug}/${lesson.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isLessonCompleted(lesson._id) ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {lessonIndex + 1}. {lesson.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
                        </div>
                      </div>
                    </div>
                    <Badge variant={lesson.type === "project" ? "default" : "secondary"}>
                      {lesson.type}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}