# Content Contribution Guide

Welcome to Project Vibe It! This guide will help you contribute to our curriculum content using the MDX-based system. Our platform uses a file-based content management system that makes it easy to add new courses, modules, and lessons.

## Table of Contents

- [Content System Overview](#content-system-overview)
- [File Structure](#file-structure)
- [Adding New Content](#adding-new-content)
- [Content Types](#content-types)
- [Frontmatter Reference](#frontmatter-reference)
- [MDX Content Guidelines](#mdx-content-guidelines)
- [Contribution Workflow](#contribution-workflow)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Content System Overview

Our platform uses a **hierarchical file-based approach** that automatically loads and organizes content. The system:

- **Scans the file system** for courses and their metadata
- **Loads MDX content** with custom components and syntax highlighting
- **Handles navigation** between lessons automatically
- **Supports rich content** including resources, assignments, and interactive elements
- **Maintains order** through metadata fields
- **Generates overview pages** automatically from course metadata

### Key Benefits

- ✅ **No database required** - Content is version-controlled in Git
- ✅ **Developer-friendly** - Standard MDX format with frontmatter
- ✅ **Scalable** - Easy to add new courses, modules, and lessons
- ✅ **Ordered navigation** - Automatic sequencing based on metadata
- ✅ **Rich content support** - Resources, assignments, code blocks, and more
- ✅ **Automatic overview pages** - Course overviews generated from metadata

## File Structure

```
content/
└── courses/
    └── [course-slug]/
        ├── meta.json                    # Course metadata and structure
        └── modules/
            └── [module-slug]/
                └── lessons/
                    ├── lesson-1.mdx     # Lesson content with frontmatter
                    ├── lesson-2.mdx
                    └── lesson-3.mdx
```

### Directory Naming Conventions

- **Course slugs**: Use kebab-case (e.g., `fundamentals-of-vibe-coding`)
- **Module slugs**: Use kebab-case (e.g., `getting-started`, `html-fundamentals`)
- **Lesson files**: Use kebab-case with `.mdx` extension (e.g., `introduction-to-web-development.mdx`)

## Adding New Content

### Course Pages and Navigation

Each course has three main pages:
- **Course Page** (`/courses/[courseSlug]`) - Main course landing page with modules and progress
- **Overview Page** (`/courses/[courseSlug]/overview`) - Detailed course information, curriculum breakdown, and learning objectives
- **Module Page** (`/courses/[courseSlug]/[moduleSlug]`) - Module-specific page with lessons, progress tracking, and navigation

The overview page is automatically generated from your course metadata and provides:
- Comprehensive course description and statistics
- Detailed curriculum breakdown with all modules and lessons
- Learning objectives and outcomes
- Prerequisites and course features
- Instructor information

### 1. Adding a New Course

1. **Create the course directory structure:**
```bash
mkdir -p content/courses/[new-course-slug]/modules
```

2. **Create the course metadata file:**
```bash
touch content/courses/[new-course-slug]/meta.json
```

3. **Add course metadata:**
```json
{
  "id": "advanced-react-patterns",
  "title": "Advanced React Patterns",
  "description": "Master advanced React concepts including hooks, context, and performance optimization.",
  "slug": "advanced-react-patterns",
  "order": 2,
  "isPublished": true,
  "estimatedHours": 80,
  "prerequisites": ["fundamentals-of-vibe-coding"],
  "rating": 4.9,
  "students": 850,
  "modules": []
}
```

### 2. Adding a New Module

1. **Create the module directory:**
```bash
mkdir -p content/courses/[course-slug]/modules/[new-module-slug]/lessons
```

2. **Update the course's `meta.json`** to include the new module:
```json
{
  "modules": [
    {
      "id": "hooks-and-context",
      "title": "React Hooks and Context",
      "description": "Learn to use React hooks and context for state management.",
      "slug": "hooks-and-context",
      "order": 1,
      "estimatedHours": 20,
      "lessons": []
    }
  ]
}
```

### 3. Adding a New Lesson

1. **Create the lesson file:**
```bash
touch content/courses/[course-slug]/modules/[module-slug]/lessons/[lesson-name].mdx
```

2. **Add lesson content with frontmatter:**
```mdx
---
title: "Introduction to React Hooks"
description: "Learn the basics of React hooks and how they revolutionize functional components."
type: "lesson"
order: 1
resources:
  - title: "React Hooks Documentation"
    url: "https://react.dev/reference/react"
    type: "documentation"
  - title: "Hooks Explained - YouTube"
    url: "https://www.youtube.com/watch?v=dpw9EHDh2bM"
    type: "video"
---

# Introduction to React Hooks

Your lesson content here...
```

3. **Update the module's lesson list** in the course's `meta.json`:
```json
{
  "lessons": [
    {
      "id": "introduction-to-react-hooks",
      "title": "Introduction to React Hooks",
      "description": "Learn the basics of React hooks and how they revolutionize functional components.",
      "slug": "introduction-to-react-hooks",
      "order": 1,
      "type": "lesson",
      "isPublished": true
    }
  ]
}
```

**Note:** All lesson information you add to the metadata will automatically appear on the course overview page (`/courses/[courseSlug]/overview`), providing students with a comprehensive view of the curriculum.

## Content Types

### Lesson Types

The `type` field in lesson frontmatter determines how the content is displayed:

- **`"lesson"`**: Standard learning content with theory and examples
- **`"project"`**: Hands-on project with practical application
- **`"assignment"`**: Structured assignment with submission requirements

### Resource Types

Resources can be categorized for better organization:

- **`"article"`**: Blog posts, tutorials, documentation
- **`"video"`**: YouTube videos, course videos, screencasts
- **`"tool"`**: Online tools, playgrounds, generators
- **`"documentation"`**: Official documentation, API references

### Submission Types

For assignments, specify how students should submit their work:

- **`"github"`**: GitHub repository link
- **`"url"`**: Live website URL
- **`"text"`**: Text-based submission

## Frontmatter Reference

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title` | string | Lesson title | `"Introduction to React Hooks"` |
| `description` | string | Brief lesson description | `"Learn the basics of React hooks..."` |
| `type` | string | Content type | `"lesson"`, `"project"`, `"assignment"` |
| `order` | number | Lesson order within module | `1`, `2`, `3` |

### Optional Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `resources` | array | External learning resources | See [Resources Structure](#resources-structure) |
| `assignment` | object | Assignment details | See [Assignment Structure](#assignment-structure) |

### Resources Structure

```yaml
resources:
  - title: "Resource Title"
    url: "https://example.com/resource"
    type: "article" | "video" | "tool" | "documentation"
```

### Assignment Structure

```yaml
assignment:
  title: "Assignment Title"
  description: "Brief assignment description"
  instructions: |
    Detailed instructions with:
    - Bullet points
    - Multiple lines
    - Code examples
  submissionType: "github" | "url" | "text"
  starterCode: |
    // Optional starter code
    function example() {
      return "Hello World";
    }
```

## MDX Content Guidelines

### Writing Style

- **Use clear, conversational language** - Write as if explaining to a friend
- **Break complex concepts into digestible chunks** - Use headings and subheadings
- **Include practical examples** - Show real-world applications
- **Encourage hands-on learning** - Provide exercises and challenges

### Code Examples

- **Use syntax highlighting** - Specify language in code blocks
- **Include comments** - Explain what the code does
- **Provide complete examples** - Ensure code is runnable
- **Follow best practices** - Use modern, clean code patterns

```mdx
```javascript
// Example: Using useState hook
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### Content Structure

Use consistent heading hierarchy:

```mdx
# Main Lesson Title (H1)

## Section Title (H2)

### Subsection Title (H3)

#### Detail Title (H4)
```

### Interactive Elements

The platform supports custom MDX components:

- **`<ResourceCard />`** - For external resources
- **`<AssignmentCard />`** - For assignments
- **Code blocks** - Automatic syntax highlighting and copy functionality

## Contribution Workflow

### 1. Setup Development Environment

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/project-vibe-it.git
cd project-vibe-it

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### 2. Create Your Content

1. **Plan your content** - Outline the lesson structure and learning objectives
2. **Create the file structure** - Follow the naming conventions
3. **Write the content** - Use the MDX format with proper frontmatter
4. **Add metadata** - Update the course's `meta.json` file

### 3. Test Your Content

```bash
# Start the development server
pnpm dev

# Navigate to your content
# http://localhost:3000/courses/[course-slug]/[module-slug]/[lesson-slug]

# Test the overview page
# http://localhost:3000/courses/[course-slug]/overview

# Test the module page
# http://localhost:3000/courses/[course-slug]/[module-slug]
```

**Check for:**
- ✅ Content renders correctly
- ✅ Navigation works properly
- ✅ Resources and assignments display correctly
- ✅ Code examples are properly formatted
- ✅ Mobile responsiveness
- ✅ Overview page displays all course information correctly
- ✅ Course statistics are accurate (modules, lessons, projects count)
- ✅ Module page shows all lessons and navigation correctly

### 4. Submit Your Contribution

```bash
# Create a new branch
git checkout -b feature/add-new-lesson

# Add your changes
git add .

# Commit with descriptive message
git commit -m "feat: add React hooks introduction lesson

- Add new lesson on React hooks basics
- Include 3 external resources
- Add hands-on assignment with starter code
- Update course metadata"

# Push to your fork
git push origin feature/add-new-lesson

# Create a pull request
```

### 5. Pull Request Guidelines

**Title format:** `feat: add [content type] - [brief description]`

**Description template:**
```markdown
## Description
Brief description of the content added or modified.

## Content Type
- [ ] New course
- [ ] New module  
- [ ] New lesson
- [ ] Content update
- [ ] Bug fix

## Changes Made
- [List specific changes]

## Testing
- [ ] Content renders correctly
- [ ] Navigation works properly
- [ ] All links are functional
- [ ] Mobile responsive

## Screenshots (if applicable)
[Add screenshots of the new content]

## Related Issues
Closes #[issue-number]
```

## Best Practices

### Content Quality

- **Research thoroughly** - Ensure information is accurate and up-to-date
- **Cite sources** - Include references for technical information
- **Test code examples** - Verify all code works as expected
- **Proofread carefully** - Check for typos and grammatical errors

### File Organization

- **Use descriptive names** - Make file names self-explanatory
- **Follow conventions** - Stick to kebab-case naming
- **Group related content** - Organize lessons logically within modules
- **Maintain consistency** - Follow existing patterns and structures

### Metadata Management

- **Keep order sequential** - Ensure lesson orders are consecutive
- **Use descriptive titles** - Make titles clear and engaging
- **Write compelling descriptions** - Hook readers with brief summaries
- **Set appropriate types** - Choose the right content type for each lesson
- **Complete course metadata** - All fields in `meta.json` appear on the overview page
- **Accurate statistics** - Ensure module counts, lesson counts, and project counts are correct

### Accessibility

- **Use semantic HTML** - Proper heading hierarchy and structure
- **Include alt text** - Describe images and diagrams
- **Provide transcripts** - For video content when possible
- **Test with screen readers** - Ensure content is accessible

## Troubleshooting

### Common Issues

**Content not appearing:**
- Check file paths and naming conventions
- Verify metadata is properly formatted
- Ensure `isPublished` is set to `true`

**Navigation not working:**
- Check `order` fields are sequential
- Verify slugs match file names
- Ensure all metadata is complete
- Check overview page link works (`/courses/[courseSlug]/overview`)
- Check module page link works (`/courses/[courseSlug]/[moduleSlug]`)

**Code not highlighting:**
- Specify language in code blocks
- Use triple backticks with language identifier
- Check for syntax errors in code

**Resources not displaying:**
- Verify frontmatter format is correct
- Check URLs are accessible
- Ensure resource types are valid

### Getting Help

- **Discord Community** - Join for real-time help and collaboration
- **GitHub Issues** - Open issues for bugs or feature requests
- **Documentation** - Review existing content for examples
- **Code Review** - Ask for feedback on your contributions

## Content Review Process

1. **Self-Review** - Test and proofread your content
2. **Community Review** - Share for feedback in Discord/GitHub
3. **Technical Review** - Ensure proper formatting and functionality
4. **Content Review** - Verify educational value and accuracy
5. **Final Approval** - Content is approved and merged

## Recognition

Contributors are recognized in several ways:

- **GitHub Contributors** - Your commits appear in the repository
- **Content Credits** - Attribution in lesson content when appropriate
- **Community Recognition** - Featured in Discord and social media
- **Contributor Hall of Fame** - Listed in project documentation

---

Thank you for contributing to Project Vibe It! Your contributions help make learning web development accessible to everyone. 

**Questions?** Join our [Discord community](https://discord.gg/projectvibeit) or open a [GitHub issue](https://github.com/yourusername/project-vibe-it/issues). 