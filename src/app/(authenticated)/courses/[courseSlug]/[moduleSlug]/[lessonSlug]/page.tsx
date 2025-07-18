import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MDXRenderer } from "@/components/mdx-renderer"
import { LessonCompletion } from "@/components/lesson-completion"
import { FloatingCompletionButton } from "@/components/floating-completion-button"
import { 
  getLessonContent, 
  getLessonNavigation,
} from "@/lib/content"
import { auth } from "@/lib/auth/auth"
import { getUserProgress } from "@/lib/progress-actions"
import { isLessonCompleted, calculateCourseProgress, getCompletedLessonsCount } from "@/lib/progress"
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  ExternalLink, 
  Code, 
  FileText,
  CheckCircle,
  Circle,
  Lock,
  MessageSquare,
  Github,
  Globe,
  Video,
  Book,
  Trophy
} from "lucide-react"
import { notFound, redirect } from "next/navigation"

interface LessonPageProps {
  params: Promise<{
    courseSlug: string
    moduleSlug: string
    lessonSlug: string
  }>
}

// Type for navigation lesson objects that include moduleSlug
interface NavigationLesson {
  id: string
  title: string
  description: string
  slug: string
  order: number
  type: 'lesson' | 'project' | 'assignment'
  isPublished: boolean
  moduleSlug: string
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseSlug, moduleSlug, lessonSlug } = await params
  
  // Check authentication
  const session = await auth()
  if (!session?.user) {
    // Redirect to login instead of showing 404
    redirect('/auth/signin?callbackUrl=' + encodeURIComponent(`/courses/${courseSlug}/${moduleSlug}/${lessonSlug}`))
  }
  
  // Load lesson content from MDX files
  const lessonContent = getLessonContent(courseSlug, moduleSlug, lessonSlug)
  const navigation = getLessonNavigation(courseSlug, moduleSlug, lessonSlug)
  
  if (!lessonContent || !navigation) {
    notFound()
  }

  const { meta, content } = lessonContent
  const { current, previous, next, module, course } = navigation

  // Get user progress
  const progressResult = await getUserProgress()
  const userProgress = progressResult.success ? progressResult.data || [] : []
  const isCompleted = isLessonCompleted(userProgress, courseSlug, current.id)

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />
      case "article":
        return <FileText className="w-4 h-4" />
      case "tool":
        return <Globe className="w-4 h-4" />
      case "documentation":
        return <Book className="w-4 h-4" />
      default:
        return <ExternalLink className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/courses/${courseSlug}`}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Course
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {course.title}
                </div>
                <div className="font-medium text-slate-900 dark:text-white">
                  {module.title}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="hover:bg-accent">
                <MessageSquare className="w-4 h-4 mr-2" />
                Ask Question
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Lesson Header */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <Badge variant="secondary" className="text-sm">
                  {meta.type === 'project' ? (
                    <Code className="w-4 h-4 mr-2" />
                  ) : (
                    <BookOpen className="w-4 h-4 mr-2" />
                  )}
                  {meta.type === 'project' ? 'Project' : 'Lesson'}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  Module {module.order}
                </Badge>
                {isCompleted && (
                  <Badge variant="default" className="text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                {current.title}
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                {current.description}
              </p>
            </div>

            {/* Lesson Content */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8">
                <div className="max-w-none">
                  <MDXRenderer source={content} />
                </div>
              </CardContent>
            </Card>

            {/* Assignment Section */}
            {meta.assignment && (
              <Card className="border-0 shadow-sm mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        {meta.assignment.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-4">
                        {meta.assignment.description}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                        Instructions:
                      </h4>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <MDXRenderer source={meta.assignment.instructions} />
                      </div>
                    </div>

                    {meta.assignment.starterCode && (
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                          Starter Code:
                        </h4>
                        <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto">
                          <code className="text-sm">{meta.assignment.starterCode}</code>
                        </pre>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        <Github className="w-3 h-3 mr-1" />
                        {meta.assignment.submissionType === 'github' ? 'GitHub Repository' : meta.assignment.submissionType}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resources Section */}
            {meta.resources && meta.resources.length > 0 && (
              <Card className="border-0 shadow-sm mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Additional Resources
                  </CardTitle>
                  <CardDescription>
                    Explore these resources to deepen your understanding
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {meta.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                      >
                        <div className="flex-shrink-0 text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {resource.title}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                            {resource.type}
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lesson Completion - Moved to bottom */}
            <div className="mt-8">
              <LessonCompletion
                courseSlug={courseSlug}
                moduleSlug={moduleSlug}
                lessonId={current.id}
                lessonTitle={current.title}
                isCompleted={isCompleted}
                previousLesson={previous ? { 
                  slug: previous.slug, 
                  title: previous.title,
                  moduleSlug: (previous as NavigationLesson).moduleSlug || moduleSlug
                } : null}
                nextLesson={next ? { 
                  slug: next.slug, 
                  title: next.title,
                  moduleSlug: (next as NavigationLesson).moduleSlug || moduleSlug
                } : null}
                moduleTitle={module.title}
                courseTitle={course.title}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              {previous ? (
                <Button asChild variant="outline">
                  <Link href={`/courses/${courseSlug}/${(previous as NavigationLesson).moduleSlug || moduleSlug}/${previous.slug}`}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous Lesson
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="outline">
                  <Link href={`/courses/${courseSlug}`}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Course
                  </Link>
                </Button>
              )}
              
              {next ? (
                <Button asChild>
                  <Link href={`/courses/${courseSlug}/${(next as NavigationLesson).moduleSlug || moduleSlug}/${next.slug}`}>
                    Next Lesson
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href={`/courses/${courseSlug}/congratulations`}>
                    <Trophy className="w-4 h-4 mr-2" />
                    View Certificate
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Progress */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {calculateCourseProgress(userProgress, courseSlug, course.modules.reduce((acc, m) => acc + m.lessons.length, 0))}%
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Course Complete
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: `${calculateCourseProgress(userProgress, courseSlug, course.modules.reduce((acc, m) => acc + m.lessons.length, 0))}%` 
                        }}
                      ></div>
                    </div>
                    <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                      {getCompletedLessonsCount(userProgress, courseSlug)} of {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons completed
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Module Navigation */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Module {module.order}</CardTitle>
                  <CardDescription>{module.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {module.lessons.map((lesson, index) => {
                      const lessonCompleted = isLessonCompleted(userProgress, courseSlug, lesson.id)
                      const isCurrentLesson = lesson.slug === current.slug
                      
                      return (
                        <Link
                          key={lesson.id}
                          href={`/courses/${courseSlug}/${moduleSlug}/${lesson.slug}`}
                          className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                            isCurrentLesson
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                              : lessonCompleted
                              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {isCurrentLesson ? (
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          ) : lessonCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : index < 2 ? (
                            <Circle className="w-4 h-4 text-slate-400" />
                          ) : (
                            <Lock className="w-4 h-4 text-slate-400" />
                          )}
                          <span className="text-sm font-medium">
                            {lesson.title}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Quick Completion */}
      <FloatingCompletionButton
        courseSlug={courseSlug}
        moduleSlug={moduleSlug}
        lessonId={current.id}
        isCompleted={isCompleted}
        nextLesson={next ? { 
          slug: next.slug, 
          title: next.title,
          moduleSlug: (next as NavigationLesson).moduleSlug || moduleSlug
        } : null}
      />
    </div>
  )
} 