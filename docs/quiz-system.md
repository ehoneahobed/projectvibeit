# Quiz System Documentation

This document explains how to add quizzes to lessons using the new file-based quiz system.

## Overview

Quizzes are now stored as JSON files alongside lesson content, making them easy to find, edit, and contribute to. Each quiz file follows a consistent structure and is automatically loaded by the system.

## File Structure

```
content/courses/[course-slug]/modules/[module-slug]/lessons/
├── lesson-name.mdx                    # Lesson content
├── lesson-name.quiz.json              # Quiz for this lesson
├── another-lesson.mdx                 # Another lesson
└── another-lesson.quiz.json           # Quiz for another lesson
```

## How to Add a Quiz

### Step 1: Create the Quiz File

1. Navigate to the lesson directory: `content/courses/[course]/modules/[module]/lessons/`
2. Create a new file named `[lesson-slug].quiz.json`
3. Use the template from `docs/quiz-template.json` as a starting point

### Step 2: Fill in the Quiz Data

```json
{
  "id": "course-slug-module-slug-lesson-slug",
  "title": "Your Lesson Title",
  "description": "Test your understanding of the key concepts from this lesson.",
  "questions": [
    {
      "id": "question-0",
      "question": "What is the main concept?",
      "options": [
        {
          "id": "question-0-option-0",
          "text": "Option A",
          "isCorrect": false
        },
        {
          "id": "question-0-option-1",
          "text": "Option B (Correct)",
          "isCorrect": true
        },
        {
          "id": "question-0-option-2",
          "text": "Option C",
          "isCorrect": false
        },
        {
          "id": "question-0-option-3",
          "text": "Option D",
          "isCorrect": false
        }
      ]
    }
  ]
}
```

### Step 3: Required Fields

- **`id`**: Must match the format `course-slug-module-slug-lesson-slug`
- **`title`**: The quiz title (usually the lesson title)
- **`description`**: Brief description of what the quiz tests
- **`questions`**: Array of question objects

### Step 4: Question Structure

Each question must have:
- **`id`**: Unique identifier (e.g., "question-0", "question-1")
- **`question`**: The question text
- **`options`**: Array of 4 option objects

Each option must have:
- **`id`**: Unique identifier (e.g., "question-0-option-0")
- **`text`**: The option text
- **`isCorrect`**: Boolean (only one should be `true`)

## Example Quiz

Here's a complete example for the "What is Vibe Coding?" lesson:

```json
{
  "id": "fundamentals-of-vibe-coding-introduction-to-vibe-coding-what-is-vibe-coding",
  "title": "What is Vibe Coding?",
  "description": "Test your understanding of the key concepts from this lesson.",
  "questions": [
    {
      "id": "question-0",
      "question": "What is the primary focus of Vibe Coding?",
      "options": [
        {
          "id": "question-0-option-0",
          "text": "Writing perfect, optimized code",
          "isCorrect": false
        },
        {
          "id": "question-0-option-1",
          "text": "Focusing on outcomes and solving problems",
          "isCorrect": true
        },
        {
          "id": "question-0-option-2",
          "text": "Memorizing programming syntax",
          "isCorrect": false
        },
        {
          "id": "question-0-option-3",
          "text": "Replacing human developers with AI",
          "isCorrect": false
        }
      ]
    }
  ]
}
```

## Best Practices

### Question Writing
- **Clear and concise**: Questions should be easy to understand
- **One concept per question**: Focus on testing a single key concept
- **Avoid trick questions**: Questions should test understanding, not confusion
- **Use realistic scenarios**: When possible, use real-world examples

### Answer Options
- **4 options per question**: Always provide exactly 4 choices
- **One correct answer**: Only one option should be marked as `isCorrect: true`
- **Plausible distractors**: Wrong answers should be believable but clearly incorrect
- **Similar length**: Keep all options roughly the same length to avoid bias

### Quiz Structure
- **5-10 questions**: Aim for a reasonable number of questions
- **Mix of difficulty**: Include both basic and more challenging questions
- **Cover key concepts**: Ensure the quiz tests the main learning objectives
- **Logical order**: Arrange questions in a logical sequence

## Validation

The system automatically validates quiz files and will show warnings for:
- Missing required fields
- Invalid JSON syntax
- Questions without exactly 4 options
- Questions without exactly one correct answer
- Duplicate question or option IDs

## Testing Your Quiz

1. **Save the quiz file** in the correct location
2. **Visit the lesson page** in your browser
3. **Look for the quiz section** below the lesson content
4. **Test the quiz** by answering questions and submitting
5. **Check the results** to ensure scoring works correctly

## Troubleshooting

### Quiz Not Appearing
- Check that the file is named correctly: `[lesson-slug].quiz.json`
- Verify the file is in the correct directory
- Check the browser console for error messages
- Ensure the JSON syntax is valid

### Quiz Shows Error
- Check that all required fields are present
- Verify that each question has exactly 4 options
- Ensure exactly one option per question is marked as correct
- Check for duplicate IDs

### Quiz Data Not Loading
- Verify the `id` field matches the expected format
- Check file permissions
- Look for JSON syntax errors
- Ensure the file is saved with UTF-8 encoding

## Contributing

When contributing quizzes:

1. **Follow the template**: Use `docs/quiz-template.json` as a starting point
2. **Test thoroughly**: Make sure the quiz works correctly
3. **Review content**: Ensure questions are accurate and well-written
4. **Check for duplicates**: Make sure question IDs are unique
5. **Submit with lesson**: Include quiz files when submitting lesson content

## Advanced Features

### Explanations (Future)
You can add explanations to correct answers:

```json
{
  "id": "question-0-option-1",
  "text": "Correct answer",
  "isCorrect": true,
  "explanation": "This is why this answer is correct..."
}
```

### Hints (Future)
You can add hints to help students:

```json
{
  "id": "question-0",
  "question": "What is...?",
  "hint": "Think about the main concept we discussed...",
  "options": [...]
}
```

## Support

If you need help creating quizzes:
- Check this documentation
- Look at existing quiz examples
- Ask in the community discussions
- Review the quiz template file 