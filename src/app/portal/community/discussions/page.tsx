"use client"

import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, CheckCircle, Circle } from "lucide-react"
import { DiscussionManagement } from "@/components/discussions/discussion-management"

export default function DiscussionsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Discussion Management
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Monitor and manage community discussions across all courses
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Discussions
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  <Suspense fallback="...">
                    <DiscussionStats type="total" />
                  </Suspense>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Resolved
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  <Suspense fallback="...">
                    <DiscussionStats type="resolved" />
                  </Suspense>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Circle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Open
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  <Suspense fallback="...">
                    <DiscussionStats type="open" />
                  </Suspense>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Discussion Management */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            All Discussions
          </CardTitle>
          <CardDescription>
            View and manage discussions from all courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Loading discussions...</p>
            </div>
          }>
            <DiscussionManagement />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

async function DiscussionStats({ type }: { type: 'total' | 'resolved' | 'open' }) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/portal/community/discussions`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return "0"
    }
    
    const result = await response.json()
    
    if (!result.success || !result.data) {
      return "0"
    }
    
    const discussions = result.data
    
    switch (type) {
      case 'total':
        return discussions.length.toString()
      case 'resolved':
        return discussions.filter((d: { isResolved: boolean }) => d.isResolved).length.toString()
      case 'open':
        return discussions.filter((d: { isResolved: boolean }) => !d.isResolved).length.toString()
      default:
        return "0"
    }
  } catch (error) {
    console.error('Error fetching discussion stats:', error)
    return "0"
  }
} 