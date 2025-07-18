"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MessageSquare, 
  Search, 
  Calendar, 
  Users,
  Loader2,
  AlertCircle,
  Eye,
  Reply,
  CheckCircle,
  Circle
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

type Discussion = {
  id: string
  content: string
  author: {
    id: string
    name?: string
    email: string
    image?: string
  }
  replies: Array<{
    id: string
    content: string
    createdAt: string
    userId: string
  }>
  replyCount: number
  isResolved: boolean
  createdAt: string
  updatedAt: string
}

export function DiscussionManagement() {
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/portal/community/discussions')
        if (!response.ok) {
          throw new Error('Failed to fetch discussions')
        }

        const data = await response.json()
        if (data.success) {
          setDiscussions(data.data)
        } else {
          throw new Error(data.error || 'Failed to fetch discussions')
        }
      } catch (err) {
        console.error('Error fetching discussions:', err)
        setError('Failed to load discussions')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDiscussions()
  }, [])

  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "resolved" && discussion.isResolved) ||
                         (statusFilter === "unresolved" && !discussion.isResolved)
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading discussions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Discussions</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="all">All Discussions</option>
                <option value="resolved">Resolved</option>
                <option value="unresolved">Unresolved</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discussions List */}
      {filteredDiscussions.length > 0 ? (
        <div className="space-y-4">
          {filteredDiscussions.map((discussion) => (
            <Card key={discussion.id} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={discussion.author.image} alt={discussion.author.name || discussion.author.email} />
                      <AvatarFallback>{getInitials(discussion.author.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={discussion.isResolved ? "default" : "secondary"}>
                          {discussion.isResolved ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Resolved
                            </>
                          ) : (
                            <>
                              <Circle className="w-3 h-3 mr-1" />
                              Open
                            </>
                          )}
                        </Badge>
                      </div>
                      <p className="text-slate-900 dark:text-white mb-3 line-clamp-2">
                        {discussion.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{discussion.author.name || discussion.author.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Reply className="w-4 h-4" />
                          <span>{discussion.replyCount} {discussion.replyCount === 1 ? 'reply' : 'replies'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/portal/community/discussions/${discussion.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">No discussions found</h3>
          <p className="text-slate-600 dark:text-slate-400">
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filters"
              : "No discussions have been created yet"
            }
          </p>
        </div>
      )}
    </div>
  )
} 