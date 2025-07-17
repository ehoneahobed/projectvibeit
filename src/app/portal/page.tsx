// main page to be redirected to after login

import { redirect } from "next/navigation"
import { checkAdminAuth } from "@/lib/auth/admin-auth"
import { AuthCheck } from "@/components/auth/auth-check"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Target, 
  Trophy, 
  MessageSquare,
  Plus,
  BarChart3,
  Award,
  Clock
} from "lucide-react"
import Link from "next/link"

export default async function PortalPage() {
  const { session, user } = await checkAdminAuth()

  // Mock data - in a real app, this would come from the database
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalCourses: 3,
    totalLessons: 45,
    completedLessons: 15678,
    totalProjects: 2341,
    averageCompletion: 68,
    weeklyGrowth: 12
  }

  const recentActivity = [
    {
      id: 1,
      type: "user_registered",
      title: "New user registered",
      description: "John Doe joined the platform",
      time: "2 minutes ago"
    },
    {
      id: 2,
      type: "course_completed",
      title: "Course completed",
      description: "Sarah completed Fundamentals of Vibe Coding",
      time: "15 minutes ago"
    },
    {
      id: 3,
      type: "project_submitted",
      title: "Project submitted",
      description: "Mike submitted Personal Portfolio project",
      time: "1 hour ago"
    },
    {
      id: 4,
      type: "achievement_unlocked",
      title: "Achievement unlocked",
      description: "Emma earned 'Lesson Master' badge",
      time: "2 hours ago"
    }
  ]

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome back, {user.name || user.email}!
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Here's what's happening with your learning platform today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.weeklyGrowth}% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% engagement rate
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalLessons} total lessons
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageCompletion}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedLessons.toLocaleString()} lessons completed
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild className="h-auto p-4 flex flex-col items-start">
                    <Link href="/portal/courses/add">
                      <BookOpen className="w-5 h-5 mb-2" />
                      <span className="font-medium">Add New Course</span>
                      <span className="text-sm opacity-70">Create a new learning course</span>
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-start">
                    <Link href="/portal/users">
                      <Users className="w-5 h-5 mb-2" />
                      <span className="font-medium">Manage Users</span>
                      <span className="text-sm opacity-70">View and manage user accounts</span>
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-start">
                    <Link href="/portal/analytics/learning">
                      <BarChart3 className="w-5 h-5 mb-2" />
                      <span className="font-medium">View Analytics</span>
                      <span className="text-sm opacity-70">Check learning analytics</span>
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-start">
                    <Link href="/portal/community/discussions">
                      <MessageSquare className="w-5 h-5 mb-2" />
                      <span className="font-medium">Community</span>
                      <span className="text-sm opacity-70">Monitor discussions</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest platform activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        {activity.type === "user_registered" && <Users className="w-4 h-4 text-blue-500" />}
                        {activity.type === "course_completed" && <Trophy className="w-4 h-4 text-green-500" />}
                        {activity.type === "project_submitted" && <Award className="w-4 h-4 text-purple-500" />}
                        {activity.type === "achievement_unlocked" && <Target className="w-4 h-4 text-orange-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 dark:text-white text-sm">
                          {activity.title}
                        </div>
                        <div className="text-slate-600 dark:text-slate-400 text-sm">
                          {activity.description}
                        </div>
                        <div className="text-slate-500 dark:text-slate-500 text-xs mt-1">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthCheck>
  )
}
