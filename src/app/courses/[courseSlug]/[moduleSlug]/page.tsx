import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  getCourseBySlug, 
  getModuleContent 
} from "@/lib/content"
import { notFound } from "next/navigation"
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ChevronLeft,
  Play,
  Lock,
  Code,
  FileText,
  Target,
  Award
} from "lucide-react"

interface ModulePageProps {
  params: Promise<{
    courseSlug: string
    moduleSlug: string
  }>
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { courseSlug, moduleSlug } = await params
  
  const course = getCourseBySlug(courseSlug)
  if (!course) {
    notFound()
  }

  const module = course.modules.find(m => m.slug === moduleSlug)
  if (!module) {
    notFound()
  }

  const totalLessons = module.lessons.length
  const totalProjects = module.lessons.filter(lesson => lesson.type === 'project').length
  const completedLessons = 0 // TODO: Get from user progress
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

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
                  {module.title}
                </span>
              </div>
            </div>
            
            <Button asChild size="lg" className="text-lg px-6 py-3">
              <Link href={`/courses/${courseSlug}/${moduleSlug}/${module.lessons[0].slug}`}>
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
          <div className="lg:col-span-2 space-y-8">
            {/* Module Header */}
            <section>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Badge variant="secondary">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Module {module.order}
                  </Badge>
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {module.estimatedHours}h
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                  {module.title}
                </h1>
                
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                  {module.description}
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
                      {module.estimatedHours}h
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
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    What You'll Learn
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {module.lessons.map((lesson, index) => (
                    <div key={lesson.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {lesson.type === 'project' ? (
                          <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        ) : (
                          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {lesson.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Lessons List */}
            <section>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Module Lessons
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {module.lessons.map((lesson, index) => {
                    const isCompleted = false // TODO: Get from user progress
                    const isFirstLesson = index === 0
                    const isPreviousCompleted = index === 0 || false // TODO: Get from user progress
                    const canAccess = isFirstLesson || isPreviousCompleted

                    return (
                      <div
                        key={lesson.id}
                        className={`border border-slate-200 dark:border-slate-700 rounded-lg p-6 transition-colors ${
                          canAccess 
                            ? 'hover:bg-slate-50 dark:hover:bg-slate-700' 
                            : 'opacity-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="flex-shrink-0 mt-1">
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
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                  {lesson.title}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                  {lesson.type === 'project' ? 'Project' : 'Lesson'}
                                </Badge>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 mb-4">
                                {lesson.description}
                              </p>
                              
                              {canAccess && (
                                <Button asChild size="sm">
                                  <Link href={`/courses/${courseSlug}/${moduleSlug}/${lesson.slug}`}>
                                    {isCompleted ? 'Review' : 'Start Lesson'}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                  </Link>
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              Lesson {lesson.order}
                            </div>
                          </div>
                        </div>
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
                    <Link href={`/courses/${courseSlug}/${moduleSlug}/${module.lessons[0].slug}`}>
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
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {course.modules.map((courseModule) => (
                    <div
                      key={courseModule.id}
                      className={`p-3 rounded-lg transition-colors ${
                        courseModule.slug === moduleSlug
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Link 
                        href={`/courses/${courseSlug}/${courseModule.slug}`}
                        className={`block ${
                          courseModule.slug === moduleSlug
                            ? 'text-blue-700 dark:text-blue-300'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-xs">
                            {courseModule.order}
                          </Badge>
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {courseModule.title}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {courseModule.lessons.length} lessons
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/courses/${courseSlug}/overview`}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Course Overview
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Module Features */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">Module Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Theory Lessons</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {module.lessons.filter(l => l.type === 'lesson').length} lessons
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-purple-500" />
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Hands-On Projects</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {totalProjects} projects
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-green-500" />
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Estimated Time</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {module.estimatedHours} hours
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