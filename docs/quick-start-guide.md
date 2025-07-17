# Quick Start Guide for Contributors

This guide helps you quickly add new content to Project Vibe It. For detailed information, see the [full Content Contribution Guide](./content-contribution.md).

## 🚀 Quick Steps to Add Content

### 1. Add a New Lesson (Most Common)

1. **Find the course and module** where you want to add the lesson
2. **Create the lesson file:**
```bash
touch content/courses/[course-slug]/modules/[module-slug]/lessons/[lesson-name].mdx
```

3. **Add content with frontmatter:**
```mdx
---
title: "Your Lesson Title"
description: "Brief description of what students will learn"
type: "lesson"
order: 1
resources:
  - title: "Helpful Resource"
    url: "https://example.com"
    type: "article"
---

# Your Lesson Title

Your lesson content here...
```

4. **Update the course's `meta.json`** to include your lesson in the module's lessons array

### 2. Add a New Module

1. **Create module directory:**
```bash
mkdir -p content/courses/[course-slug]/modules/[module-name]/lessons
```

2. **Add module to course's `meta.json`:**
```json
{
  "modules": [
    {
      "id": "your-module-id",
      "title": "Your Module Title",
      "description": "Module description",
      "slug": "your-module-slug",
      "order": 1,
      "estimatedHours": 20,
      "lessons": []
    }
  ]
}
```

### 3. Add a New Course

1. **Create course structure:**
```bash
mkdir -p content/courses/[course-name]/modules
touch content/courses/[course-name]/meta.json
```

2. **Add course metadata:**
```json
{
  "id": "your-course-id",
  "title": "Your Course Title",
  "description": "Course description",
  "slug": "your-course-slug",
  "order": 1,
  "isPublished": true,
  "estimatedHours": 80,
  "prerequisites": [],
  "modules": []
}
```

## 📝 Frontmatter Quick Reference

### Required Fields
```yaml
---
title: "Lesson Title"
description: "Lesson description"
type: "lesson" | "project" | "assignment"
order: 1
---
```

### Optional Fields
```yaml
---
# ... required fields ...
resources:
  - title: "Resource Title"
    url: "https://example.com"
    type: "article" | "video" | "tool" | "documentation"

assignment:
  title: "Assignment Title"
  description: "Assignment description"
  instructions: "Step-by-step instructions"
  submissionType: "github" | "url" | "text"
  starterCode: "Optional starter code"
---
```

## 🎯 Content Types

- **`lesson`**: Standard learning content
- **`project`**: Hands-on project
- **`assignment`**: Structured assignment with submission

## 🔗 Resource Types

- **`article`**: Blog posts, tutorials
- **`video`**: YouTube videos, screencasts
- **`tool`**: Online tools, playgrounds
- **`documentation`**: Official docs, API references

## 🧪 Testing Your Content

1. **Start the dev server:**
```bash
pnpm dev
```

2. **Navigate to your content:**
```
http://localhost:3000/courses/[course-slug]/[module-slug]/[lesson-slug]
```

3. **Check:**
- ✅ Content renders correctly
- ✅ Navigation works
- ✅ Resources display properly
- ✅ Code highlighting works

## 📋 Common Patterns

### Code Block with Syntax Highlighting
```mdx
```javascript
// Your code here
function example() {
  return "Hello World";
}
```
```

### Assignment Example
```mdx
---
title: "Build a Todo App"
description: "Create a simple todo application"
type: "assignment"
order: 1
assignment:
  title: "Todo Application"
  description: "Build a todo app with add/remove functionality"
  instructions: |
    Create a todo app that:
    - Allows adding new todos
    - Allows removing todos
    - Shows a list of all todos
  submissionType: "github"
  starterCode: |
    <!DOCTYPE html>
    <html>
    <head>
      <title>Todo App</title>
    </head>
    <body>
      <!-- Your starter code here -->
    </body>
    </html>
---
```

## 🚨 Common Issues

**Content not showing?**
- Check `isPublished: true` in metadata
- Verify file paths match slugs
- Ensure order numbers are sequential

**Navigation broken?**
- Check all slugs match file names
- Verify order fields are correct
- Ensure metadata is complete

**Code not highlighting?**
- Use triple backticks with language: ` ```javascript `
- Check for syntax errors
- Ensure proper indentation

## 📞 Need Help?

- **Discord**: Join our community for real-time help
- **GitHub Issues**: Open an issue for bugs/questions
- **Full Guide**: Read the complete [Content Contribution Guide](./content-contribution.md)

---

**Ready to contribute?** Start with a simple lesson and work your way up! 🎉 