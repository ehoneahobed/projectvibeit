import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getCourseBySlug } from "@/lib/content"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth/auth"
import { getUserProgress } from "@/lib/progress-actions"
import { calculateCourseProgress, getCompletedLessonsCount } from "@/lib/progress"
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Star,
  Play,
  Target,
  Award,
  Code,
  FileText,
  ChevronLeft
} from "lucide-react"

interface CourseOverviewProps {
  params: Promise<{
    courseSlug: string
  }>
}

interface CourseData {
  id: string
  title: string
  description: string
  slug: string
  order: number
  isPublished: boolean
  estimatedHours: number
  prerequisites: string[]
  modules: Array<{
    id: string
    title: string
    description: string
    slug: string
    order: number
    estimatedHours: number
    lessons: Array<{
      id: string
      title: string
      description: string
      slug: string
      order: number
      type: 'lesson' | 'project' | 'assignment'
      isPublished: boolean
    }>
  }>
  totalModules: number
  totalLessons: number
  totalProjects: number
  students: number
  createdAt: Date
  updatedAt: Date
}

async function getCourseWithEnrollment(courseSlug: string): Promise<CourseData | null> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/courses/${courseSlug}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    const result = await response.json()
    
    if (result.success) {
      return result.data
    } else {
      return null
    }
  } catch (error) {
    console.error('Error fetching course with enrollment:', error)
    return null
  }
}

export default async function CourseOverview({ params }: CourseOverviewProps) {
  const { courseSlug } = await params
  
  // Check authentication
  const session = await auth()
  if (!session?.user) {
    // Redirect to login instead of showing 404
    redirect('/auth/signin?callbackUrl=' + encodeURIComponent(`/courses/${courseSlug}/overview`))
  }
  
  // Try to get course data from API first, fallback to static data
  let course = await getCourseWithEnrollment(courseSlug)
  
  if (!course) {
    // Fallback to static data
    const staticCourse = getCourseBySlug(courseSlug)
    if (!staticCourse) {
      notFound()
    }
    
    // Transform static course to match API format
    course = {
      id: staticCourse.id,
      title: staticCourse.title,
      description: staticCourse.description,
      slug: staticCourse.slug,
      order: staticCourse.order,
      isPublished: staticCourse.isPublished,
      estimatedHours: staticCourse.estimatedHours,
      prerequisites: staticCourse.prerequisites,
      modules: staticCourse.modules,
      totalModules: staticCourse.modules.length,
      totalLessons: staticCourse.modules.reduce((acc, module) => acc + module.lessons.length, 0),
      totalProjects: staticCourse.modules.reduce((acc, module) => 
        acc + module.lessons.filter(lesson => lesson.type === 'project').length, 0
      ),
      students: staticCourse.students || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  // Get user progress
  const progressResult = await getUserProgress()
  const userProgress = progressResult.success ? progressResult.data || [] : []
  
  const totalLessons = course.totalLessons
  const totalProjects = course.totalProjects
  
  // Calculate real progress
  const completedLessons = getCompletedLessonsCount(userProgress, course.slug)
  const courseProgress = calculateCourseProgress(userProgress, course.slug, totalLessons)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/courses">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Courses
              </Link>
            </Button>
          </div>
          
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">
                <BookOpen className="w-4 h-4 mr-2" />
                Course
              </Badge>
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                4.5
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              {course.title}
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              {course.description}
            </p>

            {/* Course Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {course.totalModules}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Modules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {totalLessons}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {totalProjects}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {course.estimatedHours}h
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {course.students.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Students</div>
              </div>
            </div>

            {/* Your Progress */}
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Your Progress
                </h3>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {completedLessons}/{totalLessons} lessons completed
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${courseProgress}%` }}
                ></div>
              </div>
              <div className="text-center mt-2">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {courseProgress}%
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400 ml-1">Complete</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* What You'll Learn */}
            <section>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    What You&apos;ll Learn
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                          Modern JavaScript & ES6+
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Master modern JavaScript features including arrow functions, destructuring, and async/await
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                          React Fundamentals
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Build interactive UIs with React hooks, state management, and component patterns
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                          Next.js & Modern Tooling
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Deploy full-stack applications with Next.js, TypeScript, and modern development tools
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                          Database Design & APIs
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Design databases, build REST APIs, and integrate with external services
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                          Real-World Projects
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Build portfolio-worthy projects that demonstrate your skills to employers
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                          Best Practices
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Learn industry standards, testing, deployment, and professional development workflows
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Course Curriculum */}
            <section>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Course Curriculum
                  </h2>
                </div>
                
                <div className="space-y-6">
                  {course.modules.map((module) => (
                    <div key={module.slug} className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <Badge variant="secondary">
                              Module {module.order}
                            </Badge>
                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                              <Clock className="w-4 h-4 mr-1" />
                              {module.estimatedHours}h
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                            {module.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300">
                            {module.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.slug} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                            <div className="flex-shrink-0">
                              {lesson.type === 'project' ? (
                                <Code className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              ) : (
                                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {lesson.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Course Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Duration</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {course.estimatedHours} hours
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Modules</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {course.totalModules}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Lessons</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {totalLessons}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Projects</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {totalProjects}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Students</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {course.students.toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">4.5</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">(Excellent)</span>
                </div>
              </CardContent>
            </Card>

            {/* Prerequisites */}
            {course.prerequisites.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Prerequisites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {course.prerequisites.map((prereq) => (
                      <div key={prereq} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{prereq}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CTA Button */}
            <Button asChild className="w-full" size="lg">
              <Link href={`/courses/${course.slug}`}>
                <Play className="w-4 h-4 mr-2" />
                Start Learning
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 