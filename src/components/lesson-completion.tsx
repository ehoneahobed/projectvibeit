"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Trophy, Star } from "lucide-react"
import Link from "next/link"
import { completeLesson } from "@/lib/progress-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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
 * Lesson completion component that allows users to mark lessons as complete
 * and navigate between lessons, similar to The Odin Project
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
  onComplete
}: LessonCompletionProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const [localCompleted, setLocalCompleted] = useState(isCompleted)
  const router = useRouter()

  // Update local state when prop changes
  if (isCompleted !== localCompleted && !isCompleting) {
    setLocalCompleted(isCompleted)
  }

  // Use useCallback to prevent infinite re-renders
  const handleCompleteLesson = useCallback(async () => {
    if (localCompleted || isCompleting) return

    setIsCompleting(true)
    
    try {
      const result = await completeLesson(courseSlug, moduleSlug, lessonId)
      
      if (result.success) {
        setLocalCompleted(true)
        toast.success("Lesson completed! Great job! 🎉")
        
        // Dispatch custom event to notify navigation to refresh progress
        window.dispatchEvent(new CustomEvent('lesson-completed'))
        
        // Call the onComplete callback to update parent state
        if (onComplete) {
          onComplete()
        }
        
        // Auto-navigate to next lesson after a short delay
        if (nextLesson) {
          setTimeout(() => {
            const nextModuleSlug = nextLesson.moduleSlug || moduleSlug
            router.push(`/courses/${courseSlug}/${nextModuleSlug}/${nextLesson.slug}`)
          }, 1500)
        }
      } else {
        toast.error("Failed to complete lesson. Please try again.")
      }
    } catch (error) {
      console.error("Error completing lesson:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsCompleting(false)
    }
  }, [localCompleted, isCompleting, courseSlug, moduleSlug, lessonId, nextLesson, router, onComplete])

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
      return "You've completed this module!"
    }
    return "Complete this lesson to continue"
  }

  return (
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
          {previousLesson && (
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/courses/${courseSlug}/${previousLesson.moduleSlug || moduleSlug}/${previousLesson.slug}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
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
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/courses/${courseSlug}`}>
                Back to Course
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
  )
} 