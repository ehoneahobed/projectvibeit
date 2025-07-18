import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  Trophy, 
  CheckCircle, 
  Calendar, 
  Clock, 
  Award,
  Share2,
  Download,
  ArrowRight,
  BookOpen,
  Target,
  Users,
  TrendingUp
} from "lucide-react"
import { getCourseBySlug } from "@/lib/content"
import { auth } from "@/lib/auth/auth"
import { getUserProgress } from "@/lib/progress-actions"
import { getCompletedLessonsCount, calculateCourseProgress, isCourseCompleted } from "@/lib/progress"
import type { IProgress } from "@/lib/models/User"
import { notFound, redirect } from "next/navigation"

interface CongratulationsPageProps {
  params: Promise<{
    courseSlug: string
  }>
}

export default async function CongratulationsPage({ params }: CongratulationsPageProps) {
  const { courseSlug } = await params
  
  // Check authentication
  const session = await auth()
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=' + encodeURIComponent(`/courses/${courseSlug}/congratulations`))
  }
  
  const course = getCourseBySlug(courseSlug)
  if (!course) {
    notFound()
  }

  // Get user progress
  const progressResult = await getUserProgress()
  const userProgress = progressResult.success ? progressResult.data || [] : []
  
  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0)
  const completedLessons = getCompletedLessonsCount(userProgress, courseSlug)
  const courseProgress = calculateCourseProgress(userProgress, courseSlug, totalLessons)
  
  // Check if course is actually completed
  if (!isCourseCompleted(userProgress, courseSlug, totalLessons)) {
    redirect(`/courses/${courseSlug}`)
  }

  // Calculate completion stats
  const totalProjects = course.modules.reduce((acc, module) => 
    acc + module.lessons.filter(lesson => lesson.type === 'project').length, 0
  )
  const completedProjects = course.modules.reduce((acc, module) => {
    return acc + module.lessons.filter(lesson => 
      lesson.type === 'project' && userProgress.some((p: IProgress) => 
        p.courseId === courseSlug && p.completedLessons.includes(lesson.id)
      )
    ).length
  }, 0)

  // Get completion date from progress
  const courseProgressData = userProgress.find((p: IProgress) => p.courseId === courseSlug)
  const completionDate = courseProgressData?.completedAt ? new Date(courseProgressData.completedAt) : new Date()
  const estimatedHours = Math.ceil(totalLessons * 0.5) // Rough estimate

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-slate-900 dark:to-purple-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Congratulations! 🎉
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-2">
            You&apos;ve successfully completed
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
            {course.title}
          </h2>
        </div>

        {/* Achievement Card */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              Course Completion Certificate
            </CardTitle>
            <CardDescription className="text-lg">
              This certifies that you have successfully completed all lessons and projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Course Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Course</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{course.title}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Completed On</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {completionDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Estimated Time</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{estimatedHours} hours</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Lessons Completed</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {completedLessons} of {totalLessons}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Projects Completed</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {completedProjects} of {totalProjects}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Final Score</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{courseProgress}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Course Progress</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">{courseProgress}%</span>
              </div>
              <Progress value={courseProgress} className="h-3" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild className="flex-1">
                <Link href="/dashboard">
                  <Trophy className="w-4 h-4 mr-2" />
                  View All Achievements
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/courses">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explore More Courses
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Skills Acquired */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Skills You&apos;ve Acquired
            </CardTitle>
            <CardDescription>
              Here are the key skills and technologies you&apos;ve mastered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {course.modules.map((module) => (
                <div key={module.id} className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {module.title}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-blue-600" />
              What&apos;s Next?
            </CardTitle>
            <CardDescription>
              Continue your learning journey with these next steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/community">
                <Card className="border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">Join the Community</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Connect with other learners and share your projects
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/courses">
                <Card className="border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-8 h-8 text-green-600" />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">Explore More Courses</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Discover new topics and expand your skills
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Share Achievement */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-purple-600" />
              Share Your Achievement
            </CardTitle>
            <CardDescription>
              Let others know about your accomplishment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share on LinkedIn
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share on Twitter
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download Certificate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 