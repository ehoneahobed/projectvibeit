import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getCourseBySlug } from "@/lib/content"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth/auth"
import { getUserProgress } from "@/lib/progress-actions"
import { 
  calculateModuleProgress, 
  getCompletedModuleLessonsCount,
  isLessonCompleted,
  canAccessLesson
} from "@/lib/progress"
import { 
  BookOpen, 
  CheckCircle, 
  Circle, 
  Star,
  Play,
  Lock,
  Target,
  Award,
  Code,
  FileText,
  Lightbulb,
  MessageSquare,
  ChevronLeft
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface ModulePageProps {
  params: Promise<{
    courseSlug: string
    moduleSlug: string
  }>
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { courseSlug, moduleSlug } = await params
  
  // Check authentication
  const session = await auth()
  if (!session?.user) {
    // Redirect to login instead of showing 404
    redirect('/auth/signin?callbackUrl=' + encodeURIComponent(`/courses/${courseSlug}/${moduleSlug}`))
  }
  
  const course = getCourseBySlug(courseSlug)
  if (!course) {
    notFound()
  }

  const courseModule = course.modules.find(m => m.slug === moduleSlug)
  if (!courseModule) {
    notFound()
  }

  // Get user progress
  const progressResult = await getUserProgress()
  const userProgress = progressResult.success ? progressResult.data : []
  
  const totalLessons = courseModule.lessons.length
  const totalProjects = courseModule.lessons.filter(lesson => lesson.type === 'project').length
  const moduleLessonIds = courseModule.lessons.map(lesson => lesson.slug)
  const completedLessons = getCompletedModuleLessonsCount(userProgress, courseSlug, moduleLessonIds)
  const progressPercentage = calculateModuleProgress(userProgress, courseSlug, moduleLessonIds)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-green-950/80 backdrop-blur-sm border-b border-green-200 dark:border-green-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm" className="hover:bg-green-100 dark:hover:bg-green-900">
                <Link href={`/courses/${courseSlug}`}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Course
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6 bg-green-200 dark:bg-green-700" />
              <div className="text-sm text-green-600 dark:text-green-300">
                <Link 
                  href={`/courses/${courseSlug}`}
                  className="hover:text-green-800 dark:hover:text-green-100 transition-colors"
                >
                  {course.title}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-green-900 dark:text-green-100 font-medium">
                  {courseModule.title}
                </span>
              </div>
            </div>
            
            <Button asChild size="lg" className="text-lg px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <Link href={`/courses/${courseSlug}/${moduleSlug}/${courseModule.lessons[0].slug}`}>
                <Play className="w-5 h-5 mr-2" />
                Start Module
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Module Introduction */}
            <section>
              <div className="bg-white/90 dark:bg-green-950/90 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200 dark:border-green-800 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-700">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Module {courseModule.order}
                  </Badge>
                  <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                    <Star className="w-4 h-4 mr-1 fill-amber-400 text-amber-400" />
                    {course.rating || 4.5}
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-green-900 dark:text-green-100 mb-6">
                  {courseModule.title}
                </h1>
                
                <p className="text-lg text-green-700 dark:text-green-300 mb-8 leading-relaxed">
                  {courseModule.description}
                </p>

                {/* Module Stats */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/50 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {totalLessons}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-300">Lessons</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/50 rounded-xl border border-amber-200 dark:border-amber-800">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {totalProjects}
                    </div>
                    <div className="text-sm text-amber-600 dark:text-amber-300">Projects</div>
                  </div>
                  <div className="text-center p-4 bg-teal-50 dark:bg-teal-900/50 rounded-xl border border-teal-200 dark:border-teal-800">
                    <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                      {courseModule.estimatedHours}h
                    </div>
                    <div className="text-sm text-teal-600 dark:text-teal-300">Duration</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Your Progress
                    </span>
                    <span className="text-sm text-green-600 dark:text-green-400">
                      {completedLessons}/{totalLessons} completed
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3 bg-green-100 dark:bg-green-900" />
                  <div className="mt-2 text-right">
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {progressPercentage}% Complete
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Learning Objectives */}
            <section>
              <div className="bg-white/90 dark:bg-green-950/90 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200 dark:border-green-800 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-900 dark:text-green-100">
                    Learning Objectives
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-800">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                          Understand Core Concepts
                        </h3>
                        <p className="text-sm text-green-600 dark:text-green-300">
                          Master the fundamental concepts and principles covered in this module
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-xl border border-amber-200 dark:border-amber-800">
                      <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                          Apply Practical Skills
                        </h3>
                        <p className="text-sm text-amber-600 dark:text-amber-300">
                          Practice and apply the skills through hands-on exercises and projects
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-teal-50 dark:bg-teal-900/30 rounded-xl border border-teal-200 dark:border-teal-800">
                      <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-teal-900 dark:text-teal-100 mb-1">
                          Build Real Projects
                        </h3>
                        <p className="text-sm text-teal-600 dark:text-teal-300">
                          Create portfolio-worthy projects that demonstrate your understanding
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
                          Prepare for Next Module
                        </h3>
                        <p className="text-sm text-emerald-600 dark:text-emerald-300">
                          Build a strong foundation for the next module in your learning journey
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Module Lessons */}
            <section>
              <div className="bg-white/90 dark:bg-green-950/90 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200 dark:border-green-800 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-900 dark:text-green-100">
                    Module Lessons
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {courseModule.lessons.map((lesson, index) => {
                    const isCompleted = isLessonCompleted(userProgress, courseSlug, lesson.slug)
                    const canAccess = canAccessLesson(userProgress, courseSlug, index, moduleLessonIds)

                    return (
                      <div
                        key={lesson.slug}
                        className={`flex items-center gap-4 p-6 rounded-xl border transition-all duration-200 ${
                          canAccess 
                            ? isCompleted
                              ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 shadow-md hover:shadow-lg'
                              : 'border-green-200 dark:border-green-800 bg-white dark:bg-green-950/50 hover:bg-green-50 dark:hover:bg-green-900/30 shadow-sm hover:shadow-md'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 opacity-60'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                          ) : canAccess ? (
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                              <Circle className="w-6 h-6 text-gray-400" />
                            </div>
                          ) : (
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                              <Lock className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-green-900 dark:text-green-100">
                              {lesson.title}
                            </span>
                            {lesson.type === 'project' && (
                              <Badge variant="outline" className="text-xs border-amber-200 text-amber-700 dark:border-amber-700 dark:text-amber-300">
                                <Code className="w-3 h-3 mr-1" />
                                Project
                              </Badge>
                            )}
                            {isCompleted && (
                              <Badge variant="default" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-700">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-green-600 dark:text-green-300">
                            {lesson.description}
                          </p>
                        </div>
                        
                        {canAccess && (
                          <Button asChild size="sm" className={`${
                            isCompleted 
                              ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
                              : 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
                          } text-white shadow-md hover:shadow-lg transition-all duration-200`}>
                            <Link href={`/courses/${courseSlug}/${moduleSlug}/${lesson.slug}`}>
                              {isCompleted ? (
                                <>
                                  <FileText className="w-4 h-4 mr-2" />
                                  Review
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Start
                                </>
                              )}
                            </Link>
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Module Progress Card */}
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-green-950/90 backdrop-blur-sm border-green-200 dark:border-green-800">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/50 dark:to-emerald-900/50 rounded-t-lg">
                <CardTitle className="text-xl text-green-900 dark:text-green-100">Module Progress</CardTitle>
                <CardDescription className="text-green-600 dark:text-green-300">
                  Track your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600 dark:text-green-300">
                      Lessons Completed
                    </span>
                    <span className="text-sm font-medium text-green-900 dark:text-green-100">
                      {completedLessons}/{totalLessons}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3 bg-green-100 dark:bg-green-900" />
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {progressPercentage}%
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-300">
                      Complete
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-green-200 dark:border-green-700">
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white shadow-md hover:shadow-lg transition-all duration-200">
                    <Link href={`/courses/${courseSlug}/${moduleSlug}/${courseModule.lessons[0].slug}`}>
                      <Play className="w-4 h-4 mr-2" />
                      Continue Learning
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Course Navigation */}
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-green-950/90 backdrop-blur-sm border-green-200 dark:border-green-800">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-t-lg">
                <CardTitle className="text-xl text-green-900 dark:text-green-100">Course Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Link 
                    href={`/courses/${courseSlug}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors border border-transparent hover:border-green-200 dark:hover:border-green-700"
                  >
                    <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <div className="font-medium text-green-900 dark:text-green-100">
                        Course Overview
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-300">
                        {course.title}
                      </div>
                    </div>
                  </Link>
                  
                  <Link 
                    href={`/courses/${courseSlug}/overview`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors border border-transparent hover:border-green-200 dark:hover:border-green-700"
                  >
                    <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <div className="font-medium text-green-900 dark:text-green-100">
                        Course Details
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-300">
                        Prerequisites & curriculum
                      </div>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-green-950/90 backdrop-blur-sm border-green-200 dark:border-green-800">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/50 dark:to-yellow-900/50 rounded-t-lg">
                <CardTitle className="text-xl text-green-900 dark:text-green-100">Learning Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800">
                  <Lightbulb className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                      Take Your Time
                    </h4>
                    <p className="text-sm text-amber-600 dark:text-amber-300">
                      Don&apos;t rush through the lessons. Take time to understand each concept.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
                  <Code className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-1">
                      Practice Regularly
                    </h4>
                    <p className="text-sm text-purple-600 dark:text-purple-300">
                      Practice the concepts you learn to reinforce your understanding.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <MessageSquare className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Ask Questions
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Don&apos;t hesitate to ask questions in the discussion section.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 