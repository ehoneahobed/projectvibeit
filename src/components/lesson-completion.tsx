"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Trophy, Star, X, Share2, Twitter, Linkedin, Facebook, Copy } from "lucide-react"
import Link from "next/link"
import { completeLesson } from "@/lib/progress-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { calculateLearningStreak, checkNewMilestones } from "@/lib/learning-streak"
import { getUserProgress, getUserUsername } from "@/lib/progress-actions"


interface LessonCompletionProps {
  courseSlug: string
  moduleSlug: string
  lessonId: string
  lessonTitle: string
  isCompleted: boolean
  previousLesson?: {
    slug: string
    title: string
    moduleSlug?: string
  } | null
  nextLesson?: {
    slug: string
    title: string
    moduleSlug?: string
  } | null
  moduleTitle: string
  courseTitle: string
  onComplete?: () => void
}

/**
 * Lesson completion component that shows celebration overlay after completion
 */
export function LessonCompletion({
  courseSlug,
  moduleSlug,
  lessonId,
  lessonTitle,
  isCompleted,
  previousLesson,
  nextLesson,
  moduleTitle,
  courseTitle,
  onComplete,
}: LessonCompletionProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const [localCompleted, setLocalCompleted] = useState(isCompleted)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationData, setCelebrationData] = useState<{
    totalLessons: number
    totalStudyTime: number
    learningStreak: {
      currentStreak: number
      milestones: Array<{
        id: string
        title: string
        description: string
        icon: string
        achieved: boolean
      }>
    }
    newMilestones: Array<{
      id: string
      title: string
      description: string
      icon: string
      achieved: boolean
    }>
  } | null>(null)
  const [userProfileUrl, setUserProfileUrl] = useState<string>("")

  const router = useRouter()
  const completionGuardRef = useRef(false)

  // Update local state when prop changes
  if (isCompleted !== localCompleted && !isCompleting) {
    setLocalCompleted(isCompleted)
  }

  // Add Escape key and backdrop close
  useEffect(() => {
    if (!showCelebration) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setShowCelebration(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showCelebration])

  // Get user profile URL on component mount
  useEffect(() => {
    async function getUserProfileUrl() {
      try {
        const usernameResult = await getUserUsername()
        if (usernameResult.success && usernameResult.data) {
          setUserProfileUrl(`${window.location.origin}/profile/${usernameResult.data}`)
        } else {
          // Fallback to a generic profile URL
          setUserProfileUrl(`${window.location.origin}/profile/learner`)
        }
      } catch (error) {
        console.error('Error getting user profile URL:', error)
        setUserProfileUrl(`${window.location.origin}/profile/learner`)
      }
    }
    getUserProfileUrl()
  }, [])

  // Use useCallback to prevent infinite re-renders
  const handleCompleteLesson = useCallback(async () => {
    if (localCompleted || isCompleting || completionGuardRef.current) return

    completionGuardRef.current = true
    setIsCompleting(true)
    
    try {
      const result = await completeLesson(courseSlug, moduleSlug, lessonId)
      
      if (result.success) {
        setLocalCompleted(true)
        toast.success("Lesson completed! Great job! 🎉")
        
        // Get user progress for celebration data
        const progressResult = await getUserProgress()
        const userProgress = progressResult.success ? progressResult.data || [] : []
        
        // Debug: Log the progress data being used for streak calculation
        // if (typeof window !== 'undefined') {
        //   console.log('[Lesson Completion Debug] Progress result:', progressResult)
        //   console.log('[Lesson Completion Debug] User progress for streak:', userProgress)
        // }
        
        // Calculate learning statistics
        const totalLessons = userProgress.reduce((acc, p) => acc + (p.completedLessons?.length || 0), 0)
        const totalStudyTime = Math.round(totalLessons * 0.5)
        const learningStreak = calculateLearningStreak(userProgress)
        const newMilestones = checkNewMilestones([], learningStreak.milestones)
        
        setCelebrationData({
          totalLessons,
          totalStudyTime,
          learningStreak,
          newMilestones
        })
        
        // Show celebration overlay
        setShowCelebration(true)
        
        // Dispatch custom event to notify navigation to refresh progress
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('lesson-completed'))
        }, 100)
        
        // Call the onComplete callback to update parent state
        if (onComplete) {
          setTimeout(() => {
            onComplete()
          }, 200)
        }
      } else {
        toast.error("Failed to complete lesson. Please try again.")
      }
    } catch (error) {
      console.error("Error completing lesson:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsCompleting(false)
      // Reset the guard after a delay to prevent rapid re-clicks
      setTimeout(() => {
        completionGuardRef.current = false
      }, 1000)
    }
  }, [localCompleted, isCompleting, courseSlug, moduleSlug, lessonId, onComplete])

  const handleContinueToNext = () => {
    setShowCelebration(false)
    if (nextLesson) {
      router.push(`/courses/${courseSlug}/${nextLesson.moduleSlug || moduleSlug}/${nextLesson.slug}`)
    }
  }

  const handleCloseCelebration = () => {
    setShowCelebration(false)
  }

  const getCompletionMessage = () => {
    if (localCompleted) {
      return "You've completed this lesson! 🎉"
    }
    return "Mark this lesson as complete to continue your progress"
  }

  const getNextActionText = () => {
    if (localCompleted && nextLesson) {
      return `Continue to: ${nextLesson.title}`
    }
    if (localCompleted && !nextLesson) {
      return "You've completed this course! 🎉"
    }
    return "Complete this lesson to continue"
  }

  return (
    <>
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20" data-completion-component>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {localCompleted ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <Circle className="w-6 h-6 text-slate-400" />
            )}
            Lesson Progress
          </CardTitle>
          <CardDescription>
            {getCompletionMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Lesson Info */}
          <div className="space-y-2">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {courseTitle} • {moduleTitle}
            </div>
            <div className="font-medium text-slate-900 dark:text-white">
              {lessonTitle}
            </div>
          </div>

          {/* Completion Status */}
          <div className={`p-4 rounded-lg border ${
            localCompleted 
              ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
          }`}>
            <div className="flex items-center gap-3">
              {localCompleted ? (
                <Trophy className="w-5 h-5 text-green-500" />
              ) : (
                <Star className="w-5 h-5 text-slate-400" />
              )}
              <div className="flex-1">
                <div className={`font-medium ${
                  localCompleted 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {localCompleted ? 'Lesson Completed' : 'Lesson In Progress'}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {getNextActionText()}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {previousLesson ? (
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/courses/${courseSlug}/${previousLesson.moduleSlug || moduleSlug}/${previousLesson.slug}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/courses/${courseSlug}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Course
                </Link>
              </Button>
            )}
            
            {!localCompleted ? (
              <Button 
                onClick={handleCompleteLesson}
                disabled={isCompleting}
                className="flex-1"
              >
                {isCompleting ? (
                  "Completing..."
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Complete
                  </>
                )}
              </Button>
            ) : nextLesson ? (
              <Button asChild className="flex-1">
                <Link href={`/courses/${courseSlug}/${nextLesson.moduleSlug || moduleSlug}/${nextLesson.slug}`}>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            ) : (
              <Button asChild className="flex-1">
                <Link href={`/courses/${courseSlug}/congratulations`}>
                  <Trophy className="w-4 h-4 mr-2" />
                  View Certificate
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>

          {/* Progress Indicator */}
          {localCompleted && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm">
                <CheckCircle className="w-4 h-4" />
                Progress Saved
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Celebration Overlay */}
      {showCelebration && celebrationData && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseCelebration}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[60vh] overflow-y-auto relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-700 rounded-t-2xl z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseCelebration}
                className="absolute top-2 right-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                aria-label="Close celebration overlay"
              >
                <X className="w-5 h-5" />
              </Button>
              
              <div className="text-center pr-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mb-2 animate-bounce">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  Lesson Completed! 🎉
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {lessonTitle}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Achievement Celebration */}
              {celebrationData.newMilestones.length > 0 && (
                <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                      🏆 New Achievement Unlocked!
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {celebrationData.newMilestones[0].title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-xl mb-1">{celebrationData.newMilestones[0].icon}</div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {celebrationData.newMilestones[0].description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Progress Stats */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-sm">Your Learning Progress</CardTitle>
                  <CardDescription className="text-xs">
                    Keep up the great work! Here&apos;s your current progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {celebrationData.totalLessons}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        Lessons Completed
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {celebrationData.learningStreak.currentStreak}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        Day Streak
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Share - Compact Version */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-blue-600" />
                    Share Your Progress
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Celebrate your achievement and inspire others to learn!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Share Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const text = `🎉 Just completed "${lessonTitle}" in ${courseTitle}! 📚\n\nEvery step forward counts in the learning journey. #VibeCoding #LearnInPublic`
                        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(userProfileUrl)}&hashtags=VibeCoding,LearnInPublic`
                        window.open(twitterUrl, "_blank")
                      }}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Twitter className="w-3 h-3 text-blue-400" />
                      Twitter
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const text = `🎉 Just completed "${lessonTitle}" in ${courseTitle}! 📚\n\nEvery step forward counts in the learning journey. #VibeCoding #LearnInPublic`
                        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(userProfileUrl)}&title=${encodeURIComponent("Lesson Completed!")}&summary=${encodeURIComponent(text)}`
                        window.open(linkedinUrl, "_blank")
                      }}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Linkedin className="w-3 h-3 text-blue-600" />
                      LinkedIn
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const text = `🎉 Just completed "${lessonTitle}" in ${courseTitle}! 📚\n\nEvery step forward counts in the learning journey. #VibeCoding #LearnInPublic`
                        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(userProfileUrl)}&quote=${encodeURIComponent(text)}`
                        window.open(facebookUrl, "_blank")
                      }}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Facebook className="w-3 h-3 text-blue-700" />
                      Facebook
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        const text = `🎉 Just completed "${lessonTitle}" in ${courseTitle}! 📚\n\nEvery step forward counts in the learning journey. #VibeCoding #LearnInPublic\n\n${userProfileUrl}`
                        try {
                          await navigator.clipboard.writeText(text)
                          toast.success("Copied to clipboard!")
                        } catch (_error) {
                          toast.error("Failed to copy. Please try again.")
                        }
                      }}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  onClick={handleCloseCelebration}
                  className="flex-1 border-2 border-blue-400 text-blue-700 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/30 text-sm"
                  aria-label="Stay on this lesson"
                >
                  Stay Here
                </Button>
                
                {nextLesson ? (
                  <Button
                    onClick={handleContinueToNext}
                    className="flex-1 text-sm"
                  >
                    Continue to Next Lesson
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button asChild className="flex-1 text-sm">
                    <Link href={`/courses/${courseSlug}/congratulations`}>
                      <Trophy className="w-4 h-4 mr-2" />
                      View Certificate
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}