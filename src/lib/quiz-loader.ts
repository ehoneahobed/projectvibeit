import fs from 'fs'
import path from 'path'
import type { QuizData } from '@/components/lesson-quiz'

/**
 * Load quiz data from a JSON file in the content directory (Server-side only)
 */
export function getQuizData(courseSlug: string, moduleSlug: string, lessonSlug: string): QuizData | null {
  try {
    const quizFilePath = path.join(
      process.cwd(),
      'content',
      'courses',
      courseSlug,
      'modules',
      moduleSlug,
      'lessons',
      `${lessonSlug}.quiz.json`
    )

    if (!fs.existsSync(quizFilePath)) {
      return null
    }

    const quizFileContent = fs.readFileSync(quizFilePath, 'utf-8')
    const quizData = JSON.parse(quizFileContent) as QuizData

    // Validate the quiz data structure
    if (!quizData.id || !quizData.title || !quizData.questions || !Array.isArray(quizData.questions)) {
      console.warn(`Invalid quiz data structure in ${quizFilePath}`)
      return null
    }

    return quizData
  } catch (error) {
    console.error(`Error loading quiz data for ${courseSlug}/${moduleSlug}/${lessonSlug}:`, error)
    return null
  }
}

/**
 * Get all quiz files for a course (Server-side only)
 */
export function getAllQuizFiles(courseSlug: string): Array<{
  courseSlug: string
  moduleSlug: string
  lessonSlug: string
  quizData: QuizData
}> {
  const quizzes: Array<{
    courseSlug: string
    moduleSlug: string
    lessonSlug: string
    quizData: QuizData
  }> = []

  try {
    const coursePath = path.join(process.cwd(), 'content', 'courses', courseSlug)
    if (!fs.existsSync(coursePath)) {
      return quizzes
    }

    const modules = fs.readdirSync(coursePath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name === 'modules')
      .map(dirent => dirent.name)

    if (modules.length === 0) {
      return quizzes
    }

    const modulesPath = path.join(coursePath, 'modules')
    const moduleDirs = fs.readdirSync(modulesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    for (const moduleSlug of moduleDirs) {
      const lessonsPath = path.join(modulesPath, moduleSlug, 'lessons')
      
      if (!fs.existsSync(lessonsPath)) {
        continue
      }

      const lessonFiles = fs.readdirSync(lessonsPath, { withFileTypes: true })
        .filter(dirent => dirent.isFile() && dirent.name.endsWith('.quiz.json'))
        .map(dirent => dirent.name.replace('.quiz.json', ''))

      for (const lessonSlug of lessonFiles) {
        const quizData = getQuizData(courseSlug, moduleSlug, lessonSlug)
        if (quizData) {
          quizzes.push({
            courseSlug,
            moduleSlug,
            lessonSlug,
            quizData
          })
        }
      }
    }
  } catch (error) {
    console.error(`Error loading all quiz files for course ${courseSlug}:`, error)
  }

  return quizzes
}

/**
 * Check if a quiz exists for a specific lesson (Server-side only)
 */
export function quizExists(courseSlug: string, moduleSlug: string, lessonSlug: string): boolean {
  const quizData = getQuizData(courseSlug, moduleSlug, lessonSlug)
  return quizData !== null
} 