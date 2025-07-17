import { auth } from "@/lib/auth/auth"
import { redirect } from "next/navigation"
import { getUserProgress } from "@/lib/progress-actions"
import { getPublishedCourses } from "@/lib/content"
import { calculateCourseProgress, getCompletedLessonsCount } from "@/lib/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Calendar,
  Clock,
  Target,
  CheckCircle,
  Star,
  Award,
  Zap,
  Home
} from "lucide-react"
import Link from "next/link"

/**
 * Calculate comprehensive user statistics
 */
function calculateUserStats(userProgress: any[], courses: any[]) {
  const totalLessons = courses.reduce((acc, course) => {
    return acc + course.modules.reduce((moduleAcc: number, module: any) => {
      return moduleAcc + module.lessons.length
    }, 0)
  }, 0)

  const completedLessons = userProgress.reduce((acc, progress) => {
    return acc + progress.completedLessons.length
  }, 0)

  const activeCourses = userProgress.length
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  // Calculate estimated study time (30 minutes per lesson)
  const totalStudyTime = Math.round(completedLessons * 0.5)
  const weeklyStudyTime = Math.round(totalStudyTime / Math.max(1, Math.floor(completedLessons / 3)))

  return {
    totalLessons,
    completedLessons,
    activeCourses,
    overallProgress,
    totalStudyTime,
    weeklyStudyTime
  }
}

/**
 * Get detailed course progress
 */
function getDetailedCourseProgress(userProgress: any[], courses: any[]) {
  return courses.map(course => {
    const courseProgress = userProgress.find(p => p.courseId === course.slug)
    const totalLessons = course.modules.reduce((acc: number, module: any) => acc + module.lessons.length, 0)
    const completedLessons = courseProgress ? courseProgress.completedLessons.length : 0
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    // Calculate module progress
    const moduleProgress = course.modules.map((module: any) => {
      const moduleLessonIds = module.lessons.map((l: any) => l.id)
      const moduleCompleted = courseProgress ? 
        module.lessons.filter((l: any) => courseProgress.completedLessons.includes(l.id)).length : 0
      const moduleProgressPercent = module.lessons.length > 0 ? 
        Math.round((moduleCompleted / module.lessons.length) * 100) : 0

      return {
        ...module,
        completedLessons: moduleCompleted,
        totalLessons: module.lessons.length,
        progress: moduleProgressPercent
      }
    })

    return {
      ...course,
      completedLessons,
      totalLessons,
      progress,
      moduleProgress
    }
  })
}

/**
 * Generate achievements based on progress
 */
function generateAchievements(userProgress: any[], courses: any[]) {
  const totalCompleted = userProgress.reduce((acc, p) => acc + p.completedLessons.length, 0)
  const activeCourses = userProgress.length
  const totalStudyTime = Math.round(totalCompleted * 0.5)

  return [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first lesson",
      icon: "🎯",
      earned: totalCompleted >= 1,
      progress: Math.min(100, (totalCompleted / 1) * 100)
    },
    {
      id: 2,
      name: "Week Warrior",
      description: "Learn for 7 days in a row",
      icon: "🔥",
      earned: totalCompleted >= 7,
      progress: Math.min(100, (totalCompleted / 7) * 100)
    },
    {
      id: 3,
      name: "Course Explorer",
      description: "Start 3 different courses",
      icon: "🏆",
      earned: activeCourses >= 3,
      progress: Math.min(100, (activeCourses / 3) * 100)
    },
    {
      id: 4,
      name: "Lesson Master",
      description: "Complete 20 lessons",
      icon: "⭐",
      earned: totalCompleted >= 20,
      progress: Math.min(100, (totalCompleted / 20) * 100)
    },
    {
      id: 5,
      name: "Study Champion",
      description: "Study for 10 hours total",
      icon: "⏰",
      earned: totalStudyTime >= 10,
      progress: Math.min(100, (totalStudyTime / 10) * 100)
    },
    {
      id: 6,
      name: "Project Builder",
      description: "Complete 5 projects",
      icon: "🚀",
      earned: totalCompleted >= 5,
      progress: Math.min(100, (totalCompleted / 5) * 100)
    }
  ]
}

export default async function ProgressPage() {
  // Check authentication
  const session = await auth()
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/progress')
  }

  // Get user progress and courses
  const progressResult = await getUserProgress()
  const userProgress = progressResult.success ? progressResult.data : []
  const courses = getPublishedCourses()

  // Calculate statistics
  const stats = calculateUserStats(userProgress, courses)
  const detailedProgress = getDetailedCourseProgress(userProgress, courses)
  const achievements = generateAchievements(userProgress, courses)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Your Learning Progress
            </h1>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Track your journey through our comprehensive curriculum and celebrate your achievements
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overall Progress */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Overall Progress
                </CardTitle>
                <CardDescription>
                  Your complete learning journey across all courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6 mb-6">
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
                      {stats.totalStudyTime}h
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Study Time
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                      {stats.weeklyStudyTime}h
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Weekly Average
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
                  <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                    {stats.completedLessons} of {stats.totalLessons} lessons completed
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Progress */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Course Progress
                </CardTitle>
                <CardDescription>
                  Detailed progress for each course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {detailedProgress.map((course) => (
                    <div key={course.slug} className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            {course.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300 mb-3">
                            <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                            <span>•</span>
                            <span>{course.estimatedHours}h estimated</span>
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
                          <Link href={`/courses/${course.slug}`}>
                            View Course
                          </Link>
                        </Button>
                      </div>
                      
                      {/* Module Progress */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-slate-900 dark:text-white">Module Progress:</h4>
                                                 <div className="grid gap-3">
                           {course.moduleProgress.map((module: any) => (
                             <div key={module.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium text-sm text-slate-900 dark:text-white">
                                  {module.title}
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">
                                  {module.completedLessons}/{module.totalLessons} lessons
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-16">
                                  <Progress value={module.progress} className="h-1" />
                                </div>
                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                  {module.progress}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Study Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Study Time</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {stats.totalStudyTime}h {Math.round((stats.totalStudyTime % 1) * 60)}m
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Weekly Average</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {stats.weeklyStudyTime}h {Math.round((stats.weeklyStudyTime % 1) * 60)}m
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Completion Rate</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {stats.overallProgress}%
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
                      className={`p-3 rounded-lg border ${
                        achievement.earned
                          ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className={`font-medium ${
                            achievement.earned 
                              ? 'text-green-800 dark:text-green-200' 
                              : 'text-slate-700 dark:text-slate-300'
                          }`}>
                            {achievement.name}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-500">
                            {achievement.description}
                          </div>
                          <div className="mt-2">
                            <Progress value={achievement.progress} className="h-1" />
                          </div>
                        </div>
                        {achievement.earned && (
                          <Award className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button asChild variant="outline" size="sm" className="w-full justify-start">
                    <Link href="/dashboard">
                      <Home className="w-4 h-4 mr-2" />
                      Back to Dashboard
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full justify-start">
                    <Link href="/courses">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Browse Courses
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full justify-start">
                    <Link href="/achievements">
                      <Trophy className="w-4 h-4 mr-2" />
                      View All Achievements
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 