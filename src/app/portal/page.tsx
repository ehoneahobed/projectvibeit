"use client"

import { useEffect, useState } from "react"
import { AuthCheck } from "@/components/auth/auth-check"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  Clock,
  Loader2
} from "lucide-react"
import Link from "next/link"

type PortalStats = {
  totalUsers: number
  activeUsers: number
  totalCourses: number
  totalLessons: number
  completedLessons: number
  totalProjects: number
  averageCompletion: number
  weeklyGrowth: number
}

type Activity = {
  id: string
  type: "user_registered" | "course_completed" | "project_submitted"
  title: string
  description: string
  time: string
}

export default function PortalPage() {
  const [stats, setStats] = useState<PortalStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPortalData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch stats and activity in parallel
        const [statsResponse, activityResponse] = await Promise.all([
          fetch('/api/portal/stats'),
          fetch('/api/portal/activity')
        ])

        if (!statsResponse.ok || !activityResponse.ok) {
          throw new Error('Failed to fetch portal data')
        }

        const [statsData, activityData] = await Promise.all([
          statsResponse.json(),
          activityResponse.json()
        ])

        if (statsData.success) {
          setStats(statsData.data)
        }

        if (activityData.success) {
          setRecentActivity(activityData.data)
        }
      } catch (err) {
        console.error('Error fetching portal data:', err)
        setError('Failed to load portal data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPortalData()
  }, [])

  if (isLoading) {
    return (
      <AuthCheck>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading portal data...</p>
            </div>
          </div>
        </div>
      </AuthCheck>
    )
  }

  if (error) {
    return (
      <AuthCheck>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <Target className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </AuthCheck>
    )
  }

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome back!
          </h1>
                      <p className="text-slate-600 dark:text-slate-300">
              Here&apos;s what&apos;s happening with your learning platform today.
            </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.weeklyGrowth} new this week
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
        )}

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
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex-shrink-0 mt-1">
                          {activity.type === "user_registered" && <Users className="w-4 h-4 text-blue-500" />}
                          {activity.type === "course_completed" && <Trophy className="w-4 h-4 text-green-500" />}
                          {activity.type === "project_submitted" && <Award className="w-4 h-4 text-purple-500" />}
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
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthCheck>
  )
}
