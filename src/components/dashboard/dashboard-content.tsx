"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Play
} from "lucide-react"

interface UserProgress {
  courseId: string
  moduleId: string
  lessonId: string
  completedLessons: string[]
  completedProjects: string[]
  totalProgress: number
}

interface Course {
  _id: string
  title: string
  description: string
  slug: string
  estimatedHours: number
  modules: any[]
}

export function DashboardContent() {
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user progress
        const progressResponse = await fetch("/api/progress")
        if (progressResponse.ok) {
          const progressData = await progressResponse.json()
          setUserProgress(progressData)
        }

        // Fetch courses
        const coursesResponse = await fetch("/api/courses")
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json()
          setCourses(coursesData)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalCompletedLessons = userProgress.reduce(
    (acc, progress) => acc + progress.completedLessons.length,
    0
  )

  const totalCompletedProjects = userProgress.reduce(
    (acc, progress) => acc + progress.completedProjects.length,
    0
  )

  const totalLessons = courses.reduce(
    (acc, course) => acc + course.modules.reduce(
      (moduleAcc, module) => moduleAcc + module.lessons.length,
      0
    ),
    0
  )

  const overallProgress = totalLessons > 0 ? (totalCompletedLessons / totalLessons) * 100 : 0

  const getNextLesson = () => {
    for (const course of courses) {
      const courseProgress = userProgress.find(p => p.courseId === course._id)
      for (const module of course.modules) {
        for (const lesson of module.lessons) {
          if (!courseProgress?.completedLessons.includes(lesson._id)) {
            return {
              courseSlug: course.slug,
              moduleSlug: module.slug,
              lessonSlug: lesson.slug,
              title: lesson.title,
              courseTitle: course.title,
            }
          }
        }
      }
    }
    return null
  }

  const nextLesson = getNextLesson()

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompletedLessons}</div>
            <p className="text-xs text-muted-foreground">
              out of {totalLessons} total lessons
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects Completed</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompletedProjects}</div>
            <p className="text-xs text-muted-foreground">
              hands-on projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              available courses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning */}
      {nextLesson && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Continue Learning
            </CardTitle>
            <CardDescription>
              Pick up where you left off
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{nextLesson.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {nextLesson.courseTitle}
                </p>
              </div>
              <Link href={`/courses/${nextLesson.courseSlug}/${nextLesson.moduleSlug}/${nextLesson.lessonSlug}`}>
                <Button>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course Progress */}
      {courses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Courses</CardTitle>
            <CardDescription>
              Track your progress across all courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.map((course) => {
                const courseProgress = userProgress.find(p => p.courseId === course._id)
                const totalCourseLessons = course.modules.reduce(
                  (acc, module) => acc + module.lessons.length,
                  0
                )
                const completedCourseLessons = courseProgress?.completedLessons.length || 0
                const courseProgressPercentage = totalCourseLessons > 0 
                  ? (completedCourseLessons / totalCourseLessons) * 100 
                  : 0

                return (
                  <div key={course._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {completedCourseLessons} of {totalCourseLessons} lessons completed
                      </p>
                      <Progress value={courseProgressPercentage} className="mt-2 w-48" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {Math.round(courseProgressPercentage)}%
                      </Badge>
                      <Link href={`/courses/${course.slug}`}>
                        <Button variant="outline" size="sm">
                          View Course
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started with your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/courses">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-medium">Browse Courses</h3>
                      <p className="text-sm text-muted-foreground">
                        Explore all available courses
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/portal/progress">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-medium">View Progress</h3>
                      <p className="text-sm text-muted-foreground">
                        Check your learning progress
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}