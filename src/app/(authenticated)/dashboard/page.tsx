import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Users,
  Target,
  Award,
  Zap
} from "lucide-react"
import { auth } from "@/lib/auth/auth"
import { redirect } from "next/navigation"
import { getUserProgress } from "@/lib/progress-actions"
import { getPublishedCourses } from "@/lib/content"
import { calculateCourseProgress, getCompletedLessonsCount } from "@/lib/progress"
import { formatDistanceToNow } from "date-fns"
import type { IProgress } from "@/lib/models/User"
import type { CourseMeta } from "@/lib/content"

/**
 * Calculate user statistics from progress data
 */
function calculateUserStats(userProgress: IProgress[], courses: CourseMeta[]) {
  const totalLessons = courses.reduce((acc, course) => {
    return acc + course.modules.reduce((moduleAcc: number, module) => {
      return moduleAcc + module.lessons.length
    }, 0)
  }, 0)

  const completedLessons = userProgress.reduce((acc, progress) => {
    return acc + progress.completedLessons.length
  }, 0)

  const activeCourses = userProgress.length
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  // Calculate streak (simplified - in a real app you'd track daily activity)
  const streak = Math.min(7, Math.floor(completedLessons / 2)) // Mock calculation

  return {
    totalLessons,
    completedLessons,
    activeCourses,
    overallProgress,
    streak
  }
}

/**
 * Get user's current courses with progress
 */
function getCurrentCourses(userProgress: IProgress[], courses: CourseMeta[]) {
  return courses.map(course => {
    const courseProgress = userProgress.find(p => p.courseId === course.slug)
    const totalLessons = course.modules.reduce((acc: number, module) => acc + module.lessons.length, 0)
    const completedLessons = courseProgress ? courseProgress.completedLessons.length : 0
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    // Find the next lesson to continue
    let nextLesson = null
    let lastLesson = null

    if (courseProgress) {
      // Find the current module and lesson
      const currentModule = course.modules.find((m) => m.slug === courseProgress.moduleId)
      if (currentModule) {
        const currentLessonIndex = currentModule.lessons.findIndex((l) => l.slug === courseProgress.lessonId)
        if (currentLessonIndex >= 0) {
          // Find next lesson
          if (currentLessonIndex < currentModule.lessons.length - 1) {
            nextLesson = currentModule.lessons[currentLessonIndex + 1]
          } else {
            // Move to next module
            const currentModuleIndex = course.modules.findIndex((m) => m.slug === courseProgress.moduleId)
            if (currentModuleIndex < course.modules.length - 1) {
              const nextModule = course.modules[currentModuleIndex + 1]
              nextLesson = nextModule.lessons[0]
            }
          }
          
          // Find last completed lesson
          if (currentLessonIndex > 0) {
            lastLesson = currentModule.lessons[currentLessonIndex - 1]
          }
        }
      }
    } else {
      // User hasn't started this course yet
      nextLesson = course.modules[0]?.lessons[0]
    }

    return {
      id: course.slug,
      title: course.title,
      progress,
      lastLesson: lastLesson?.title,
      nextLesson: nextLesson?.title,
      estimatedCompletion: `${Math.ceil((totalLessons - completedLessons) / 2)} weeks`,
      lessonsCompleted: completedLessons,
      totalLessons,
      nextLessonSlug: nextLesson ? `${course.slug}/${course.modules.find((m) => 
        m.lessons.some((l) => l.slug === nextLesson.slug)
      )?.slug}/${nextLesson.slug}` : null
    }
  }).filter(course => course.lessonsCompleted > 0 || course.nextLessonSlug) // Only show active courses
}

/**
 * Generate recent activity based on user progress
 */
function generateRecentActivity(userProgress: IProgress[], courses: CourseMeta[]) {
  const activities: Array<{
    id: string
    type: string
    title: string
    course: string
    timestamp: string
    icon: typeof CheckCircle
  }> = []

  // Add recent lesson completions
  userProgress.forEach(progress => {
    const course = courses.find(c => c.slug === progress.courseId)
    if (course) {
      // Get the last few completed lessons
      const recentCompleted = progress.completedLessons.slice(-3)
      recentCompleted.forEach((lessonId: string) => {
        // Find lesson details
        for (const module of course.modules) {
          const lesson = module.lessons.find((l) => l.id === lessonId)
          if (lesson) {
            activities.push({
              id: `${lessonId}-completed`,
              type: "lesson_completed",
              title: `Completed: ${lesson.title}`,
              course: course.title,
              timestamp: "2 hours ago", // Mock timestamp
              icon: CheckCircle
            })
            break
          }
        }
      })
    }
  })

  return activities.slice(-5) // Return last 5 activities
}

/**
 * Generate achievements based on user progress
 */
function generateAchievements(userProgress: IProgress[], courses: CourseMeta[]) {
  const totalCompleted = userProgress.reduce((acc, p) => acc + p.completedLessons.length, 0)
  const activeCourses = userProgress.length

  return [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first lesson",
      icon: "🎯",
      earned: totalCompleted >= 1
    },
    {
      id: 2,
      name: "Week Warrior",
      description: "Learn for 7 days in a row",
      icon: "🔥",
      earned: totalCompleted >= 7
    },
    {
      id: 3,
      name: "Course Explorer",
      description: "Start 3 different courses",
      icon: "🏆",
      earned: activeCourses >= 3
    },
    {
      id: 4,
      name: "Lesson Master",
      description: "Complete 20 lessons",
      icon: "⭐",
      earned: totalCompleted >= 20
    }
  ]
}

export default async function DashboardPage() {
  // Check authentication
  const session = await auth()
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard')
  }

  // Get user progress and courses
  const progressResult = await getUserProgress()
  const userProgress = progressResult.success ? progressResult.data : []
  const courses = getPublishedCourses()

  // Calculate user statistics
  const stats = calculateUserStats(userProgress, courses)
  const currentCourses = getCurrentCourses(userProgress, courses)
  const recentActivity = generateRecentActivity(userProgress, courses)
  const achievements = generateAchievements(userProgress, courses)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Avatar className="h-16 w-16">
                <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                <AvatarFallback>
                  {session.user.name ? session.user.name.split(' ').map(n => n[0]).join('') : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Welcome back, {session.user.name || 'Learner'}!
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                  Keep up the great work on your learning journey
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                {stats.completedLessons > 20 ? 'Advanced' : stats.completedLessons > 10 ? 'Intermediate' : 'Beginner'}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {stats.streak} day streak
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Your Learning Progress
                </CardTitle>
                <CardDescription>
                  Track your overall progress across all courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.completedLessons}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Lessons Completed
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {stats.activeCourses}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Active Courses
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {stats.streak}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Day Streak
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Overall Progress
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {stats.overallProgress}%
                    </span>
                  </div>
                  <Progress value={stats.overallProgress} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Current Courses */}
            {currentCourses.length > 0 ? (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Continue Learning
                  </CardTitle>
                  <CardDescription>
                    Pick up where you left off in your courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {currentCourses.map((course) => (
                      <div key={course.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                              {course.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300 mb-3">
                              <span>{course.lessonsCompleted}/{course.totalLessons} lessons</span>
                              <span>•</span>
                              <span>{course.estimatedCompletion} remaining</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  Progress
                                </span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  {course.progress}%
                                </span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                            </div>
                          </div>
                          <Button asChild size="sm">
                            <Link href={course.nextLessonSlug ? `/courses/${course.nextLessonSlug}` : `/courses/${course.id}`}>
                              {course.nextLessonSlug ? 'Continue' : 'Start'}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                          </Button>
                        </div>
                        
                        {course.lastLesson && (
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            <span className="font-medium">Last lesson:</span> {course.lastLesson}
                          </div>
                        )}
                        {course.nextLesson && (
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            <span className="font-medium">Next lesson:</span> {course.nextLesson}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Start Your Learning Journey
                  </CardTitle>
                  <CardDescription>
                    Choose a course to begin your web development adventure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      Ready to start learning?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Choose from our curated courses and begin your journey to becoming a web developer.
                    </p>
                    <Button asChild size="lg">
                      <Link href="/courses">
                        Browse Courses
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your latest learning activities and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex-shrink-0">
                          <activity.icon className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {activity.title}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {activity.course} • {activity.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Study Time</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {Math.floor(stats.completedLessons * 0.5)}h {Math.floor(stats.completedLessons * 0.5 * 60) % 60}m
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">This Week</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {Math.floor(stats.streak * 0.3)}h {Math.floor(stats.streak * 0.3 * 60) % 60}m
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Average/Day</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {stats.streak > 0 ? Math.floor((stats.completedLessons / stats.streak) * 0.5) : 0}h {Math.floor((stats.completedLessons / Math.max(stats.streak, 1)) * 0.5 * 60) % 60}m
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
                <CardDescription>
                  Unlock achievements as you progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        achievement.earned
                          ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                          : 'border-slate-200 dark:border-slate-700 opacity-60'
                      }`}
                    >
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          achievement.earned 
                            ? 'text-green-800 dark:text-green-200' 
                            : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          {achievement.name}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-500">
                          {achievement.description}
                        </div>
                      </div>
                      {achievement.earned && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Community</CardTitle>
                <CardDescription>
                  Connect with fellow learners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <Users className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-blue-900 dark:text-blue-100">
                        Join Discord
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        Connect with 1,000+ learners
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <Award className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium text-green-900 dark:text-green-100">
                        Project Showcase
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        Share your work
                      </div>
                    </div>
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