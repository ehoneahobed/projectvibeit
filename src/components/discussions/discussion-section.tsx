"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Send, CheckCircle, Circle, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Discussion {
  id: string
  content: string
  isResolved: boolean
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    email: string
    image?: string
  }
  replies: Reply[]
  replyCount: number
}

interface Reply {
  id: string
  content: string
  createdAt: string
  userId: string
}

interface DiscussionSectionProps {
  courseSlug: string
  moduleSlug: string
  lessonSlug: string
  lessonId?: string
}

export function DiscussionSection({ 
  courseSlug, 
  moduleSlug, 
  lessonSlug, 
  lessonId 
}: DiscussionSectionProps) {
  const { data: session } = useSession()
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [newDiscussion, setNewDiscussion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showNewDiscussionForm, setShowNewDiscussionForm] = useState(false)

  const fetchDiscussions = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      
      if (lessonId) {
        params.append('lessonId', lessonId)
      } else {
        params.append('courseSlug', courseSlug)
        params.append('moduleSlug', moduleSlug)
        params.append('lessonSlug', lessonSlug)
      }

      const response = await fetch(`/api/discussions?${params}`)
      const result = await response.json()

      if (result.success) {
        setDiscussions(result.data)
      }
    } catch (error) {
      console.error('Error fetching discussions:', error)
    } finally {
      setIsLoading(false)
    }
  }, [courseSlug, moduleSlug, lessonSlug, lessonId])

  useEffect(() => {
    fetchDiscussions()
  }, [fetchDiscussions])

  const handleSubmitDiscussion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!newDiscussion.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      
      const payload = { 
        courseSlug, 
        moduleSlug, 
        lessonSlug, 
        content: newDiscussion.trim() 
      }

      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        setDiscussions([result.data, ...discussions])
        setNewDiscussion("")
        setShowNewDiscussionForm(false)
      }
    } catch (error) {
      console.error('Error creating discussion:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteDiscussion = async (discussionId: string) => {
    if (!confirm('Are you sure you want to delete this discussion? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/discussions/${discussionId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        setDiscussions(discussions.filter(d => d.id !== discussionId))
      } else {
        alert(result.error || 'Failed to delete discussion')
      }
    } catch (error) {
      console.error('Error deleting discussion:', error)
      alert('Failed to delete discussion')
    }
  }

  if (!session?.user) {
    return (
      <Card className="border-0 shadow-sm mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Discussions
          </CardTitle>
          <CardDescription>
            Sign in to participate in discussions
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Discussions
            </CardTitle>
            <CardDescription>
              Ask questions and get help from the community
            </CardDescription>
          </div>
          <Button
            onClick={() => setShowNewDiscussionForm(!showNewDiscussionForm)}
            variant="outline"
            size="sm"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Ask Question
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* New Discussion Form */}
        {showNewDiscussionForm && (
          <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <form onSubmit={handleSubmitDiscussion}>
              <Textarea
                placeholder="What's your question about this lesson?"
                value={newDiscussion}
                onChange={(e) => setNewDiscussion(e.target.value)}
                className="mb-3 min-h-[100px]"
                disabled={isSubmitting}
              />
              <div className="flex items-center gap-2">
                <Button 
                  type="submit" 
                  disabled={!newDiscussion.trim() || isSubmitting}
                  size="sm"
                >
                  {isSubmitting ? (
                    "Posting..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Post Question
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowNewDiscussionForm(false)
                    setNewDiscussion("")
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Discussions List */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Loading discussions...</p>
          </div>
        ) : discussions.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No discussions yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Be the first to ask a question about this lesson!
            </p>
            <Button
              onClick={() => setShowNewDiscussionForm(true)}
              variant="outline"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Start Discussion
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
                    {discussions.map((discussion) => (
          <DiscussionItem 
            key={discussion.id} 
            discussion={discussion} 
            onReplyAdded={fetchDiscussions}
            onDeleteDiscussion={handleDeleteDiscussion}
            currentUserId={session.user?.id || ''}
            userRole={(session.user as { role?: string })?.role}
          />
        ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface DiscussionItemProps {
  discussion: Discussion
  onReplyAdded: () => void
  onDeleteDiscussion: (discussionId: string) => void
  currentUserId: string
  userRole?: string
}

function DiscussionItem({ discussion, onReplyAdded, onDeleteDiscussion, currentUserId, userRole }: DiscussionItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThreadedReplyForm, setShowThreadedReplyForm] = useState<string | null>(null)
  const [threadedReplyContent, setThreadedReplyContent] = useState("")
  const [isSubmittingThreaded, setIsSubmittingThreaded] = useState(false)

  const handleSubmitReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!replyContent.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      
      const response = await fetch(`/api/discussions/${discussion.id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: replyContent.trim() }),
      })

      const result = await response.json()

      if (result.success) {
        setReplyContent("")
        setShowReplyForm(false)
        onReplyAdded()
      }
    } catch (error) {
      console.error('Error adding reply:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitThreadedReply = async (e: React.FormEvent<HTMLFormElement>, replyId: string) => {
    e.preventDefault()
    
    if (!threadedReplyContent.trim() || isSubmittingThreaded) return

    try {
      setIsSubmittingThreaded(true)
      
      const response = await fetch(`/api/discussions/${discussion.id}/replies/${replyId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: threadedReplyContent.trim() }),
      })

      const result = await response.json()

      if (result.success) {
        setThreadedReplyContent("")
        setShowThreadedReplyForm(null)
        onReplyAdded()
      }
    } catch (error) {
      console.error('Error adding threaded reply:', error)
    } finally {
      setIsSubmittingThreaded(false)
    }
  }

  const handleDeleteReply = async (replyId: string) => {
    if (!confirm('Are you sure you want to delete this reply? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/discussions/${discussion.id}/replies/${replyId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        onReplyAdded() // Refresh the discussions to show updated reply count
      } else {
        alert(result.error || 'Failed to delete reply')
      }
    } catch (error) {
      console.error('Error deleting reply:', error)
      alert('Failed to delete reply')
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
      {/* Discussion Header */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={discussion.author.image} />
          <AvatarFallback className="text-xs">
            {getInitials(discussion.author.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-900 dark:text-white text-sm">
                {discussion.author.name}
              </span>
              <Badge 
                variant={discussion.isResolved ? "default" : "secondary"} 
                className="text-xs"
              >
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
            {/* Delete button - only show for author or admin */}
            {(currentUserId === discussion.author.id || userRole === 'admin' || userRole === 'contributor') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteDiscussion(discussion.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}
          </div>
        </div>
      </div>

      {/* Discussion Content */}
      <div className="mb-4">
        <p className="text-slate-900 dark:text-white whitespace-pre-wrap">
          {discussion.content}
        </p>
      </div>

      {/* Replies */}
      {discussion.replies.length > 0 && (
        <div className="mb-4">
          <Separator className="mb-3" />
          <div className="space-y-3">
            {discussion.replies.map((reply) => (
              <div key={reply.id} className="ml-8 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-2 mb-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {getInitials("User")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                    </div>
                    <p className="text-sm text-slate-900 dark:text-white whitespace-pre-wrap">
                      {reply.content}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowThreadedReplyForm(showThreadedReplyForm === reply.id ? null : reply.id)}
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Reply
                      </Button>
                      {/* Delete reply button - only show for author or admin */}
                      {(currentUserId === reply.userId || userRole === 'admin' || userRole === 'contributor') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReply(reply.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Threaded Reply Form */}
                {showThreadedReplyForm === reply.id && (
                  <div className="ml-6 mt-3">
                    <form onSubmit={(e) => handleSubmitThreadedReply(e, reply.id)}>
                      <Textarea
                        placeholder="Write your reply..."
                        value={threadedReplyContent}
                        onChange={(e) => setThreadedReplyContent(e.target.value)}
                        className="mb-3 min-h-[60px]"
                        disabled={isSubmittingThreaded}
                      />
                      <div className="flex items-center gap-2">
                        <Button 
                          type="submit" 
                          disabled={!threadedReplyContent.trim() || isSubmittingThreaded}
                          size="sm"
                        >
                          {isSubmittingThreaded ? "Posting..." : "Post Reply"}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowThreadedReplyForm(null)
                            setThreadedReplyContent("")
                          }}
                          disabled={isSubmittingThreaded}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mb-4">
          <form onSubmit={handleSubmitReply}>
            <Textarea
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="mb-3 min-h-[80px]"
              disabled={isSubmitting}
            />
            <div className="flex items-center gap-2">
              <Button 
                type="submit" 
                disabled={!replyContent.trim() || isSubmitting}
                size="sm"
              >
                {isSubmitting ? "Posting..." : "Post Reply"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowReplyForm(false)
                  setReplyContent("")
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Reply
        </Button>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {discussion.replyCount} {discussion.replyCount === 1 ? 'reply' : 'replies'}
        </span>
      </div>
    </div>
  )
} 