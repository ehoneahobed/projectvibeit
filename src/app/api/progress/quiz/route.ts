import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models'

interface QuizResult {
  score: number
  totalQuestions: number
  percentage: number
  answers: Array<{
    questionId: string
    selectedOption: string
    isCorrect: boolean
  }>
  completedAt: string
}

interface RequestBody {
  lessonId: string
  quizResult: QuizResult
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: RequestBody = await request.json()
    const { lessonId, quizResult } = body

    if (!lessonId || !quizResult) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await connectDB()

    // Find the user and update their progress
    const user = await User.findById(session.user.id)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Initialize progress if it doesn't exist
    if (!user.progress) {
      user.progress = {}
    }

    // Initialize lesson progress if it doesn't exist
    if (!user.progress[lessonId]) {
      user.progress[lessonId] = {
        completed: false,
        completedAt: null,
        quizResults: []
      }
    }

    // Add the quiz result
    user.progress[lessonId].quizResults.push({
      score: quizResult.score,
      totalQuestions: quizResult.totalQuestions,
      percentage: quizResult.percentage,
      completedAt: new Date(quizResult.completedAt),
      answers: quizResult.answers
    })

    // Mark lesson as completed if quiz score is 70% or higher
    if (quizResult.percentage >= 70 && !user.progress[lessonId].completed) {
      user.progress[lessonId].completed = true
      user.progress[lessonId].completedAt = new Date()
    }

    await user.save()

    return NextResponse.json({
      success: true,
      data: {
        lessonId,
        quizResult: user.progress[lessonId].quizResults[user.progress[lessonId].quizResults.length - 1]
      }
    })

  } catch (error) {
    console.error('Error saving quiz result:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 