"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { DiscussionSection } from "@/components/discussions/discussion-section"
import { LessonCompletion } from "@/components/lesson-completion"
import { FloatingCompletionButton } from "@/components/floating-completion-button"


interface LessonPageClientProps {
  courseSlug: string
  moduleSlug: string
  lessonSlug: string
  lessonId: string
  lessonTitle: string
  isCompleted: boolean
  previousLesson: { slug: string; title: string; moduleSlug: string } | null
  nextLesson: { slug: string; title: string; moduleSlug: string } | null
  moduleTitle: string
  courseTitle: string
  showAskQuestionButton?: boolean

}

export function LessonPageClient({
  courseSlug,
  moduleSlug,
  lessonSlug,
  lessonId,
  lessonTitle,
  isCompleted,
  previousLesson,
  nextLesson,
  moduleTitle,
  courseTitle,
  showAskQuestionButton = false
}: LessonPageClientProps) {
  return (
    <>
      {/* Ask Question Button */}
      {showAskQuestionButton && (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="hover:bg-accent"
            onClick={() => {
              const discussionSection = document.getElementById('discussion-section')
              if (discussionSection) {
                discussionSection.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Ask Question
          </Button>
        </div>
      )}

      {/* Discussion Section */}
      <div id="discussion-section">
        <DiscussionSection
          courseSlug={courseSlug}
          moduleSlug={moduleSlug}
          lessonSlug={lessonSlug}
          lessonId={lessonId}
        />
      </div>

      {/* Lesson Completion */}
      <div className="mt-8">
        <LessonCompletion
          courseSlug={courseSlug}
          moduleSlug={moduleSlug}
          lessonId={lessonId}
          lessonTitle={lessonTitle}
          isCompleted={isCompleted}
          previousLesson={previousLesson}
          nextLesson={nextLesson}
          moduleTitle={moduleTitle}
          courseTitle={courseTitle}

        />
      </div>

      {/* Floating Action Button for Quick Completion */}
      <FloatingCompletionButton
        courseSlug={courseSlug}
        moduleSlug={moduleSlug}
        lessonId={lessonId}
        isCompleted={isCompleted}
        nextLesson={nextLesson}
      />
    </>
  )
} 