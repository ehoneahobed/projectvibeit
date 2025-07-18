import type { QuizData } from '@/components/lesson-quiz'

/**
 * Converts existing MDX quiz content to the new data-driven format
 * This is a helper function to migrate existing quiz content
 */
export function createQuizData(
  id: string,
  title: string,
  description: string,
  questions: Array<{
    question: string
    options: Array<{
      text: string
      isCorrect: boolean
      explanation?: string
    }>
  }>
): QuizData {
  return {
    id,
    title,
    description,
    questions: questions.map((q, index) => ({
      id: `question-${index}`,
      question: q.question,
      options: q.options.map((opt, optIndex) => ({
        id: `question-${index}-option-${optIndex}`,
        text: opt.text,
        isCorrect: opt.isCorrect,
        explanation: opt.explanation
      }))
    }))
  }
}

/**
 * Example quiz data for the "What is Vibe Coding?" lesson
 */
export const vibeCodingQuizData: QuizData = {
  id: "fundamentals-of-vibe-coding-introduction-to-vibe-coding-what-is-vibe-coding",
  title: "What is Vibe Coding?",
  description: "Test your understanding of the key concepts from this lesson.",
  questions: [
    {
      id: "question-0",
      question: "What is the primary focus of Vibe Coding?",
      options: [
        {
          id: "question-0-option-0",
          text: "Writing perfect, optimized code",
          isCorrect: false
        },
        {
          id: "question-0-option-1",
          text: "Memorizing programming syntax",
          isCorrect: false
        },
        {
          id: "question-0-option-2",
          text: "Focusing on outcomes and solving problems",
          isCorrect: true
        },
        {
          id: "question-0-option-3",
          text: "Replacing human developers with AI",
          isCorrect: false
        }
      ]
    },
    {
      id: "question-1",
      question: "In the Vibe Coding model, what does the human primarily contribute?",
      options: [
        {
          id: "question-1-option-0",
          text: "Speed and automation",
          isCorrect: false
        },
        {
          id: "question-1-option-1",
          text: "Creativity, vision, and problem-solving",
          isCorrect: true
        },
        {
          id: "question-1-option-2",
          text: "Technical implementation details",
          isCorrect: false
        },
        {
          id: "question-1-option-3",
          text: "Code optimization and debugging",
          isCorrect: false
        }
      ]
    },
    {
      id: "question-2",
      question: "Which of the following is NOT a core principle of Vibe Coding?",
      options: [
        {
          id: "question-2-option-0",
          text: "Human-AI partnership",
          isCorrect: false
        },
        {
          id: "question-2-option-1",
          text: "Intuition-driven development",
          isCorrect: false
        },
        {
          id: "question-2-option-2",
          text: "Focus on outcomes",
          isCorrect: false
        },
        {
          id: "question-2-option-3",
          text: "Complete automation without human input",
          isCorrect: true
        }
      ]
    },
    {
      id: "question-3",
      question: "What analogy is used to describe traditional coding vs. AI-assisted development?",
      options: [
        {
          id: "question-3-option-0",
          text: "Building a house with power tools vs. building by hand",
          isCorrect: false
        },
        {
          id: "question-3-option-1",
          text: "Building a house brick by brick vs. using advanced power tools and a construction crew",
          isCorrect: true
        },
        {
          id: "question-3-option-2",
          text: "Cooking with a recipe vs. cooking without instructions",
          isCorrect: false
        },
        {
          id: "question-3-option-3",
          text: "Driving a car vs. taking public transportation",
          isCorrect: false
        }
      ]
    },
    {
      id: "question-4",
      question: "What is the main goal of Vibe Coding?",
      options: [
        {
          id: "question-4-option-0",
          text: "To write the most efficient code possible",
          isCorrect: false
        },
        {
          id: "question-4-option-1",
          text: "To eliminate the need for human developers",
          isCorrect: false
        },
        {
          id: "question-4-option-2",
          text: "To create solutions that work, solve problems, and deliver value",
          isCorrect: true
        },
        {
          id: "question-4-option-3",
          text: "To make programming accessible only to experts",
          isCorrect: false
        }
      ]
    },
    {
      id: "question-5",
      question: "Which skill is NOT mentioned as essential for Vibe Coding?",
      options: [
        {
          id: "question-5-option-0",
          text: "Communication skills",
          isCorrect: false
        },
        {
          id: "question-5-option-1",
          text: "Critical thinking",
          isCorrect: false
        },
        {
          id: "question-5-option-2",
          text: "Problem decomposition",
          isCorrect: false
        },
        {
          id: "question-5-option-3",
          text: "Advanced mathematical knowledge",
          isCorrect: true
        }
      ]
    }
  ]
} 