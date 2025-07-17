import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getCourseBySlug } from "@/lib/content"
import { notFound } from "next/navigation"
import { 
  BookOpen, 
  Clock, 
  Users, 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Star,
  Play,
  Lock
} from "lucide-react"

interface CoursePageProps {
  params: Promise<{
    courseSlug: string
  }>
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseSlug } = await params
  
  const course = getCourseBySlug(courseSlug)
  
  if (!course) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Course Header */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Course Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Course
                </Badge>
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                  <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                  {course.rating}
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                {course.title}
              </h1>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {course.modules.length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Modules</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {course.modules.reduce((acc, module) => acc + module.lessons.length, 0)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {course.estimatedHours}h
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {(course.students || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Students</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Your Progress
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    15%
                  </span>
                </div>
                <Progress value={15} className="h-2" />
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link href={`/courses/${course.slug}/${course.modules[0].slug}/${course.modules[0].lessons[0].id}`}>
                    Continue Learning
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                  <Link href={`/courses/${course.slug}/overview`}>
                    Course Overview
                  </Link>
                </Button>
              </div>
            </div>

            {/* Course Preview Card */}
            <div className="lg:w-80">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl">Course Preview</CardTitle>
                  <CardDescription>
                    Get a taste of what you'll learn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900 dark:text-white">What you'll learn:</h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        Modern JavaScript and ES6+ features
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        React fundamentals and hooks
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        Next.js and modern tooling
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        Database design and APIs
                      </li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button asChild className="w-full">
                      <Link href={`/courses/${course.slug}/${course.modules[0].slug}/${course.modules[0].lessons[0].id}`}>
                        <Play className="w-4 h-4 mr-2" />
                        Start Learning
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Course Modules
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Follow the structured learning path designed to build your skills progressively
            </p>
          </div>

          <div className="space-y-6">
            {course.modules.map((module, index) => (
              <Card key={module.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <Badge variant="secondary">
                          Module {module.order}
                        </Badge>
                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                          <Clock className="w-4 h-4 mr-1" />
                          {Math.round((module.lessons.length * 2.5))} min
                        </div>
                      </div>
                      <CardTitle className="text-2xl mb-2">
                        {module.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {module.description}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        0/{module.lessons.length} completed
                      </div>
                      <Progress value={0} className="w-24 h-2" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const isCompleted = false // TODO: Get from user progress
                      const isFirstLesson = lessonIndex === 0
                      const isPreviousCompleted = lessonIndex === 0 || false // TODO: Get from user progress
                      const canAccess = isFirstLesson || isPreviousCompleted

                      return (
                        <div
                          key={lesson.id}
                          className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                            canAccess 
                              ? 'hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer' 
                              : 'opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : canAccess ? (
                              <Circle className="w-5 h-5 text-slate-400" />
                            ) : (
                              <Lock className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900 dark:text-white">
                                {lesson.title}
                              </span>
                              {lesson.type === 'project' && (
                                <Badge variant="outline" className="text-xs">
                                  Project
                                </Badge>
                              )}
                            </div>
                          </div>

                          {canAccess && (
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="flex-shrink-0"
                            >
                              <Link href={`/courses/${course.slug}/${module.slug}/${lesson.id}`}>
                                <Play className="w-4 h-4" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 