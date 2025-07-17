import { connectToDatabase } from "../src/lib/mongoose"
import { Course, Module, Lesson } from "../src/lib/models"

async function seedCourse() {
  try {
    await connectToDatabase()
    console.log("Connected to database")

    // Create a sample course
    const course = new Course({
      title: "Fundamentals of Vibe Coding",
      description: "Learn the basics of modern web development with a focus on creating engaging user experiences. This course covers essential concepts, tools, and best practices for building interactive web applications.",
      slug: "fundamentals-of-vibe-coding",
      order: 1,
      isPublished: true,
      estimatedHours: 20,
      prerequisites: ["Basic HTML", "Basic CSS", "JavaScript fundamentals"],
    })

    await course.save()
    console.log("Created course:", course.title)

    // Create modules
    const module1 = new Module({
      title: "Introduction to Modern Web Development",
      description: "Get started with the fundamentals of modern web development and understand the current landscape.",
      slug: "introduction-to-modern-web-development",
      courseId: course._id,
      order: 1,
      estimatedHours: 4,
    })

    const module2 = new Module({
      title: "Building Interactive Components",
      description: "Learn how to create engaging and interactive user interface components.",
      slug: "building-interactive-components",
      courseId: course._id,
      order: 2,
      estimatedHours: 6,
    })

    const module3 = new Module({
      title: "State Management and Data Flow",
      description: "Understand how to manage application state and handle data flow effectively.",
      slug: "state-management-and-data-flow",
      courseId: course._id,
      order: 3,
      estimatedHours: 5,
    })

    await module1.save()
    await module2.save()
    await module3.save()
    console.log("Created modules")

    // Create lessons for module 1
    const lesson1_1 = new Lesson({
      title: "Welcome to Vibe Coding",
      description: "An introduction to the course and what you'll learn",
      slug: "welcome-to-vibe-coding",
      moduleId: module1._id,
      order: 1,
      type: "lesson",
      content: `# Welcome to Vibe Coding!

Welcome to the Fundamentals of Vibe Coding course! In this course, you'll learn how to create engaging, interactive web applications that provide excellent user experiences.

## What You'll Learn

- Modern web development practices
- Interactive component design
- State management techniques
- Performance optimization
- User experience best practices

## Course Structure

This course is divided into three main modules:

1. **Introduction to Modern Web Development** - Foundation concepts
2. **Building Interactive Components** - Hands-on component creation
3. **State Management and Data Flow** - Advanced concepts

## Getting Started

Make sure you have the following prerequisites:
- Basic understanding of HTML and CSS
- Familiarity with JavaScript fundamentals
- A code editor (VS Code recommended)
- A modern web browser

Let's get started on your journey to becoming a vibe coder!`,
      resources: [
        {
          title: "Modern Web Development Guide",
          url: "https://developer.mozilla.org/en-US/docs/Web/Guide",
          type: "documentation"
        },
        {
          title: "JavaScript Fundamentals",
          url: "https://javascript.info/",
          type: "article"
        }
      ],
      isPublished: true,
    })

    const lesson1_2 = new Lesson({
      title: "Setting Up Your Development Environment",
      description: "Configure your development environment for modern web development",
      slug: "setting-up-development-environment",
      moduleId: module1._id,
      order: 2,
      type: "lesson",
      content: `# Setting Up Your Development Environment

A proper development environment is crucial for efficient web development. Let's set up everything you need.

## Required Tools

### 1. Code Editor
We recommend **Visual Studio Code** for this course:
- Download from [code.visualstudio.com](https://code.visualstudio.com/)
- Install essential extensions:
  - Live Server
  - Prettier
  - ESLint
  - Auto Rename Tag

### 2. Node.js and npm
Install Node.js to get access to npm (Node Package Manager):
- Download from [nodejs.org](https://nodejs.org/)
- Choose the LTS version for stability

### 3. Git
Version control is essential:
- Download from [git-scm.com](https://git-scm.com/)
- Configure your identity:
  \`\`\`bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  \`\`\`

## Project Setup

Create a new project directory:
\`\`\`bash
mkdir my-vibe-project
cd my-vibe-project
npm init -y
\`\`\`

## Next Steps

Once your environment is set up, you'll be ready to start building your first interactive components!`,
      resources: [
        {
          title: "VS Code Setup Guide",
          url: "https://code.visualstudio.com/docs/setup/setup-overview",
          type: "documentation"
        },
        {
          title: "Node.js Installation",
          url: "https://nodejs.org/en/download/",
          type: "tool"
        }
      ],
      isPublished: true,
    })

    const lesson1_3 = new Lesson({
      title: "Your First Interactive Component",
      description: "Build your first interactive component and understand the basics",
      slug: "first-interactive-component",
      moduleId: module1._id,
      order: 3,
      type: "project",
      content: `# Your First Interactive Component

It's time to build your first interactive component! We'll create a simple counter that demonstrates basic interactivity.

## Project Overview

You'll build a counter component that:
- Displays a number
- Has increment and decrement buttons
- Shows the current count
- Includes a reset button

## Requirements

Create an HTML file with the following features:
- A display area for the count
- Three buttons: increment (+), decrement (-), and reset
- Basic styling to make it look good
- JavaScript functionality for all interactions

## Starter Code

Here's the basic HTML structure to get you started:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Counter</title>
    <style>
        /* Add your CSS here */
    </style>
</head>
<body>
    <div class="counter-container">
        <h1>Interactive Counter</h1>
        <div class="counter-display">
            <span id="count">0</span>
        </div>
        <div class="counter-controls">
            <button id="decrement">-</button>
            <button id="reset">Reset</button>
            <button id="increment">+</button>
        </div>
    </div>
    
    <script>
        // Add your JavaScript here
    </script>
</body>
</html>
\`\`\`

## Assignment

1. Complete the CSS styling to make the counter look modern and appealing
2. Implement the JavaScript functionality for all three buttons
3. Add some visual feedback when buttons are clicked
4. Make sure the component is responsive

## Submission

Submit your completed project with:
- The HTML file
- A brief description of your implementation
- Any challenges you faced and how you solved them

Good luck!`,
      assignment: {
        title: "Interactive Counter Component",
        description: "Build a fully functional counter component with increment, decrement, and reset functionality",
        instructions: "Create an interactive counter component with modern styling and smooth interactions. Include visual feedback and ensure it's responsive.",
        submissionType: "github",
        starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Counter</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .counter-container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .counter-display {
            font-size: 4rem;
            font-weight: bold;
            color: #333;
            margin: 1rem 0;
        }
        
        .counter-controls {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }
        
        button {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        #increment, #decrement {
            background: #007bff;
            color: white;
        }
        
        #reset {
            background: #6c757d;
            color: white;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
    </style>
</head>
<body>
    <div class="counter-container">
        <h1>Interactive Counter</h1>
        <div class="counter-display">
            <span id="count">0</span>
        </div>
        <div class="counter-controls">
            <button id="decrement">-</button>
            <button id="reset">Reset</button>
            <button id="increment">+</button>
        </div>
    </div>
    
    <script>
        // Your JavaScript code here
    </script>
</body>
</html>`
      },
      isPublished: true,
    })

    // Create lessons for module 2
    const lesson2_1 = new Lesson({
      title: "Understanding Component Architecture",
      description: "Learn about component-based architecture and its benefits",
      slug: "understanding-component-architecture",
      moduleId: module2._id,
      order: 1,
      type: "lesson",
      content: `# Understanding Component Architecture

Component-based architecture is a fundamental concept in modern web development. Let's explore what it means and why it's important.

## What are Components?

Components are reusable, self-contained pieces of code that encapsulate:
- **Structure** (HTML)
- **Styling** (CSS)
- **Behavior** (JavaScript)
- **Data** (State)

## Benefits of Component Architecture

### 1. Reusability
Components can be used multiple times throughout your application:
\`\`\`javascript
// A button component can be reused
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete</Button>
\`\`\`

### 2. Maintainability
When you need to update a component, the changes apply everywhere it's used:
- Fix a bug once, it's fixed everywhere
- Update styling in one place
- Consistent behavior across the application

### 3. Testability
Components can be tested in isolation:
- Unit tests for individual components
- Integration tests for component interactions
- Easier to debug and troubleshoot

### 4. Team Collaboration
Different team members can work on different components:
- Parallel development
- Clear ownership and responsibilities
- Reduced merge conflicts

## Component Types

### 1. Presentational Components
- Focus on appearance and presentation
- Receive data as props
- Don't manage their own state
- Also called "dumb" or "stateless" components

### 2. Container Components
- Handle business logic and data management
- Manage state and side effects
- Pass data to presentational components
- Also called "smart" or "stateful" components

## Component Communication

Components communicate through:
- **Props** (parent to child)
- **Events** (child to parent)
- **Context** (global state)
- **State management libraries** (Redux, Zustand, etc.)

## Best Practices

1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition over Inheritance**: Build complex components from simple ones
3. **Props Interface**: Define clear interfaces for component props
4. **Default Props**: Provide sensible defaults
5. **Error Boundaries**: Handle errors gracefully

## Example Component Structure

\`\`\`javascript
// Component structure example
function UserCard({ user, onEdit, onDelete }) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <div className="actions">
        <button onClick={() => onEdit(user.id)}>Edit</button>
        <button onClick={() => onDelete(user.id)}>Delete</button>
      </div>
    </div>
  );
}
\`\`\`

## Next Steps

In the upcoming lessons, we'll build various components and see these concepts in action!`,
      resources: [
        {
          title: "Component Design Patterns",
          url: "https://reactjs.org/docs/thinking-in-react.html",
          type: "article"
        },
        {
          title: "Component Best Practices",
          url: "https://web.dev/component-best-practices/",
          type: "documentation"
        }
      ],
      isPublished: true,
    })

    // Save all lessons
    await lesson1_1.save()
    await lesson1_2.save()
    await lesson1_3.save()
    await lesson2_1.save()
    console.log("Created lessons")

    // Update modules with lesson references
    module1.lessons = [lesson1_1._id, lesson1_2._id, lesson1_3._id]
    module2.lessons = [lesson2_1._id]
    await module1.save()
    await module2.save()

    // Update course with module references
    course.modules = [module1._id, module2._id, module3._id]
    await course.save()

    console.log("✅ Course seeded successfully!")
    console.log("Course ID:", course._id)
    console.log("You can now access the course at: /courses/fundamentals-of-vibe-coding")

  } catch (error) {
    console.error("Error seeding course:", error)
  } finally {
    process.exit(0)
  }
}

seedCourse()