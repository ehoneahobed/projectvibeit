"use client"

import { LessonQuiz } from './lesson-quiz'
import type { QuizResult, QuizData } from './lesson-quiz'

interface LessonQuizSectionProps {
  quizData: QuizData | null
  lessonSlug: string
  onComplete?: (result: QuizResult) => void
}

export function LessonQuizSection({ 
  quizData, 
  lessonSlug, 
  onComplete 
}: LessonQuizSectionProps) {
  if (!quizData) {
    if (typeof window !== 'undefined') {
      // Log for debugging in browser
      console.warn(`No quiz data provided for lesson: ${lessonSlug}`)
    }
    return (
      <div className="p-4 text-center text-muted-foreground">
        No quiz available for this lesson.<br />
        <span className="text-xs">
          To add a quiz, create: <code>{lessonSlug}.quiz.json</code> in the lesson directory
        </span>
      </div>
    )
  }

  return (
    <LessonQuiz
      quizData={quizData}
      lessonId={quizData.id}
      onComplete={onComplete}
    />
  )
} 