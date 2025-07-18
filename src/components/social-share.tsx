"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Share2, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Copy, 
  CheckCircle,
  Trophy,
  TrendingUp,
  BookOpen,
  Award
} from "lucide-react"
import { toast } from "sonner"

interface SocialShareProps {
  type: "lesson-completion" | "achievement-earned" | "course-completion" | "milestone-reached"
  title: string
  description: string
  stats?: {
    lessonsCompleted?: number
    totalLessons?: number
    studyTime?: number
    achievements?: number
    streak?: number
  }
  courseName?: string
  achievementName?: string
  onShare?: (platform: string) => void
  className?: string
}

/**
 * Social sharing component that appears automatically when users complete lessons
 * or earn achievements, making "learn in public" seamless and frictionless
 */
export function SocialShare({
  type,
  title,
  description,
  stats,
  courseName,
  achievementName,
  onShare,
  className = ""
}: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const getShareText = () => {
    const baseText = `🎉 ${title}`
    
    switch (type) {
      case "lesson-completion":
        return `${baseText}\n\nJust completed a lesson in ${courseName}! 📚\n\n${description}`
      
      case "achievement-earned":
        return `${baseText}\n\n🏆 Earned the "${achievementName}" achievement!\n\n${description}`
      
      case "course-completion":
        return `${baseText}\n\n🎓 Just completed ${courseName}!\n\n${description}`
      
      case "milestone-reached":
        return `${baseText}\n\n🚀 Reached a learning milestone!\n\n${description}`
      
      default:
        return `${baseText}\n\n${description}`
    }
  }

  const getShareUrl = () => {
    // In a real app, this would be the user's public profile or achievement page
    return `${window.location.origin}/profile`
  }

  const handleShare = async (platform: string) => {
    const text = getShareText()
    const url = getShareUrl()
    
    try {
      switch (platform) {
        case "twitter":
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=VibeCoding,LearnInPublic`
          window.open(twitterUrl, "_blank")
          break
          
        case "linkedin":
          const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`
          window.open(linkedinUrl, "_blank")
          break
          
        case "facebook":
          const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
          window.open(facebookUrl, "_blank")
          break
          
        case "copy":
          await navigator.clipboard.writeText(`${text}\n\n${url}`)
          setCopied(true)
          toast.success("Copied to clipboard!")
          setTimeout(() => setCopied(false), 2000)
          break
      }
      
      onShare?.(platform)
    } catch (error) {
      console.error("Error sharing:", error)
      toast.error("Failed to share. Please try again.")
    }
  }

  const getIcon = () => {
    switch (type) {
      case "lesson-completion":
        return <BookOpen className="w-5 h-5 text-blue-600" />
      case "achievement-earned":
        return <Trophy className="w-5 h-5 text-yellow-600" />
      case "course-completion":
        return <Award className="w-5 h-5 text-green-600" />
      case "milestone-reached":
        return <TrendingUp className="w-5 h-5 text-purple-600" />
      default:
        return <Share2 className="w-5 h-5 text-slate-600" />
    }
  }

  const getStatsDisplay = () => {
    if (!stats) return null

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {stats.lessonsCompleted !== undefined && (
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{stats.lessonsCompleted}</div>
            <div className="text-xs text-slate-500">Lessons</div>
          </div>
        )}
        {stats.studyTime !== undefined && (
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{stats.studyTime}h</div>
            <div className="text-xs text-slate-500">Study Time</div>
          </div>
        )}
        {stats.achievements !== undefined && (
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">{stats.achievements}</div>
            <div className="text-xs text-slate-500">Achievements</div>
          </div>
        )}
        {stats.streak !== undefined && (
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{stats.streak}</div>
            <div className="text-xs text-slate-500">Day Streak</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className={`border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          {getIcon()}
          <div className="flex-1">
            <CardTitle className="text-lg">Share Your Progress</CardTitle>
            <CardDescription>
              Celebrate your achievement and inspire others to learn!
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Learn in Public
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="text-sm font-medium text-slate-900 dark:text-white mb-2">
            Preview:
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">
            {getShareText()}
          </div>
        </div>

        {/* Stats Display */}
        {getStatsDisplay()}

        {/* Share Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("twitter")}
            className="flex items-center gap-2"
          >
            <Twitter className="w-4 h-4 text-blue-400" />
            Twitter
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("linkedin")}
            className="flex items-center gap-2"
          >
            <Linkedin className="w-4 h-4 text-blue-600" />
            LinkedIn
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("facebook")}
            className="flex items-center gap-2"
          >
            <Facebook className="w-4 h-4 text-blue-700" />
            Facebook
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("copy")}
            className="flex items-center gap-2"
          >
            {copied ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>

        {/* Learn in Public Benefits */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Why share your progress?</strong>
            <ul className="mt-2 space-y-1 text-xs">
              <li>• Build accountability and stay motivated</li>
              <li>• Connect with other learners</li>
              <li>• Document your learning journey</li>
              <li>• Inspire others to start learning</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 