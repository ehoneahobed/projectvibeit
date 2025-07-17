import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MDXRenderer } from "@/components/mdx-renderer"
import { 
  getLessonContent, 
  getLessonNavigation,
  getPublishedCourses 
} from "@/lib/content"
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  ExternalLink, 
  Play, 
  Code, 
  FileText,
  CheckCircle,
  Circle,
  Lock,
  MessageSquare,
  Github,
  Globe,
  Video,
  Book
} from "lucide-react"
import { notFound } from "next/navigation"

interface LessonPageProps {
  params: Promise<{
    courseSlug: string
    moduleSlug: string
    lessonSlug: string
  }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseSlug, moduleSlug, lessonSlug } = await params
  
  // Load lesson content from MDX files
  const lessonContent = getLessonContent(courseSlug, moduleSlug, lessonSlug)
  const navigation = getLessonNavigation(courseSlug, moduleSlug, lessonSlug)
  
  if (!lessonContent || !navigation) {
    notFound()
  }

  const { meta, content } = lessonContent
  const { current, previous, next, module, course } = navigation

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
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                <Link 
                  href={`/courses/${courseSlug}/${moduleSlug}`}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {module.title}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-slate-900 dark:text-white font-medium">
                  {current.title}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Discussion
              </Button>
              <Button variant="ghost" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Notes
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
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                {current.title}
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                {current.description}
              </p>

              {/* Lesson Actions */}
              <div className="flex items-center gap-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Complete
                </Button>
                <Button variant="outline" className="hover:bg-accent">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ask Question
                </Button>
              </div>
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
                        <div dangerouslySetInnerHTML={{ 
                          __html: meta.assignment.instructions
                            .replace(/\n/g, '<br>')
                            .replace(/- (.*)/g, '• $1')
                        }} />
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

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button 
                asChild 
                variant="outline" 
                disabled={!previous}
              >
                <Link href={previous ? `/courses/${courseSlug}/${moduleSlug}/${previous.slug}` : "#"}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous Lesson
                </Link>
              </Button>
              
              <Button asChild disabled={!next}>
                <Link href={next ? `/courses/${courseSlug}/${moduleSlug}/${next.slug}` : "#"}>
                  Next Lesson
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
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
                        15%
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Course Complete
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '15%' }}></div>
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
                    {module.lessons.map((lesson, index) => (
                      <Link
                        key={lesson.id}
                        href={`/courses/${courseSlug}/${moduleSlug}/${lesson.slug}`}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                          lesson.slug === current.slug
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {lesson.slug === current.slug ? (
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        ) : index < 2 ? (
                          <Circle className="w-4 h-4 text-slate-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="text-sm font-medium">
                          {lesson.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Discussion
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Take Notes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 