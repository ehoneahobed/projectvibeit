import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Globe,
  Zap,
  Lightbulb,
  ChevronLeft
} from "lucide-react"

interface CourseOverviewProps {
  params: Promise<{
    courseSlug: string
  }>
}

export default async function CourseOverview({ params }: CourseOverviewProps) {
  const { courseSlug } = await params
  
  // Check authentication
  const session = await auth()
  if (!session?.user) {
    // Redirect to login instead of showing 404
    redirect('/auth/signin?callbackUrl=' + encodeURIComponent(`/courses/${courseSlug}/overview`))
  }
  
  const course = getCourseBySlug(courseSlug)
  
  if (!course) {
    notFound()
  }

  // Get user progress
  const progressResult = await getUserProgress()
  const userProgress = progressResult.success ? progressResult.data || [] : []
  
  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0)
  const totalProjects = course.modules.reduce((acc, module) => 
    acc + module.lessons.filter(lesson => lesson.type === 'project').length, 0
  )
  
  // Calculate real progress
  const completedLessons = getCompletedLessonsCount(userProgress, course.slug)
  const courseProgress = calculateCourseProgress(userProgress, course.slug, totalLessons)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/courses/${courseSlug}`}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Course
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <Link 
                  href={`/courses/${courseSlug}`}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {course.title}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-slate-900 dark:text-white font-medium">
                  Course Overview
                </span>
              </div>
            </div>
            
            <Button asChild size="lg" className="text-lg px-6 py-3">
              <Link href={`/courses/${course.slug}/${course.modules[0].slug}/${course.modules[0].lessons[0].slug}`}>
                <Play className="w-5 h-5 mr-2" />
                Start Learning
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Course Introduction */}
            <section>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Badge variant="secondary">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Course Overview
                  </Badge>
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                    {course.rating || 4.5}
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                  {course.title}
                </h1>
                
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
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
            </section>

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
                              <p className="text-sm text-slate-600 dark:text-slate-300">
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

            {/* Prerequisites */}
            {course.prerequisites.length > 0 && (
              <section>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Prerequisites
                    </h2>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {course.prerequisites.map((prereq) => (
                      <Badge key={prereq} variant="outline" className="text-sm">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Preview Card */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">Course Preview</CardTitle>
                <CardDescription>
                  Get a taste of what you&apos;ll learn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">What you&apos;ll learn:</h4>
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
                    <Link href={`/courses/${course.slug}/${course.modules[0].slug}/${course.modules[0].lessons[0].slug}`}>
                      <Play className="w-4 h-4 mr-2" />
                      Start Learning
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Course Features */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">Course Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Self-Paced Learning</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Learn at your own speed</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Hands-On Projects</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Build real applications</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-green-500" />
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Lifetime Access</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Access content forever</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Certificate</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Earn completion certificate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructor Info */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">Your Instructor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">V</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Project Vibe It Team</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Professional developers and educators
                  </p>
                </div>
                
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  <p className="mb-2">
                    Our team of experienced developers and educators are passionate about helping you succeed in your coding journey.
                  </p>
                  <p>
                    We believe in practical, hands-on learning that prepares you for real-world development challenges.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 