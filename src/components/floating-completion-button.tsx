"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"
import { completeLesson } from "@/lib/progress-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface FloatingCompletionButtonProps {
  courseSlug: string
  moduleSlug: string
  lessonId: string
  isCompleted: boolean
  nextLesson?: {
    slug: string
    title: string
    moduleSlug?: string
  } | null
  onComplete?: () => void
}

/**
 * Floating action button for quick lesson completion
 */
export function FloatingCompletionButton({
  courseSlug,
  moduleSlug,
  lessonId,
  isCompleted,
  nextLesson,
  onComplete
}: FloatingCompletionButtonProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const router = useRouter()

  const handleComplete = useCallback(async () => {
    if (isCompleted || isCompleting) return

    setIsCompleting(true)
    
    try {
      const result = await completeLesson(courseSlug, moduleSlug, lessonId)
      
      if (result.success) {
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
  }, [isCompleted, isCompleting, courseSlug, moduleSlug, lessonId, nextLesson, router, onComplete])

  if (isCompleted) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        size="lg"
        className="rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white h-14 w-14 p-0"
        onClick={handleComplete}
        disabled={isCompleting}
      >
        {isCompleting ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <CheckCircle className="w-6 h-6" />
        )}
      </Button>
      <div className="absolute -top-2 -right-2 bg-white dark:bg-slate-800 text-xs px-2 py-1 rounded-full shadow-md border border-slate-200 dark:border-slate-700 whitespace-nowrap">
        Mark Complete
      </div>
    </div>
  )
} 