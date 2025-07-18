import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  Trophy, 
  ArrowRight, 
  ArrowLeft,
  Share2,
  BookOpen,
  TrendingUp,
  Target,
  Users
} from "lucide-react"
import { auth } from "@/lib/auth/auth"
import { redirect } from "next/navigation"
import { getUserProgress } from "@/lib/progress-actions"
import { getLessonContent, getLessonNavigation } from "@/lib/content"
import { calculateLearningStreak, checkNewMilestones } from "@/lib/learning-streak"
import { isLessonCompleted } from "@/lib/progress"
import { SocialShare } from "@/components/social-share"
import { notFound } from "next/navigation"

interface CelebrationPageProps {
  params: Promise<{
    courseSlug: string
    moduleSlug: string
    lessonSlug: string
  }>
}

// Type for navigation lesson objects that include moduleSlug
type NavigationLesson = {
  id: string
  title: string
  description: string
  slug: string
  order: number
  type: 'lesson' | 'project' | 'assignment'
  isPublished: boolean
  moduleSlug: string
}

export default async function CelebrationPage({ params }: CelebrationPageProps) {
  const { courseSlug, moduleSlug, lessonSlug } = await params
  
  // Check authentication
  const session = await auth()
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=' + encodeURIComponent(`/courses/${courseSlug}/${moduleSlug}/${lessonSlug}/celebration`))
  }
  
  // Load lesson content and navigation
  const lessonContent = getLessonContent(courseSlug, moduleSlug, lessonSlug)
  const navigation = getLessonNavigation(courseSlug, moduleSlug, lessonSlug)
  
  if (!lessonContent || !navigation) {
    notFound()
  }

  const { current, previous, next, module, course } = navigation

  // Get user progress
  const progressResult = await getUserProgress()
  const userProgress = progressResult.success ? progressResult.data || [] : []
  
  // Check if lesson is actually completed
  if (!isLessonCompleted(userProgress, courseSlug, current.id)) {
    redirect(`/courses/${courseSlug}/${moduleSlug}/${lessonSlug}`)
  }

  // Calculate learning statistics
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const completedLessons = userProgress.reduce((acc, p) => acc + (p.completedLessons?.length || 0), 0)
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const totalStudyTime = Math.round(completedLessons * 0.5)
  
  // Calculate learning streak and check for new milestones
  const learningStreak = calculateLearningStreak(userProgress)
  const newMilestones = checkNewMilestones([], learningStreak.milestones) // Compare with empty array to show all earned

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950 dark:via-blue-950 dark:to-purple-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mb-6 animate-bounce">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Lesson Completed! 🎉
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-2">
            You&apos;ve successfully completed
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
            {current.title}
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">
            in {course.title} • Module {module.order}
          </p>
        </div>

        {/* Achievement Celebration */}
        {newMilestones.length > 0 && (
          <Card className="border-0 shadow-xl bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                🏆 New Achievement Unlocked!
              </CardTitle>
              <CardDescription className="text-lg">
                {newMilestones[0].title}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl mb-4">{newMilestones[0].icon}</div>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                {newMilestones[0].description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Progress Stats */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Your Learning Progress
            </CardTitle>
            <CardDescription>
              Keep up the great work! Here&apos;s your current progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {completedLessons}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Lessons Completed
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {learningStreak.currentStreak}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Day Streak
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {totalStudyTime}h
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Study Time
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {overallProgress}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Course Progress
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Overall Course Progress
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {overallProgress}%
                </span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Social Share Section */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-600" />
              Share Your Progress
            </CardTitle>
            <CardDescription>
              Celebrate your achievement and inspire others to learn!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SocialShare
              type="lesson-completion"
              title="Lesson Completed!"
              description={`Just completed "${current.title}" in ${course.title}! 📚\n\nEvery step forward counts in the learning journey. #VibeCoding #LearnInPublic`}
              courseName={course.title}
              stats={{
                lessonsCompleted: completedLessons,
                studyTime: totalStudyTime,
                streak: learningStreak.currentStreak
              }}
              onShare={(platform) => {
                console.log(`Shared on ${platform}`)
              }}
            />
          </CardContent>
        </Card>

        {/* Learn in Public Benefits */}
        <Card className="border-0 shadow-lg mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Why Share Your Progress?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Target className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Build Accountability</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Public commitment helps you stay motivated and consistent
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Connect with Others</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Find fellow learners and build a supportive community
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Document Your Journey</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Create a public record of your learning progress
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Inspire Others</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Your progress might encourage someone else to start learning
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4">
          {previous ? (
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/courses/${courseSlug}/${(previous as NavigationLesson).moduleSlug || moduleSlug}/${previous.slug}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous Lesson
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/courses/${courseSlug}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course
              </Link>
            </Button>
          )}
          
          {next ? (
            <Button asChild className="flex-1">
              <Link href={`/courses/${courseSlug}/${(next as NavigationLesson).moduleSlug || moduleSlug}/${next.slug}`}>
                Continue to Next Lesson
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          ) : (
            <Button asChild className="flex-1">
              <Link href={`/courses/${courseSlug}/congratulations`}>
                <Trophy className="w-4 h-4 mr-2" />
                View Certificate
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 