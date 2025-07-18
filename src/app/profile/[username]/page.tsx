import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Calendar, 
  Award,
  Target,
  Share2,
  Github,
  Mail,
  Twitter,
  Linkedin,
  Globe
} from "lucide-react"
import { notFound } from "next/navigation"
import { connectDB } from "@/lib/db"
import { User, type IUser, type IProgress } from "@/lib/models"
import type { ISocialMedia } from "@/lib/models/User"
import { getPublishedCourses } from "@/lib/content"
import { calculateLearningStreak } from "@/lib/learning-streak"
import { getPlatformById, generateSocialMediaUrl } from "@/lib/social-media-platforms"

interface PublicProfilePageProps {
  params: Promise<{
    username: string
  }>
}

/**
 * Public profile page that showcases user's learning progress
 * Encourages "learn in public" by making progress visible and shareable
 */
export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params
  
  // Find user by username
  await connectDB()
  const user = await User.findOne({ username }).lean()
  
  if (!user) {
    notFound()
  }
  
  const typedUser = user as unknown as IUser
  const userProgress = typedUser.progress || []
  const courses = getPublishedCourses()
  
  // Calculate learning statistics
  const totalLessons = courses.reduce((acc, course) => {
    return acc + course.modules.reduce((moduleAcc: number, module) => {
      return moduleAcc + module.lessons.length
    }, 0)
  }, 0)
  
  const completedLessons = userProgress.reduce((acc: number, progress: IProgress) => {
    return acc + (progress.completedLessons?.length || 0)
  }, 0)
  
  const activeCourses = userProgress.length
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const totalStudyTime = Math.round(completedLessons * 0.5)
  
  // Calculate learning streak
  const learningStreak = calculateLearningStreak(userProgress)
  
  // Get course progress details
  const courseProgress = courses.map(course => {
    const courseProgress = userProgress.find((p: IProgress) => p.courseId === course.slug)
    const totalLessons = course.modules.reduce((acc: number, module) => acc + module.lessons.length, 0)
    const completedLessons = courseProgress ? (courseProgress.completedLessons?.length || 0) : 0
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
    
    return {
      ...course,
      completedLessons,
      totalLessons,
      progress
    }
  }).filter(course => course.completedLessons > 0 || course.progress > 0)
  
  // Get recent achievements
  const earnedMilestones = learningStreak.milestones.filter(m => m.achieved)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={typedUser.image || undefined} alt={typedUser.name || "User"} />
                <AvatarFallback className="text-2xl">
                  {typedUser.name?.charAt(0) || typedUser.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {typedUser.name || "Anonymous Learner"}
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                  Learning in public • {completedLessons} lessons completed
                </p>
                {typedUser.bio && (
                  <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
                    {typedUser.bio}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2">
                  {/* Legacy social media links */}
                  {typedUser.githubUsername && (
                    <Link 
                      href={`https://github.com/${typedUser.githubUsername}`}
                      target="_blank"
                      className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      <Github className="w-4 h-4" />
                      {typedUser.githubUsername}
                    </Link>
                  )}
                  {typedUser.twitterUsername && (
                    <Link 
                      href={`https://twitter.com/${typedUser.twitterUsername}`}
                      target="_blank"
                      className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      <Twitter className="w-4 h-4" />
                      @{typedUser.twitterUsername}
                    </Link>
                  )}
                  {typedUser.linkedinUsername && (
                    <Link 
                      href={`https://linkedin.com/in/${typedUser.linkedinUsername}`}
                      target="_blank"
                      className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      <Linkedin className="w-4 h-4" />
                      @{typedUser.linkedinUsername}
                    </Link>
                  )}
                  {typedUser.website && (
                    <Link 
                      href={typedUser.website}
                      target="_blank"
                      className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </Link>
                  )}
                  
                  {/* Dynamic social media links */}
                  {typedUser.socialMedia && typedUser.socialMedia.length > 0 && (
                    <div className="flex items-center gap-2">
                      {typedUser.socialMedia.map((social: ISocialMedia, index: number) => {
                        const platform = getPlatformById(social.platform)
                        if (!platform) return null
                        
                        return (
                          <Link
                            key={index}
                            href={social.url || generateSocialMediaUrl(platform, social.handle)}
                            target="_blank"
                            className={`flex items-center gap-1 text-sm hover:opacity-80 transition-opacity ${platform.color}`}
                            title={`${platform.name}: ${social.handle}`}
                          >
                            <platform.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{social.handle}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(typedUser.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
              <Button size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Connect
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Learning Stats */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Learning Statistics
                </CardTitle>
                <CardDescription>
                  Progress across all courses and learning journey
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
                      {activeCourses}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Active Courses
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
                      {learningStreak.currentStreak}
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
                      {overallProgress}%
                    </span>
                  </div>
                  <Progress value={overallProgress} className="h-3" />
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
                  {courseProgress.map((course) => (
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
                        <Badge variant={course.progress === 100 ? "default" : "secondary"}>
                          {course.progress === 100 ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Achievements */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Achievements
                </CardTitle>
                <CardDescription>
                  Milestones and accomplishments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {earnedMilestones.slice(0, 6).map((milestone) => (
                    <div
                      key={milestone.id}
                      className="p-3 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{milestone.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-green-800 dark:text-green-200">
                            {milestone.title}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-500">
                            {milestone.description}
                          </div>
                        </div>
                        <Award className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Streak */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Learning Streak
                </CardTitle>
                <CardDescription>
                  Consistency in learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-orange-600">
                    {learningStreak.currentStreak}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Current Day Streak
                  </div>
                  <div className="text-sm text-slate-500">
                    Longest: {learningStreak.longestStreak} days
                  </div>
                  <div className="text-sm text-slate-500">
                    Total active days: {learningStreak.totalActiveDays}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learn in Public */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-blue-600" />
                  Learn in Public
                </CardTitle>
                <CardDescription>
                  Share your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    This profile showcases the power of learning in public. 
                    Share your progress to stay accountable and inspire others!
                  </p>
                  <Button className="w-full" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share This Profile
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