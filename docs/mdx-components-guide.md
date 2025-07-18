# MDX Components Guide

This guide explains how to use the custom MDX components in your lesson content to create interactive quizzes and learning objectives.

## Learning Objectives

### Basic Usage

Add learning objectives at the beginning of your lesson content, right after the introduction:

```mdx
---
title: "Your Lesson Title"
description: "Your lesson description"
---

# Your Lesson Title

Your introduction paragraph goes here...

<LearningObjectives>
  <LearningObjective>First learning objective</LearningObjective>
  <LearningObjective>Second learning objective</LearningObjective>
  <LearningObjective>Third learning objective</LearningObjective>
</LearningObjectives>

## Your First Section

Your content continues here...
```

### Example

```mdx
<LearningObjectives>
  <LearningObjective>Understand the core philosophy and principles of Vibe Coding</LearningObjective>
  <LearningObjective>Recognize the difference between traditional coding and AI-assisted development</LearningObjective>
  <LearningObjective>Identify the key skills needed for successful Vibe Coding</LearningObjective>
  <LearningObjective>Apply the human-AI collaboration model to real-world scenarios</LearningObjective>
</LearningObjectives>
```

## Interactive Quizzes

### Basic Structure

Add quizzes at the end of your lesson content. **The correct answers are defined directly in the MDX content using the `isCorrect` prop** - no need to maintain separate answer files!

```mdx
<LessonQuiz lessonId="your-lesson-slug">
  <QuizQuestion question="Your question text here?">
    <QuizOption>First option</QuizOption>
    <QuizOption>Second option</QuizOption>
    <QuizOption isCorrect>Correct answer</QuizOption>
    <QuizOption>Fourth option</QuizOption>
  </QuizQuestion>
  
  <QuizQuestion question="Another question?">
    <QuizOption isCorrect>Correct answer</QuizOption>
    <QuizOption>Wrong answer</QuizOption>
    <QuizOption>Another wrong answer</QuizOption>
    <QuizOption>Yet another wrong answer</QuizOption>
  </QuizQuestion>
</LessonQuiz>
```

### Quiz Component Props

- `lessonId` (required): The unique identifier for your lesson (usually the lesson slug)
- `title` (optional): Custom title for the quiz (defaults to "Knowledge Check")
- `description` (optional): Custom description (defaults to "Test your understanding...")
- `showResults` (optional): Whether to show results after submission (defaults to true)
- `allowRetry` (optional): Whether to allow retaking the quiz (defaults to true)

### QuizQuestion Component

- `question` (required): The question text

### QuizOption Component

- `isCorrect` (optional): Mark this option as the correct answer - **this is how the quiz knows which answer is right!**
- `explanation` (optional): Explanation that appears after submission (only for correct answers)

### Complete Example

```mdx
<LessonQuiz lessonId="what-is-vibe-coding">
  <QuizQuestion question="What is the primary focus of Vibe Coding?">
    <QuizOption>Writing perfect, optimized code</QuizOption>
    <QuizOption>Memorizing programming syntax</QuizOption>
    <QuizOption isCorrect>Focusing on outcomes and solving problems</QuizOption>
    <QuizOption>Replacing human developers with AI</QuizOption>
  </QuizQuestion>
  
  <QuizQuestion question="In the Vibe Coding model, what does the human primarily contribute?">
    <QuizOption>Speed and automation</QuizOption>
    <QuizOption isCorrect>Creativity, vision, and problem-solving</QuizOption>
    <QuizOption>Technical implementation details</QuizOption>
    <QuizOption>Code optimization and debugging</QuizOption>
  </QuizQuestion>
  
  <QuizQuestion question="Which of the following is NOT a core principle of Vibe Coding?">
    <QuizOption>Human-AI partnership</QuizOption>
    <QuizOption>Intuition-driven development</QuizOption>
    <QuizOption>Focus on outcomes</QuizOption>
    <QuizOption isCorrect>Complete automation without human input</QuizOption>
  </QuizQuestion>
</LessonQuiz>
```

### Why This Approach is Better

1. **Everything in One Place**: Questions and answers are defined together in the same MDX file
2. **Easy to Contribute**: Contributors can add/modify quizzes without touching component code
3. **No Maintenance Overhead**: No need to maintain separate answer files or update component code
4. **Self-Documenting**: The correct answer is clearly marked with `isCorrect`
5. **Version Control Friendly**: Changes to questions and answers are tracked in the same file

## Project Sections

### Basic Usage

Add project sections to provide hands-on assignments:

```mdx
<ProjectSection
  title="Build a Simple Website"
  description="Create your first website using HTML and CSS"
  difficulty="Beginner"
  timeEstimate="2-3 hours"
  skills={["HTML", "CSS", "Design"]}
>
  <h3>Project Overview</h3>
  <p>In this project, you'll build a simple personal website...</p>
  
  <h3>Requirements</h3>
  <ul>
    <li>At least 3 pages</li>
    <li>Responsive design</li>
    <li>Contact form</li>
  </ul>
  
  <h3>Resources</h3>
  <ul>
    <li><a href="#">HTML Basics Guide</a></li>
    <li><a href="#">CSS Styling Tutorial</a></li>
  </ul>
</ProjectSection>
```

## Best Practices

### Learning Objectives

1. **Place at the beginning**: Always put learning objectives right after the introduction
2. **Be specific**: Use action verbs and clear, measurable objectives
3. **Keep it focused**: 3-5 objectives per lesson is ideal
4. **Align with content**: Make sure your content actually covers these objectives

### Quizzes

1. **One correct answer**: Each question should have exactly one `isCorrect` option
2. **Clear questions**: Write questions that are unambiguous
3. **Plausible distractors**: Wrong answers should be believable but clearly incorrect
4. **Appropriate difficulty**: Match quiz difficulty to lesson level
5. **Meaningful feedback**: Use explanations to help students learn from mistakes
6. **Mark correct answers**: Always use `isCorrect` to mark the right answer

### Content Structure

1. **Introduction** → **Learning Objectives** → **Content Sections** → **Quiz**
2. **Use H2 headings** for major sections (they get automatic separators)
3. **Keep sections focused** on one main topic
4. **Include examples** and practical applications
5. **End with a quiz** to reinforce learning

## File Organization

### Lesson File Structure

```
content/courses/
  └── your-course/
      └── modules/
          └── your-module/
              └── lessons/
                  └── your-lesson.mdx
```

### Lesson Content Template

```mdx
---
title: "Your Lesson Title"
description: "Brief description of what this lesson covers"
---

# Your Lesson Title

Brief introduction to the lesson topic...

<LearningObjectives>
  <LearningObjective>First objective</LearningObjective>
  <LearningObjective>Second objective</LearningObjective>
  <LearningObjective>Third objective</LearningObjective>
</LearningObjectives>

## First Major Section

Content for your first section...

## Second Major Section

Content for your second section...

## Third Major Section

Content for your third section...

<LessonQuiz lessonId="your-lesson-slug">
  <QuizQuestion question="Your first question?">
    <QuizOption>Option A</QuizOption>
    <QuizOption isCorrect>Option B (correct)</QuizOption>
    <QuizOption>Option C</QuizOption>
    <QuizOption>Option D</QuizOption>
  </QuizQuestion>
  
  <QuizQuestion question="Your second question?">
    <QuizOption isCorrect>Option A (correct)</QuizOption>
    <QuizOption>Option B</QuizOption>
    <QuizOption>Option C</QuizOption>
    <QuizOption>Option D</QuizOption>
  </QuizQuestion>
</LessonQuiz>
```

## Troubleshooting

### Quiz Not Working

1. **Check lessonId**: Make sure the `lessonId` matches your lesson slug
2. **Verify structure**: Ensure each question has exactly one `isCorrect` option
3. **Check syntax**: Make sure all tags are properly closed
4. **Test interactivity**: Options should be clickable and highlight when selected
5. **Check correct answers**: Make sure you've marked one option with `isCorrect`

### Learning Objectives Not Showing

1. **Check placement**: Objectives should be after the introduction but before content sections
2. **Verify syntax**: Make sure all `<LearningObjective>` tags are properly closed
3. **Check content**: Ensure there's actual text content in each objective

### Common Issues

- **Missing lessonId**: Quiz won't save results without a valid lessonId
- **Multiple correct answers**: Each question should have only one `isCorrect` option
- **No correct answers**: Make sure at least one option has `isCorrect`
- **Empty objectives**: Learning objectives need actual text content
- **Wrong file location**: Make sure lesson files are in the correct directory structure

## Contributing Guidelines

### Adding New Quizzes

1. **Create the quiz structure** in your MDX file
2. **Mark the correct answer** with `isCorrect`
3. **Test the quiz** to ensure it works correctly
4. **No code changes needed** - everything is self-contained in the MDX!

### Modifying Existing Quizzes

1. **Edit the MDX file** directly
2. **Update questions or answers** as needed
3. **Ensure one correct answer** per question
4. **Test the changes** to verify they work

This approach makes it incredibly easy for anyone to contribute quizzes without needing to understand React components or maintain separate answer files! 