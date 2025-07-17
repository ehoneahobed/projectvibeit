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
  Target
} from "lucide-react"

// Mock data - this will be replaced with real data from the database
const userData = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://github.com/shadcn.png",
  joinDate: "2024-01-15",
  totalCourses: 2,
  completedLessons: 12,
  totalLessons: 80,
  streak: 7,
  level: "Beginner",
  achievements: [
    { id: 1, name: "First Steps", description: "Complete your first lesson", icon: "🎯", earned: true },
    { id: 2, name: "Week Warrior", description: "Learn for 7 days in a row", icon: "🔥", earned: true },
    { id: 3, name: "Project Master", description: "Complete 5 projects", icon: "🏆", earned: false },
  ]
}

const recentActivity = [
  {
    id: 1,
    type: "lesson_completed",
    title: "Completed: Introduction to JavaScript",
    course: "Fundamentals of Vibe Coding",
    timestamp: "2 hours ago",
    icon: CheckCircle
  },
  {
    id: 2,
    type: "project_submitted",
    title: "Submitted: Personal Portfolio",
    course: "Fundamentals of Vibe Coding",
    timestamp: "1 day ago",
    icon: Play
  },
  {
    id: 3,
    type: "lesson_started",
    title: "Started: React Fundamentals",
    course: "Fundamentals of Vibe Coding",
    timestamp: "3 days ago",
    icon: BookOpen
  }
]

const currentCourses = [
  {
    id: "fundamentals-of-vibe-coding",
    title: "Fundamentals of Vibe Coding",
    progress: 25,
    lastLesson: "Setting Up Your Development Environment",
    nextLesson: "Your First HTML Page",
    estimatedCompletion: "8 weeks",
    lessonsCompleted: 10,
    totalLessons: 40
  },
  {
    id: "advanced-react-patterns",
    title: "Advanced React Patterns",
    progress: 0,
    lastLesson: null,
    nextLesson: "Introduction to React",
    estimatedCompletion: "12 weeks",
    lessonsCompleted: 0,
    totalLessons: 30
  }
]

export default function DashboardPage() {
  const overallProgress = Math.round((userData.completedLessons / userData.totalLessons) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Welcome back, {userData.name}!
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                  Keep up the great work on your learning journey
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Level {userData.level}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {userData.streak} day streak
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
                      {userData.completedLessons}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Lessons Completed
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {userData.totalCourses}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Active Courses
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {userData.streak}
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

            {/* Current Courses */}
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
                          <Link href={`/courses/${course.id}`}>
                            Continue
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                      
                      {course.lastLesson && (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-medium">Last lesson:</span> {course.lastLesson}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
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
                    <span className="text-sm font-medium text-slate-900 dark:text-white">24h 30m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">This Week</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">8h 15m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Average/Day</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">1h 10m</span>
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
                  {userData.achievements.map((achievement) => (
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
                  Connect with other learners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Active Learners</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Discussions</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Projects Shared</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">156</span>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/community">
                      <Users className="w-4 h-4 mr-2" />
                      Join Community
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/projects">
                      <Target className="w-4 h-4 mr-2" />
                      View Projects
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