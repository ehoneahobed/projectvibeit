import Link from "next/link"
import type { Metadata } from "next"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getCourseBySlug } from "@/lib/content"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth/auth"
import { getUserProgress } from "@/lib/progress-actions"
import { 
  calculateCourseProgress, 
  getCompletedLessonsCount, 
  calculateModuleProgress,
  isLessonCompleted,
  canAccessLesson
} from "@/lib/progress"
import { 
  BookOpen, 
  Clock, 
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

/**
 * Generates dynamic metadata for course pages
 */
export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { courseSlug } = await params
  const course = getCourseBySlug(courseSlug)
  
  if (!course) {
    return {
      title: "Course Not Found",
      description: "The requested course could not be found.",
    }
  }

  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0)
  const estimatedHours = course.estimatedHours || Math.round(totalLessons * 0.5)

  return {
    title: `${course.title} - Free Online Course`,
    description: `${course.description} Learn with ${course.modules.length} modules, ${totalLessons} lessons, and ${estimatedHours} hours of content. Start learning for free today.`,
    keywords: [
      course.title.toLowerCase(),
      "free coding course",
      "online learning",
      "web development",
      "AI-assisted coding",
      "programming tutorial",
      "software development",
      "React course",
      "Next.js tutorial",
      "JavaScript learning",
      "TypeScript course",
      "full-stack development",
      "coding bootcamp",
      "learn to code",
      "programming education"
    ],
    openGraph: {
      title: `${course.title} - Free Online Course`,
      description: `${course.description} Learn with ${course.modules.length} modules, ${totalLessons} lessons, and ${estimatedHours} hours of content. Start learning for free today.`,
      url: `https://vibeit.com/courses/${courseSlug}`,
      siteName: "VibeIt",
      images: [
        {
          url: `/og-course-${courseSlug}.png`,
          width: 1200,
          height: 630,
          alt: `${course.title} - VibeIt Course`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.title} - Free Online Course`,
      description: `${course.description} Learn with ${course.modules.length} modules, ${totalLessons} lessons, and ${estimatedHours} hours of content. Start learning for free today.`,
      images: [`/og-course-${courseSlug}.png`],
    },
    alternates: {
      canonical: `https://vibeit.com/courses/${courseSlug}`,
    },
  }
}

/**
 * Generates structured data for course pages
 */
function generateCourseStructuredData(course: NonNullable<ReturnType<typeof getCourseBySlug>>, courseSlug: string) {
  const totalLessons = course.modules.reduce((acc: number, module) => acc + module.lessons.length, 0)
  const estimatedHours = course.estimatedHours || Math.round(totalLessons * 0.5)

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.description,
    "provider": {
      "@type": "Organization",
      "name": "VibeIt",
      "url": "https://vibeit.com"
    },
    "courseMode": "online",
    "educationalLevel": "beginner",
    "inLanguage": "en",
    "isAccessibleForFree": true,
    "timeRequired": `PT${estimatedHours}H`,
    "teaches": [
      "AI-assisted coding",
      "Web development",
      "React",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "Full-stack development",
      "SaaS development",
      "Programming",
      "Software development"
    ],
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "inLanguage": "en",
      "isAccessibleForFree": true,
      "timeRequired": `PT${estimatedHours}H`,
      "courseWorkload": `PT${estimatedHours}H`,
      "numberOfCredits": totalLessons
    },
    "url": `https://vibeit.com/courses/${courseSlug}`,
    "image": `https://vibeit.com/og-course-${courseSlug}.png`,
    "author": {
      "@type": "Organization",
      "name": "VibeIt Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "VibeIt",
      "url": "https://vibeit.com"
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": totalLessons,
      "itemListElement": course.modules.map((module, moduleIndex: number) => ({
        "@type": "ListItem",
        "position": moduleIndex + 1,
        "item": {
          "@type": "Course",
          "name": module.title,
          "description": module.description,
          "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "online",
            "inLanguage": "en",
            "isAccessibleForFree": true,
            "timeRequired": `PT${Math.round(module.lessons.length * 0.5)}H`
          }
        }
      }))
    }
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseSlug } = await params
  
  // Check authentication
  const session = await auth()
  if (!session?.user) {
    // Redirect to login instead of showing 404
    redirect('/auth/signin?callbackUrl=' + encodeURIComponent(`/courses/${courseSlug}`))
  }
  
  const course = getCourseBySlug(courseSlug)
  
  if (!course) {
    notFound()
  }

  // Get user progress
  const progressResult = await getUserProgress()
  const userProgress = progressResult.success ? progressResult.data || [] : []
  
  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0)
  const completedLessons = getCompletedLessonsCount(userProgress, course.slug)
  const courseProgress = calculateCourseProgress(userProgress, course.slug, totalLessons)

  const structuredData = generateCourseStructuredData(course, courseSlug)

  return (
    <>
      <Script
        id="course-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Badge variant="secondary">
                <BookOpen className="w-4 h-4 mr-2" />
                {course.modules.length} Modules
              </Badge>
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                {course.rating || 4.5}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              {course.title}
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
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
                  {completedLessons}/{totalLessons} lessons completed
                </span>
              </div>
              <Progress value={courseProgress} className="h-2" />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-4">
                <Link href={`/courses/${course.slug}/${course.modules[0].slug}/${course.modules[0].lessons[0].slug}`}>
                  <Play className="w-5 h-5 mr-2" />
                  Continue Learning
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
                <Link href={`/courses/${courseSlug}/overview`}>
                  <BookOpen className="w-5 h-5 mr-2" />
                  Course Overview
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Modules */}
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
            {course.modules.map((module) => {
              const moduleLessonIds = module.lessons.map(lesson => lesson.slug)
              const moduleProgress = calculateModuleProgress(userProgress, course.slug, moduleLessonIds)
              const completedModuleLessons = module.lessons.filter(lesson => 
                isLessonCompleted(userProgress, course.slug, lesson.slug)
              ).length

              return (
                <Card key={module.slug} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
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
                          {completedModuleLessons}/{module.lessons.length} completed
                        </div>
                        <Progress value={moduleProgress} className="w-24 h-2" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {module.lessons.map((lesson, lessonIndex) => {
                        const isCompleted = isLessonCompleted(userProgress, course.slug, lesson.slug)
                        const canAccess = canAccessLesson(userProgress, course.slug, lessonIndex, moduleLessonIds)

                        return (
                          <div
                            key={lesson.slug}
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
                              <p className="text-sm text-slate-600 dark:text-slate-300">
                                {lesson.description}
                              </p>
                            </div>
                            
                            {canAccess && (
                              <Button asChild size="sm" variant="ghost">
                                <Link href={`/courses/${course.slug}/${module.slug}/${lesson.slug}`}>
                                  <ArrowRight className="w-4 h-4" />
                                </Link>
                              </Button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </div>
    </>
  )
} 