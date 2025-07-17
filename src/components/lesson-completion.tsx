"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle } from "lucide-react"
import { completeLesson, uncompleteLesson } from "@/lib/progress-actions"
import { toast } from "sonner"

interface LessonCompletionProps {
  courseId: string
  moduleId: string
  lessonId: string
  isCompleted: boolean
  onToggle?: (completed: boolean) => void
}

export function LessonCompletion({
  courseId,
  moduleId,
  lessonId,
  isCompleted: initialIsCompleted,
  onToggle
}: LessonCompletionProps) {
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    
    try {
      const result = isCompleted 
        ? await uncompleteLesson(courseId, moduleId, lessonId)
        : await completeLesson(courseId, moduleId, lessonId)

      if (result.success) {
        setIsCompleted(!isCompleted)
        onToggle?.(!isCompleted)
        toast.success(
          isCompleted 
            ? "Lesson marked as incomplete" 
            : "Lesson completed! Great job!"
        )
      } else {
        toast.error(result.error || "Failed to update progress")
      }
    } catch (error) {
      console.error("Error updating lesson completion:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleToggle}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 transition-all ${
        isCompleted 
          ? "border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950" 
          : "hover:bg-slate-50 dark:hover:bg-slate-800"
      }`}
    >
      {isCompleted ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <Circle className="w-4 h-4" />
      )}
      {isCompleted ? "Completed" : "Mark as Complete"}
    </Button>
  )
} 