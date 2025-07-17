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
                  {courseModule.title}
                </span>
              </div>
            </div>
            
            <Button asChild size="lg" className="text-lg px-6 py-3">
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
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Badge variant="secondary">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Module {courseModule.order}
                  </Badge>
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                    {course.rating || 4.5}
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                  {courseModule.title}
                </h1>
                
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                  {courseModule.description}
                </p>

                {/* Module Stats */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
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
                      {courseModule.estimatedHours}h
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Duration</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Your Progress
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {completedLessons}/{totalLessons} completed
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </div>
            </section>

            {/* Learning Objectives */}
            <section>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Learning Objectives
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                          Understand Core Concepts
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Master the fundamental concepts and principles covered in this module
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                          Apply Practical Skills
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Practice and apply the skills through hands-on exercises and projects
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                          Build Real Projects
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Create portfolio-worthy projects that demonstrate your understanding
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                          Prepare for Next Module
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
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
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
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
                        className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                          canAccess 
                            ? 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700' 
                            : 'border-slate-200 dark:border-slate-700 opacity-50'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : canAccess ? (
                            <Circle className="w-6 h-6 text-slate-400" />
                          ) : (
                            <Lock className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {lesson.title}
                            </span>
                            {lesson.type === 'project' && (
                              <Badge variant="outline" className="text-xs">
                                <Code className="w-3 h-3 mr-1" />
                                Project
                              </Badge>
                            )}
                            {isCompleted && (
                              <Badge variant="default" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {lesson.description}
                          </p>
                        </div>
                        
                        {canAccess && (
                          <Button asChild size="sm">
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
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">Module Progress</CardTitle>
                <CardDescription>
                  Track your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Lessons Completed
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {completedLessons}/{totalLessons}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {progressPercentage}%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Complete
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button asChild className="w-full">
                    <Link href={`/courses/${courseSlug}/${moduleSlug}/${courseModule.lessons[0].slug}`}>
                      <Play className="w-4 h-4 mr-2" />
                      Continue Learning
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Course Navigation */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">Course Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Link 
                    href={`/courses/${courseSlug}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        Course Overview
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        {course.title}
                      </div>
                    </div>
                  </Link>
                  
                  <Link 
                    href={`/courses/${courseSlug}/overview`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        Course Details
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        Prerequisites & curriculum
                      </div>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">Learning Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                      Take Your Time
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Don&apos;t rush through the lessons. Take time to understand each concept.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Code className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                      Practice Regularly
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Practice the concepts you learn to reinforce your understanding.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                      Ask Questions
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
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