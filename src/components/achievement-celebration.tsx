"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Star, 
  X, 
  Share2
} from "lucide-react"
import { SocialShare } from "./social-share"
import type { Milestone } from "@/lib/learning-streak"

interface AchievementCelebrationProps {
  achievement: Milestone
  stats: {
    currentStreak?: number
    totalLessons?: number
    totalCourses?: number
    totalStudyTime?: number
  }
  onClose?: () => void
  onShare?: (platform: string) => void
}

/**
 * Achievement celebration component that appears when users earn new milestones
 * Encourages "learn in public" by making sharing seamless and rewarding
 */
export function AchievementCelebration({
  achievement,
  stats,
  onClose,
  onShare
}: AchievementCelebrationProps) {
  const [showShare, setShowShare] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  // Auto-hide after 10 seconds if user doesn't interact
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!showShare) {
        setIsVisible(false)
        onClose?.()
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [showShare, onClose])

  if (!isVisible) return null

  const getAchievementIcon = () => {
    return <span className="text-4xl">{achievement.icon}</span>
  }

  const getAchievementColor = () => {
    switch (achievement.type) {
      case "streak":
        return "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20"
      case "lessons":
        return "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20"
      case "courses":
        return "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
      case "study-time":
        return "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20"
      default:
        return "from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20"
    }
  }

  const getAchievementStats = () => {
    switch (achievement.type) {
      case "streak":
        return { streak: stats.currentStreak }
      case "lessons":
        return { lessonsCompleted: stats.totalLessons }
      case "courses":
        return { achievements: stats.totalCourses }
      case "study-time":
        return { studyTime: stats.totalStudyTime }
      default:
        return {}
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className={`w-full max-w-md border-0 shadow-2xl bg-gradient-to-br ${getAchievementColor()}`}>
        <CardHeader className="text-center pb-4">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsVisible(false)
                onClose?.()
              }}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              {getAchievementIcon()}
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
            Achievement Unlocked! 🎉
          </CardTitle>
          
          <CardDescription className="text-lg">
            {achievement.title}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Achievement Details */}
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {achievement.description}
            </p>
            
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
              <Star className="w-3 h-3 mr-1" />
              New Achievement
            </Badge>
          </div>

          {/* Stats Display */}
          <div className="grid grid-cols-2 gap-4">
            {stats.currentStreak !== undefined && (
              <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats.currentStreak}</div>
                <div className="text-sm text-slate-500">Day Streak</div>
              </div>
            )}
            {stats.totalLessons !== undefined && (
              <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.totalLessons}</div>
                <div className="text-sm text-slate-500">Lessons</div>
              </div>
            )}
            {stats.totalCourses !== undefined && (
              <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.totalCourses}</div>
                <div className="text-sm text-slate-500">Courses</div>
              </div>
            )}
            {stats.totalStudyTime !== undefined && (
              <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.totalStudyTime}h</div>
                <div className="text-sm text-slate-500">Study Time</div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!showShare ? (
              <Button 
                onClick={() => setShowShare(true)}
                className="w-full"
                size="lg"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Your Achievement
              </Button>
            ) : (
              <SocialShare
                type="achievement-earned"
                title={`Achieved: ${achievement.title}`}
                description={achievement.description}
                stats={getAchievementStats()}
                achievementName={achievement.title}
                onShare={onShare}
              />
            )}
            
            <Button 
              variant="outline" 
              onClick={() => {
                setIsVisible(false)
                onClose?.()
              }}
              className="w-full"
            >
              Continue Learning
            </Button>
          </div>

          {/* Learn in Public Motivation */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <strong>💡 Pro Tip:</strong> Sharing your progress publicly helps you stay accountable and inspires others to start their learning journey!
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 