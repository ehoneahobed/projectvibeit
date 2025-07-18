"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Trophy, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
  explanation?: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: QuizOption[]
}

export interface QuizData {
  id: string
  title: string
  description: string
  questions: QuizQuestion[]
}

interface QuizAnswer {
  questionId: string
  selectedOptionId: string
  isCorrect: boolean
}

export interface QuizResult {
  score: number
  totalQuestions: number
  percentage: number
  answers: QuizAnswer[]
  completedAt: string
}

interface LessonQuizProps {
  quizData: QuizData
  lessonId?: string
  showResults?: boolean
  allowRetry?: boolean
  onComplete?: (result: QuizResult) => void
}

export function LessonQuiz({ 
  quizData,
  lessonId,
  showResults = true,
  allowRetry = true,
  onComplete
}: LessonQuizProps) {
  const { data: session } = useSession()
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)

  const isQuizDataInvalid = !quizData || !quizData.questions
  if (isQuizDataInvalid) {
    return (
      <div className="p-4 text-center text-red-500">
        Error: Quiz data is missing or invalid.
      </div>
    )
  }

  const totalQuestions = quizData.questions.length

  const handleOptionSelect = (questionId: string, optionId: string) => {
    if (isSubmitted) return // Don't allow changes after submission
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }))
  }

  const calculateScore = (): QuizResult => {
    let correctAnswersCount = 0
    const answers: QuizAnswer[] = []

    quizData.questions.forEach((question) => {
      const selectedOptionId = selectedAnswers[question.id]
      const selectedOption = question.options.find(opt => opt.id === selectedOptionId)
      const isCorrect = selectedOption?.isCorrect || false
      
      if (isCorrect) correctAnswersCount++
      
      answers.push({
        questionId: question.id,
        selectedOptionId: selectedOptionId || "",
        isCorrect
      })
    })

    const score = correctAnswersCount
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0

    return {
      score,
      totalQuestions,
      percentage,
      answers,
      completedAt: new Date().toISOString()
    }
  }

  const handleSubmit = async () => {
    if (totalQuestions === 0) return
    
    setIsSubmitting(true)
    
    try {
      const result = calculateScore()
      setQuizResult(result)
      setIsSubmitted(true)

      // Save to database if user is logged in and lessonId is provided
      if (session?.user && lessonId) {
        await saveQuizResult(result)
      }

      if (onComplete) {
        onComplete(result)
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const saveQuizResult = async (result: QuizResult) => {
    try {
      const response = await fetch('/api/progress/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          quizResult: result
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save quiz result')
      }
    } catch (error) {
      console.error('Error saving quiz result:', error)
      // Don't throw - we still want to show the results even if saving fails
    }
  }

  const handleRetry = () => {
    setIsSubmitted(false)
    setSelectedAnswers({})
    setQuizResult(null)
  }

  const canSubmit = totalQuestions > 0 && Object.keys(selectedAnswers).length === totalQuestions

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return "Excellent! You've mastered this material."
    if (percentage >= 80) return "Great job! You have a solid understanding."
    if (percentage >= 70) return "Good work! You understand the key concepts."
    if (percentage >= 60) return "Not bad! Review the material and try again."
    return "Keep studying! Review the lesson content and try again."
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 dark:text-green-400"
    if (percentage >= 80) return "text-blue-600 dark:text-blue-400"
    if (percentage >= 70) return "text-yellow-600 dark:text-yellow-400"
    if (percentage >= 60) return "text-orange-600 dark:text-orange-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <Card className="border-2 border-primary/20 bg-primary/5 dark:bg-primary/10">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">{quizData.title}</CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            Quiz
          </Badge>
        </div>
        <CardDescription>{quizData.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Questions */}
        <div className="space-y-6">
          {quizData.questions.map((question, index) => (
            <QuizQuestion
              key={question.id}
              question={question}
              questionIndex={index}
              onOptionSelect={handleOptionSelect}
              selectedAnswer={selectedAnswers[question.id]}
              showCorrectAnswer={isSubmitted}
            />
          ))}
        </div>

        {/* Submit Button */}
        {!isSubmitted && (
          <Button 
            onClick={handleSubmit} 
            disabled={!canSubmit || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        )}

        {/* Results */}
        {isSubmitted && showResults && quizResult && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                {quizResult.percentage >= 70 ? (
                  <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                )}
                <span className={cn("text-lg font-semibold", getScoreColor(quizResult.percentage))}>
                  {quizResult.score}/{quizResult.totalQuestions} correct ({quizResult.percentage}%)
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {getScoreMessage(quizResult.percentage)}
              </p>
            </div>

            {allowRetry && (
              <Button 
                onClick={handleRetry} 
                variant="outline" 
                className="w-full"
              >
                Try Again
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Individual question component
interface QuizQuestionProps {
  question: QuizQuestion
  questionIndex: number
  onOptionSelect: (questionId: string, optionId: string) => void
  selectedAnswer?: string
  showCorrectAnswer?: boolean
}

function QuizQuestion({ 
  question, 
  questionIndex,
  onOptionSelect,
  selectedAnswer = "",
  showCorrectAnswer = false
}: QuizQuestionProps) {
  const handleOptionClick = (optionId: string) => {
    onOptionSelect(question.id, optionId)
  }

  return (
    <fieldset className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
          {questionIndex + 1}
        </div>
        <div className="flex-1">
          <legend className="font-medium text-foreground mb-3 text-left">
            {question.question}
          </legend>
          <div className="space-y-2" role="radiogroup">
            {question.options.map((option) => {
              const isSelected = selectedAnswer === option.id
              
              return (
                <div 
                  key={option.id}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-sm",
                    !showCorrectAnswer
                      ? isSelected 
                        ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm" 
                        : "border-border hover:border-primary/50 hover:bg-accent/50"
                      : option.isCorrect
                        ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                        : isSelected && !option.isCorrect
                          ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                          : "border-border"
                  )}
                  onClick={() => handleOptionClick(option.id)}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleOptionClick(option.id)
                    }
                  }}
                >
                  <div className="flex items-center gap-4">
                    {!showCorrectAnswer ? (
                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-primary border-2 border-primary flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-border hover:border-primary/50 transition-colors" />
                        )}
                      </div>
                    ) : (
                      <div className="flex-shrink-0">
                        {option.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : isSelected && !option.isCorrect ? (
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-border" />
                        )}
                      </div>
                    )}
                    <span className="flex-1 text-sm leading-relaxed">{option.text}</span>
                    {showCorrectAnswer && option.isCorrect && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                        Correct
                      </Badge>
                    )}
                  </div>
                  {option.explanation && showCorrectAnswer && (
                    <div className="mt-3 ml-9 text-sm text-muted-foreground">
                      {option.explanation}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </fieldset>
  )
}

// Legacy components for backward compatibility with existing MDX content
interface LegacyQuizQuestionProps {
  children?: React.ReactNode
  question: string
  questionId?: string
  onOptionSelect?: (questionId: string, optionText: string) => void
  selectedAnswer?: string
  showCorrectAnswer?: boolean
}

export function LegacyQuizQuestion({ children: _children }: LegacyQuizQuestionProps) {
  // This component is kept for backward compatibility but doesn't render anything
  // The actual quiz functionality is now handled by the data-driven approach
  return null
}

interface LegacyQuizOptionProps {
  children?: React.ReactNode
  isCorrect?: boolean
  explanation?: string
}

export function LegacyQuizOption({ children: _children }: LegacyQuizOptionProps) {
  // This component is kept for backward compatibility but doesn't render anything
  // The actual quiz functionality is now handled by the data-driven approach
  return null
} 