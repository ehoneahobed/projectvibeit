import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Users, ArrowRight, Star } from "lucide-react"
import { getPublishedCourses } from "@/lib/content"

interface CourseData {
  id: string
  title: string
  description: string
  slug: string
  order: number
  isPublished: boolean
  estimatedHours: number
  prerequisites: string[]
  modules: number
  lessons: number
  projects: number
  students: number
  createdAt: Date
  updatedAt: Date
}

async function getCoursesWithEnrollment(): Promise<CourseData[]> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/courses`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch courses')
    }
    
    const result = await response.json()
    
    if (result.success) {
      return result.data
    } else {
      throw new Error(result.error || 'Failed to fetch courses')
    }
  } catch (error) {
    console.error('Error fetching courses with enrollment:', error)
    // Fallback to static data if API fails
    const staticCourses = getPublishedCourses()
    return staticCourses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      slug: course.slug,
      order: course.order,
      isPublished: course.isPublished,
      estimatedHours: course.estimatedHours,
      prerequisites: course.prerequisites,
      modules: course.modules.length,
      lessons: course.modules.reduce((total, module) => total + module.lessons.length, 0),
      projects: course.modules.reduce((total, module) => 
        total + module.lessons.filter(lesson => lesson.type === 'project').length, 0
      ),
      students: course.students || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  }
}

export default async function CoursesPage() {
  const courses = await getCoursesWithEnrollment()
  const publishedCourses = courses.filter(course => course.isPublished)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <BookOpen className="w-4 h-4 mr-2" />
              Learning Paths
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Choose Your Learning Path
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Start with the fundamentals and progress to advanced topics. Each course is designed 
              to build upon the previous one, creating a comprehensive learning experience.
            </p>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedCourses.map((course) => (
              <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Course
                    </Badge>
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                      4.5
                    </div>
                  </div>
                  <CardTitle className="text-2xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Course Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {course.modules}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        Modules
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {course.lessons}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        Lessons
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {course.projects}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        Projects
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {course.estimatedHours}h
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {course.students.toLocaleString()}
                    </div>
                  </div>

                  {/* Prerequisites */}
                  {course.prerequisites.length > 0 && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                        Prerequisites:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {course.prerequisites.map((prereq) => (
                          <Badge key={prereq} variant="outline" className="text-xs">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
                    <Link href={`/courses/${course.slug}`}>
                      Start Course
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coming Soon Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Coming Soon
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300">
                More courses are in development. Stay tuned for updates!
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.filter(course => !course.isPublished).map((course) => (
                <Card key={course.id} className="opacity-60 border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline">
                        Coming Soon
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-slate-400">
                          {course.modules}
                        </div>
                        <div className="text-sm text-slate-500">
                          Modules
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-400">
                          {course.lessons}
                        </div>
                        <div className="text-sm text-slate-500">
                          Lessons
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-400">
                          {course.projects}
                        </div>
                        <div className="text-sm text-slate-500">
                          Projects
                        </div>
                      </div>
                    </div>
                    
                    <Button disabled className="w-full">
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 