# MDX Components Quick Reference

## Learning Objectives

```mdx
<LearningObjectives>
  <LearningObjective>First objective</LearningObjective>
  <LearningObjective>Second objective</LearningObjective>
  <LearningObjective>Third objective</LearningObjective>
</LearningObjectives>
```

## Quiz

```mdx
<LessonQuiz lessonId="your-lesson-slug">
  <QuizQuestion question="Your question?">
    <QuizOption>Wrong answer</QuizOption>
    <QuizOption isCorrect>Correct answer</QuizOption>
    <QuizOption>Wrong answer</QuizOption>
    <QuizOption>Wrong answer</QuizOption>
  </QuizQuestion>
</LessonQuiz>
```

**Key Point**: Use `isCorrect` to mark the correct answer - no separate answer files needed!

## Project Section

```mdx
<ProjectSection
  title="Project Title"
  description="Project description"
  difficulty="Beginner"
  timeEstimate="2-3 hours"
  skills={["Skill 1", "Skill 2"]}
>
  Project content goes here...
</ProjectSection>
```

## Lesson Structure Template

```mdx
---
title: "Lesson Title"
description: "Lesson description"
---

# Lesson Title

Introduction paragraph...

<LearningObjectives>
  <LearningObjective>Objective 1</LearningObjective>
  <LearningObjective>Objective 2</LearningObjective>
</LearningObjectives>

## Section 1

Content...

## Section 2

Content...

<LessonQuiz lessonId="lesson-slug">
  <QuizQuestion question="Question 1?">
    <QuizOption>Option A</QuizOption>
    <QuizOption isCorrect>Option B</QuizOption>
    <QuizOption>Option C</QuizOption>
  </QuizQuestion>
</LessonQuiz>
```

## Key Points

- **Learning Objectives**: Place at beginning, after introduction
- **Quizzes**: Place at end, include `lessonId`
- **One correct answer**: Each question needs exactly one `isCorrect` option
- **H2 Headings**: Get automatic separators
- **File Location**: `content/courses/course/modules/module/lessons/lesson.mdx`
- **Self-Contained**: Questions and answers are all in the MDX file - no external files needed! 