import { connectDB } from "../src/lib/db"
import { Course, Module, Lesson } from "../src/lib/models"

async function seed() {
  try {
    await connectDB()
    console.log("Connected to database")

    // Clear existing data
    await Course.deleteMany({})
    await Module.deleteMany({})
    await Lesson.deleteMany({})
    console.log("Cleared existing data")

    // Create lessons for Module 1
    const module1Lessons = await Lesson.create([
      {
        title: "Introduction to Web Development",
        description: "Learn the fundamentals of web development and understand how the web works.",
        slug: "introduction-to-web-development",
        order: 1,
        type: "lesson",
        content: `
# Introduction to Web Development

Welcome to your journey into web development! In this lesson, we'll explore what web development is, how the web works, and what you'll learn throughout this course.

## What is Web Development?

Web development is the process of creating websites and web applications. It involves writing code that runs in web browsers and on web servers to deliver content and functionality to users.

### Frontend vs Backend

**Frontend Development** focuses on what users see and interact with:
- HTML (structure)
- CSS (styling)
- JavaScript (interactivity)

**Backend Development** handles the server-side logic:
- Database management
- User authentication
- API development
- Server configuration

## How the Web Works

When you visit a website, here's what happens:

1. **Browser Request**: Your browser sends a request to a web server
2. **Server Response**: The server processes the request and sends back HTML, CSS, and JavaScript
3. **Rendering**: Your browser renders the content and displays the webpage
4. **Interaction**: Users can interact with the page, triggering new requests

## What You'll Learn

Throughout this course, you'll learn:

- **HTML & CSS**: Building and styling web pages
- **JavaScript**: Adding interactivity and dynamic content
- **React**: Building modern user interfaces
- **Next.js**: Full-stack web development
- **Database Design**: Storing and managing data
- **Deployment**: Getting your projects online

## Getting Started

Before we dive into coding, let's make sure you have the right mindset:

1. **Be Patient**: Learning to code takes time and practice
2. **Build Projects**: Apply what you learn by building real projects
3. **Ask Questions**: Don't hesitate to ask for help when you're stuck
4. **Practice Regularly**: Consistency is key to mastering web development

## Next Steps

In the next lesson, we'll set up your development environment and create your first HTML page. Get ready to start coding!
        `,
        resources: [
          {
            title: "MDN Web Docs - Getting Started with the Web",
            url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web",
            type: "article"
          },
          {
            title: "How the Web Works - YouTube",
            url: "https://www.youtube.com/watch?v=J8hzJxb0rpc",
            type: "video"
          },
          {
            title: "Web Development Roadmap",
            url: "https://roadmap.sh/frontend",
            type: "tool"
          }
        ],
        isPublished: true
      },
      {
        title: "Setting Up Your Development Environment",
        description: "Install and configure the tools you need to start coding.",
        slug: "setting-up-development-environment",
        order: 2,
        type: "lesson",
        content: `
# Setting Up Your Development Environment

Before you can start coding, you need to set up your development environment. This includes installing the necessary tools and configuring them properly.

## What You'll Install

1. **Code Editor**: Visual Studio Code (VS Code)
2. **Web Browser**: Chrome or Firefox with Developer Tools
3. **Version Control**: Git
4. **Node.js**: JavaScript runtime environment

## Step 1: Install Visual Studio Code

Visual Studio Code is a free, powerful code editor that's perfect for web development.

1. Go to [code.visualstudio.com](https://code.visualstudio.com)
2. Download the version for your operating system
3. Install it following the installation wizard
4. Launch VS Code

### Recommended Extensions

After installing VS Code, install these helpful extensions:

- **Live Server**: Automatically reloads your page when you save changes
- **Prettier**: Formats your code automatically
- **ESLint**: Helps catch errors in your JavaScript code
- **Auto Rename Tag**: Automatically renames paired HTML tags

## Step 2: Install Git

Git is a version control system that helps you track changes in your code.

1. Go to [git-scm.com](https://git-scm.com)
2. Download Git for your operating system
3. Install it with default settings
4. Open a terminal and run: \`git --version\`

## Step 3: Install Node.js

Node.js allows you to run JavaScript outside of the browser and install packages.

1. Go to [nodejs.org](https://nodejs.org)
2. Download the LTS (Long Term Support) version
3. Install it with default settings
4. Open a terminal and run: \`node --version\` and \`npm --version\`

## Step 4: Configure Your Terminal

Make sure your terminal is properly configured:

1. **Windows**: Use Git Bash or Windows Terminal
2. **Mac**: Use Terminal or iTerm2
3. **Linux**: Use your default terminal

## Step 5: Create Your First Project

Let's create your first project to test your setup:

1. Create a new folder for your project
2. Open VS Code in that folder
3. Create a new file called \`index.html\`
4. Add some basic HTML content
5. Use Live Server to view your page

## Testing Your Setup

To make sure everything is working:

1. Open a terminal
2. Navigate to your project folder
3. Run: \`git init\`
4. Run: \`npm init -y\`
5. Create a simple HTML file and open it in your browser

## Next Steps

Once your environment is set up, you'll be ready to start learning HTML and CSS in the next lesson!
        `,
        resources: [
          {
            title: "VS Code Setup Guide",
            url: "https://code.visualstudio.com/docs/setup/setup-overview",
            type: "article"
          },
          {
            title: "Git Installation Guide",
            url: "https://git-scm.com/book/en/v2/Getting-Started-Installing-Git",
            type: "article"
          }
        ],
        isPublished: true
      },
      {
        title: "Your First HTML Page",
        description: "Create your first HTML page and learn the basic structure.",
        slug: "your-first-html-page",
        order: 3,
        type: "lesson",
        content: `
# Your First HTML Page

Now that your development environment is set up, let's create your first HTML page! HTML (HyperText Markup Language) is the foundation of every website.

## What is HTML?

HTML is a markup language that tells web browsers how to structure and display content. It uses tags to define different elements on a page.

## Basic HTML Structure

Every HTML page has a basic structure:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first HTML page.</p>
</body>
</html>
\`\`\`

## Understanding the Structure

- **\`<!DOCTYPE html>\`**: Declares that this is an HTML5 document
- **\`<html>\`**: The root element that contains everything
- **\`<head>\`**: Contains metadata about the page (not visible)
- **\`<body>\`**: Contains the visible content of the page

## Common HTML Elements

### Headings
\`\`\`html
<h1>Main Heading</h1>
<h2>Subheading</h2>
<h3>Smaller Heading</h3>
\`\`\`

### Paragraphs
\`\`\`html
<p>This is a paragraph of text.</p>
\`\`\`

### Links
\`\`\`html
<a href="https://example.com">Click here</a>
\`\`\`

### Images
\`\`\`html
<img src="image.jpg" alt="Description of image">
\`\`\`

## Your First Page

Create a new file called \`index.html\` and add this content:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Learning Journey</title>
</head>
<body>
    <h1>Welcome to My Learning Journey</h1>
    <p>Hello! I'm learning web development and this is my first page.</p>
    
    <h2>What I'm Learning</h2>
    <ul>
        <li>HTML - Structure</li>
        <li>CSS - Styling</li>
        <li>JavaScript - Interactivity</li>
    </ul>
    
    <h2>My Goals</h2>
    <p>I want to become a web developer and build amazing websites!</p>
    
    <p>Check out my progress: <a href="https://github.com/myusername">My GitHub</a></p>
</body>
</html>
\`\`\`

## Viewing Your Page

1. Save the file as \`index.html\`
2. Open it in your web browser
3. You should see your first webpage!

## Best Practices

- Always use lowercase for HTML tags
- Close all tags properly
- Use meaningful tag names
- Include alt text for images
- Validate your HTML

## Next Steps

In the next lesson, we'll learn about CSS to make your page look beautiful!
        `,
        resources: [
          {
            title: "MDN HTML Basics",
            url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics",
            type: "article"
          },
          {
            title: "HTML Validator",
            url: "https://validator.w3.org/",
            type: "tool"
          }
        ],
        isPublished: true
      },
      {
        title: "Understanding CSS Basics",
        description: "Learn how to style your HTML pages with CSS.",
        slug: "understanding-css-basics",
        order: 4,
        type: "lesson",
        content: `
# Understanding CSS Basics

CSS (Cascading Style Sheets) is what makes websites look beautiful. It controls the visual appearance of HTML elements.

## What is CSS?

CSS is a styling language that describes how HTML elements should be displayed. It controls colors, fonts, spacing, layout, and more.

## How CSS Works

CSS uses selectors to target HTML elements and properties to style them:

\`\`\`css
selector {
    property: value;
}
\`\`\`

## Basic CSS Selectors

### Element Selector
\`\`\`css
h1 {
    color: blue;
}
\`\`\`

### Class Selector
\`\`\`css
.highlight {
    background-color: yellow;
}
\`\`\`

### ID Selector
\`\`\`css
#header {
    font-size: 24px;
}
\`\`\`

## Common CSS Properties

### Colors
\`\`\`css
color: red;           /* Text color */
background-color: blue; /* Background color */
\`\`\`

### Typography
\`\`\`css
font-family: Arial, sans-serif;
font-size: 16px;
font-weight: bold;
text-align: center;
\`\`\`

### Spacing
\`\`\`css
margin: 10px;         /* Outside spacing */
padding: 20px;        /* Inside spacing */
\`\`\`

### Layout
\`\`\`css
width: 100%;
height: 200px;
display: block;
\`\`\`

## Adding CSS to Your Page

### Method 1: Internal CSS
Add CSS inside the \`<head>\` section:

\`\`\`html
<head>
    <style>
        h1 {
            color: blue;
            text-align: center;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
    </style>
</head>
\`\`\`

### Method 2: External CSS (Recommended)
Create a separate CSS file and link it:

\`\`\`html
<head>
    <link rel="stylesheet" href="styles.css">
</head>
\`\`\`

## Your First Styled Page

Create a file called \`styles.css\`:

\`\`\`css
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
    color: #333;
    text-align: center;
    border-bottom: 2px solid #007bff;
    padding-bottom: 10px;
}

h2 {
    color: #007bff;
    margin-top: 30px;
}

ul {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 5px;
}

a {
    color: #007bff;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}
\`\`\`

## CSS Box Model

Every HTML element is treated as a box with:
- **Content**: The actual content
- **Padding**: Space inside the element
- **Border**: Line around the element
- **Margin**: Space outside the element

## Responsive Design

Make your page work on different screen sizes:

\`\`\`css
@media (max-width: 768px) {
    .container {
        padding: 15px;
        margin: 10px;
    }
    
    h1 {
        font-size: 24px;
    }
}
\`\`\`

## Next Steps

In the next lesson, we'll build a complete project combining HTML and CSS!
        `,
        resources: [
          {
            title: "MDN CSS Basics",
            url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics",
            type: "article"
          },
          {
            title: "CSS Color Picker",
            url: "https://www.w3schools.com/colors/colors_picker.asp",
            type: "tool"
          }
        ],
        isPublished: true
      },
      {
        title: "Build a Personal Portfolio",
        description: "Create a beautiful personal portfolio website using HTML and CSS.",
        slug: "build-personal-portfolio",
        order: 5,
        type: "project",
        content: `
# Project: Personal Portfolio

It's time to build your first project! You'll create a personal portfolio website that showcases your skills and projects.

## Project Overview

You'll build a responsive portfolio website with:
- A hero section with your name and title
- An about section
- A skills section
- A projects section
- A contact section

## Project Requirements

### HTML Structure
- Semantic HTML5 elements
- Proper heading hierarchy
- Navigation menu
- Contact form
- Links to social media

### CSS Styling
- Responsive design (mobile-first)
- Modern, clean design
- Smooth animations
- Professional color scheme
- Typography hierarchy

### Content
- Your name and title
- A brief bio
- List of skills/technologies
- 3-5 project examples
- Contact information

## Step-by-Step Guide

### Step 1: Plan Your Content
Before coding, plan what you want to include:
- What's your name and title?
- What's your story?
- What skills do you have?
- What projects can you showcase?

### Step 2: Create the HTML Structure
Start with a basic HTML structure:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Name - Portfolio</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <h1 class="nav-logo">Your Name</h1>
            <ul class="nav-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <section id="home" class="hero">
        <div class="hero-content">
            <h1>Hi, I'm Your Name</h1>
            <p>Web Developer & Designer</p>
            <a href="#projects" class="cta-button">View My Work</a>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2>About Me</h2>
            <p>Your story here...</p>
        </div>
    </section>

    <section id="skills" class="skills">
        <div class="container">
            <h2>Skills</h2>
            <div class="skills-grid">
                <div class="skill-item">HTML</div>
                <div class="skill-item">CSS</div>
                <div class="skill-item">JavaScript</div>
                <!-- Add more skills -->
            </div>
        </div>
    </section>

    <section id="projects" class="projects">
        <div class="container">
            <h2>Projects</h2>
            <div class="projects-grid">
                <!-- Project cards will go here -->
            </div>
        </div>
    </section>

    <section id="contact" class="contact">
        <div class="container">
            <h2>Contact Me</h2>
            <form class="contact-form">
                <input type="text" placeholder="Name" required>
                <input type="email" placeholder="Email" required>
                <textarea placeholder="Message" required></textarea>
                <button type="submit">Send Message</button>
            </form>
        </div>
    </section>

    <footer>
        <p>&copy; 2024 Your Name. All rights reserved.</p>
    </footer>
</body>
</html>
\`\`\`

### Step 3: Style with CSS
Create a modern, responsive design:

\`\`\`css
/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Navigation */
.navbar {
    background: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
}

.nav-logo {
    font-size: 24px;
    font-weight: bold;
    color: #007bff;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 30px;
}

.nav-menu a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s;
}

.nav-menu a:hover {
    color: #007bff;
}

/* Hero Section */
.hero {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
}

.hero-content h1 {
    font-size: 3rem;
    margin-bottom: 20px;
}

.hero-content p {
    font-size: 1.5rem;
    margin-bottom: 30px;
}

.cta-button {
    display: inline-block;
    padding: 15px 30px;
    background: #fff;
    color: #007bff;
    text-decoration: none;
    border-radius: 30px;
    font-weight: bold;
    transition: transform 0.3s;
}

.cta-button:hover {
    transform: translateY(-3px);
}

/* Sections */
section {
    padding: 80px 0;
}

section h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 50px;
    color: #333;
}

/* Skills Section */
.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-top: 40px;
}

.skill-item {
    background: #f8f9fa;
    padding: 20px;
    text-align: center;
    border-radius: 10px;
    font-weight: bold;
    transition: transform 0.3s;
}

.skill-item:hover {
    transform: translateY(-5px);
    background: #007bff;
    color: white;
}

/* Projects Section */
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-top: 40px;
}

.project-card {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s;
}

.project-card:hover {
    transform: translateY(-10px);
}

.project-image {
    width: 100%;
    height: 200px;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
}

.project-content {
    padding: 20px;
}

.project-content h3 {
    margin-bottom: 10px;
    color: #333;
}

/* Contact Form */
.contact-form {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.contact-form input,
.contact-form textarea {
    padding: 15px;
    border: 2px solid #e9ecef;
    border-radius: 5px;
    font-size: 16px;
    transition: border-color 0.3s;
}

.contact-form input:focus,
.contact-form textarea:focus {
    outline: none;
    border-color: #007bff;
}

.contact-form textarea {
    height: 150px;
    resize: vertical;
}

.contact-form button {
    padding: 15px 30px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s;
}

.contact-form button:hover {
    background: #0056b3;
}

/* Footer */
footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }
    
    .hero-content h1 {
        font-size: 2rem;
    }
    
    .hero-content p {
        font-size: 1.2rem;
    }
    
    section h2 {
        font-size: 2rem;
    }
}
\`\`\`

### Step 4: Add Your Content
Replace the placeholder content with your actual information:
- Your real name and title
- Your personal story
- Your actual skills
- Your projects (even if they're just ideas for now)

### Step 5: Test and Refine
- Test on different screen sizes
- Check for typos and broken links
- Optimize images and performance
- Get feedback from others

## Submission Requirements

1. **GitHub Repository**: Create a public repository with your code
2. **Live Demo**: Deploy your site (GitHub Pages, Netlify, or Vercel)
3. **README**: Include a description of your project
4. **Screenshots**: Add screenshots of your portfolio

## Bonus Challenges

- Add smooth scrolling navigation
- Include a dark mode toggle
- Add animations and transitions
- Create a blog section
- Add a downloadable resume

## Next Steps

Once you complete this project, you'll have a professional portfolio to showcase your work as you continue learning!
        `,
        assignment: {
          title: "Personal Portfolio Website",
          description: "Create a responsive personal portfolio website using HTML and CSS",
          instructions: "Build a complete portfolio website with multiple sections, responsive design, and modern styling",
          submissionType: "github",
          starterCode: null
        },
        isPublished: true
      }
    ])

    // Create Module 1
    const module1 = await Module.create({
      title: "Getting Started with Web Development",
      description: "Learn the fundamentals of web development and set up your development environment.",
      slug: "getting-started",
      order: 1,
      lessons: module1Lessons.map(lesson => lesson._id),
      estimatedHours: 8
    })

    // Create lessons for Module 2
    const module2Lessons = await Lesson.create([
      {
        title: "Introduction to JavaScript",
        description: "Learn the basics of JavaScript programming language.",
        slug: "introduction-to-javascript",
        order: 1,
        type: "lesson",
        content: `
# Introduction to JavaScript

JavaScript is a powerful programming language that adds interactivity to websites. It's one of the most popular programming languages in the world.

## What is JavaScript?

JavaScript is a high-level, interpreted programming language that was originally created to make web pages interactive. Today, it's used for:

- **Frontend Development**: Making websites interactive
- **Backend Development**: Building servers and APIs
- **Mobile Apps**: Creating mobile applications
- **Desktop Apps**: Building desktop software

## Why Learn JavaScript?

1. **Versatility**: Works on frontend, backend, and mobile
2. **Popularity**: One of the most in-demand skills
3. **Community**: Huge community and resources
4. **Job Market**: High demand for JavaScript developers

## Your First JavaScript Code

Let's write your first JavaScript code:

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

This simple line of code will print "Hello, World!" to the browser's console.

## How to Run JavaScript

### Method 1: Browser Console
1. Open your web browser
2. Press F12 to open Developer Tools
3. Go to the Console tab
4. Type your JavaScript code and press Enter

### Method 2: HTML File
Create an HTML file and add JavaScript:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>JavaScript Test</title>
</head>
<body>
    <h1>JavaScript Test</h1>
    <script>
        console.log("Hello from JavaScript!");
        alert("Welcome to JavaScript!");
    </script>
</body>
</html>
\`\`\`

## Basic Concepts

### Variables
Variables store data:

\`\`\`javascript
let name = "John";
const age = 25;
var city = "New York"; // Older syntax, avoid using
\`\`\`

### Data Types
JavaScript has several data types:

\`\`\`javascript
// String
let message = "Hello World";

// Number
let number = 42;
let decimal = 3.14;

// Boolean
let isTrue = true;
let isFalse = false;

// Array
let colors = ["red", "green", "blue"];

// Object
let person = {
    name: "John",
    age: 25
};

// Undefined
let notDefined;

// Null
let empty = null;
\`\`\`

### Functions
Functions are reusable blocks of code:

\`\`\`javascript
function greet(name) {
    return "Hello, " + name + "!";
}

// Call the function
console.log(greet("Alice")); // Output: Hello, Alice!
\`\`\`

## DOM Manipulation

JavaScript can interact with HTML elements:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>DOM Example</title>
</head>
<body>
    <h1 id="title">Hello World</h1>
    <button onclick="changeText()">Click Me</button>
    
    <script>
        function changeText() {
            document.getElementById("title").innerHTML = "Text Changed!";
        }
    </script>
</body>
</html>
\`\`\`

## Practice Exercises

1. **Console Output**: Use \`console.log()\` to print different types of data
2. **Variables**: Create variables with different data types
3. **Simple Function**: Write a function that adds two numbers
4. **DOM Interaction**: Create a button that changes text on a page

## Next Steps

In the next lesson, we'll dive deeper into JavaScript variables and data types!
        `,
        resources: [
          {
            title: "MDN JavaScript Guide",
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
            type: "article"
          },
          {
            title: "JavaScript Tutorial",
            url: "https://www.w3schools.com/js/",
            type: "article"
          }
        ],
        isPublished: true
      }
    ])

    // Create Module 2
    const module2 = await Module.create({
      title: "JavaScript Fundamentals",
      description: "Master JavaScript programming with modern ES6+ features and best practices.",
      slug: "javascript-fundamentals",
      order: 2,
      lessons: module2Lessons.map(lesson => lesson._id),
      estimatedHours: 12
    })

    // Create the course
    const course = await Course.create({
      title: "Fundamentals of Vibe Coding",
      description: "Master the basics of modern web development with hands-on projects and real-world applications. This comprehensive course covers everything from HTML and CSS to JavaScript, React, and modern development practices.",
      slug: "fundamentals-of-vibe-coding",
      order: 1,
      isPublished: true,
      modules: [module1._id, module2._id],
      estimatedHours: 120,
      prerequisites: []
    })

    console.log("Seed data created successfully!")
    console.log(`Created ${module1Lessons.length + module2Lessons.length} lessons`)
    console.log(`Created ${2} modules`)
    console.log(`Created ${1} course`)

    process.exit(0)
  } catch (error) {
    console.error("Error seeding data:", error)
    process.exit(1)
  }
}

seed() 