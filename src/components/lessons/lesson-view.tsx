"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  BookOpen, 
  Video, 
  FileText,
  Tool,
  CheckCircle,
  Circle
} from "lucide-react"

interface Resource {
  title: string
  url: string
  type: "article" | "video" | "tool" | "documentation"
}

interface Assignment {
  title: string
  description: string
  instructions: string
  submissionType: "github" | "url" | "text"
  starterCode?: string
}

interface Lesson {
  _id: string
  title: string
  description: string
  slug: string
  type: "lesson" | "project" | "assignment"
  content: string
  resources: Resource[]
  assignment?: Assignment
}

interface Module {
  _id: string
  title: string
  slug: string
}

interface Course {
  _id: string
  title: string
  slug: string
}

interface Navigation {
  previous: { _id: string; title: string; slug: string } | null
  next: { _id: string; title: string; slug: string } | null
}

interface LessonData {
  course: Course
  module: Module
  lesson: Lesson
  navigation: Navigation
}

interface LessonViewProps {
  lessonData: LessonData
}

export function LessonView({ lessonData }: LessonViewProps) {
  const { course, module, lesson, navigation } = lessonData
  const [isCompleted, setIsCompleted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if lesson is already completed
    checkLessonCompletion()
  }, [lesson._id])

  const checkLessonCompletion = async () => {
    try {
      const response = await fetch("/api/progress")
      if (response.ok) {
        const progress = await response.json()
        const courseProgress = progress.find((p: any) => p.courseId === course._id)
        if (courseProgress?.completedLessons.includes(lesson._id)) {
          setIsCompleted(true)
        }
      }
    } catch (error) {
      console.error("Error checking lesson completion:", error)
    }
  }

  const markLessonComplete = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: course._id,
          moduleId: module._id,
          lessonId: lesson._id,
          completedLessons: [lesson._id],
          completedProjects: lesson.type === "project" ? [lesson._id] : [],
          totalProgress: 0, // This will be calculated on the server
        }),
      })

      if (response.ok) {
        setIsCompleted(true)
      }
    } catch (error) {
      console.error("Error marking lesson complete:", error)
    } finally {
      setLoading(false)
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />
      case "article":
        return <FileText className="w-4 h-4" />
      case "tool":
        return <Tool className="w-4 h-4" />
      case "documentation":
        return <BookOpen className="w-4 h-4" />
      default:
        return <ExternalLink className="w-4 h-4" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
        <Link href="/courses" className="hover:text-blue-600">
          Courses
        </Link>
        <span>/</span>
        <Link href={`/courses/${course.slug}`} className="hover:text-blue-600">
          {course.title}
        </Link>
        <span>/</span>
        <span>{module.title}</span>
        <span>/</span>
        <span className="text-gray-900">{lesson.title}</span>
      </div>

      {/* Lesson Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Badge variant={lesson.type === "project" ? "default" : "secondary"} className="mb-2">
              {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
            <p className="text-gray-600 mt-2">{lesson.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            ) : (
              <Button 
                onClick={markLessonComplete} 
                disabled={loading}
                variant="outline"
              >
                {loading ? "Marking..." : "Mark Complete"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-6">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>,
                    p: ({ children }) => <p className="mb-4 text-gray-700">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-700">{children}</li>,
                    code: ({ children, className }) => (
                      <code className={`bg-gray-100 px-1 py-0.5 rounded text-sm ${className}`}>
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {lesson.content}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Section */}
          {lesson.assignment && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Assignment: {lesson.assignment.title}</CardTitle>
                <CardDescription>{lesson.assignment.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {lesson.assignment.instructions}
                  </ReactMarkdown>
                </div>
                
                {lesson.assignment.starterCode && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Starter Code</h4>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{lesson.assignment.starterCode}</code>
                    </pre>
                  </div>
                )}
                
                <div className="mt-6">
                  <Badge variant="outline">
                    Submission Type: {lesson.assignment.submissionType}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resources */}
          {lesson.resources && lesson.resources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lesson.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {getResourceIcon(resource.type)}
                      <div>
                        <div className="font-medium text-gray-900">{resource.title}</div>
                        <div className="text-sm text-gray-600">{resource.type}</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {navigation.previous && (
                  <Link
                    href={`/courses/${course.slug}/${module.slug}/${navigation.previous.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <div>
                      <div className="text-sm text-gray-600">Previous</div>
                      <div className="font-medium text-gray-900">{navigation.previous.title}</div>
                    </div>
                  </Link>
                )}
                
                {navigation.next && (
                  <Link
                    href={`/courses/${course.slug}/${module.slug}/${navigation.next.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Next</div>
                      <div className="font-medium text-gray-900">{navigation.next.title}</div>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}