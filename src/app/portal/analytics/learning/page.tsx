"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen,
  Target,
  Loader2,
  AlertCircle,
  Calendar,
  Award
} from "lucide-react"

type LearningAnalytics = {
  totalUsers: number
  activeUsers: number
  totalCourses: number
  totalLessons: number
  completedLessons: number
  averageCompletion: number
  weeklyGrowth: number
  monthlyGrowth: number
  topCourses: Array<{
    title: string
    completions: number
    averageProgress: number
  }>
  userEngagement: {
    daily: number
    weekly: number
    monthly: number
  }
  completionTrends: Array<{
    date: string
    completions: number
  }>
}

export default function LearningAnalyticsPage() {
  const [analytics, setAnalytics] = useState<LearningAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/portal/analytics/learning')
        if (!response.ok) {
          throw new Error('Failed to fetch analytics')
        }

        const data = await response.json()
        if (data.success) {
          setAnalytics(data.data)
        } else {
          throw new Error(data.error || 'Failed to fetch analytics')
        }
      } catch (err) {
        console.error('Error fetching analytics:', err)
        setError('Failed to load analytics')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Analytics</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Learning Analytics
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Track learning progress and engagement across your platform
        </p>
      </div>

      {analytics && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {analytics.weeklyGrowth > 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                  )}
                  {Math.abs(analytics.weeklyGrowth)}% this week
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.activeUsers.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">
                  {Math.round((analytics.activeUsers / analytics.totalUsers) * 100)}% engagement
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.averageCompletion}%</div>
                <div className="text-xs text-muted-foreground">
                  {analytics.completedLessons.toLocaleString()} lessons completed
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalCourses}</div>
                <div className="text-xs text-muted-foreground">
                  {analytics.totalLessons} total lessons
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* User Engagement */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Engagement
                </CardTitle>
                <CardDescription>
                  Active users over different time periods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Daily Active</span>
                    </div>
                    <Badge variant="secondary">{analytics.userEngagement.daily}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Weekly Active</span>
                    </div>
                    <Badge variant="secondary">{analytics.userEngagement.weekly}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">Monthly Active</span>
                    </div>
                    <Badge variant="secondary">{analytics.userEngagement.monthly}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Courses */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Top Performing Courses
                </CardTitle>
                <CardDescription>
                  Courses with highest completion rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topCourses.map((course, index) => (
                    <div key={course.title} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{course.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {course.completions} completions
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{course.averageProgress}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Growth Trends */}
          <Card className="border-0 shadow-lg mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Growth Trends
              </CardTitle>
              <CardDescription>
                Platform growth over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    +{analytics.weeklyGrowth}%
                  </div>
                  <div className="text-sm text-muted-foreground">Weekly Growth</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    +{analytics.monthlyGrowth}%
                  </div>
                  <div className="text-sm text-muted-foreground">Monthly Growth</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
} 