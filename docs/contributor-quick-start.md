# Contributor Quick Start Guide

Welcome to Project Vibe It! This guide will help you get started as a contributor to our open-source learning platform.

## 🎯 What is a Contributor?

Contributors are community members who help create and maintain the learning content on Project Vibe It. As a contributor, you can:

- ✅ Create and edit course content
- ✅ Write lessons and tutorials
- ✅ Moderate community discussions
- ✅ Review student project submissions
- ✅ Access the admin portal for content management
- ✅ Help shape the platform's curriculum

## 🚀 Getting Started

### 1. Prerequisites

Before you can contribute content, you need:

- A GitHub account
- Basic knowledge of Markdown/MDX
- Understanding of web development concepts
- Familiarity with the platform's content structure

### 2. Role Assignment

To become a contributor:

1. **Join the Community**: Participate in discussions and show your expertise
2. **Submit Quality Content**: Create well-written, helpful content
3. **Get Approved**: Existing contributors/admins will review your work
4. **Role Assignment**: An admin will assign you the contributor role

### 3. Access the Admin Portal

Once you have contributor access:

1. **Sign in** to your account
2. **Navigate to** `/portal` (admin portal)
3. **Explore** the content management tools
4. **Start creating** your first lesson

## 📝 Creating Content

### Content Types

You can create several types of content:

- **Lessons**: Individual learning units with tutorials and examples
- **Projects**: Hands-on assignments for students
- **Resources**: Articles, videos, and documentation links
- **Discussions**: Community engagement topics

### Content Guidelines

Follow these guidelines for quality content:

- **Clear Structure**: Use proper headings and organization
- **Code Examples**: Include working, well-commented code
- **Progressive Difficulty**: Build from basic to advanced concepts
- **Real-world Context**: Explain why concepts matter
- **Accessibility**: Write for diverse learning styles

### File Structure

Content is organized in a file-based system:

```
content/courses/
└── course-name/
    ├── meta.json
    └── modules/
        └── module-name/
            └── lessons/
                └── lesson-name.mdx
```

### MDX Format

Lessons use MDX (Markdown + JSX) format:

```mdx
---
title: "Your Lesson Title"
description: "Brief description of what students will learn"
type: "lesson"
order: 1
---

# Your Lesson Title

## Introduction

Your lesson content here...

## Code Example

```javascript
// Your code example
console.log("Hello, World!");
```

## Assignment

Create a project that demonstrates...
```

## 🔧 Admin Portal Features

### Course Management

- **View All Courses**: See existing courses and their structure
- **Add New Courses**: Create new learning paths
- **Edit Content**: Modify existing lessons and modules
- **Content Organization**: Manage lesson order and structure

### Community Management

- **Discussions**: Moderate community conversations
- **Project Showcase**: Review and approve student projects
- **Feedback**: Respond to student questions and concerns

### Content Tools

- **Syntax Highlighting**: Automatic code highlighting
- **Resource Cards**: Embed external resources
- **Progress Tracking**: Monitor student engagement
- **Version Control**: All changes tracked in Git

## 🤝 Community Guidelines

### Collaboration

- **Review Process**: All content goes through peer review
- **Feedback**: Be open to suggestions and improvements
- **Consistency**: Follow established patterns and styles
- **Documentation**: Keep content up-to-date and accurate

### Communication

- **GitHub Issues**: Report bugs and request features
- **Discord**: Join community discussions
- **Pull Requests**: Submit content changes
- **Code Reviews**: Participate in content reviews

### Quality Standards

- **Accuracy**: Ensure all information is correct and current
- **Clarity**: Write for beginners, explain complex concepts simply
- **Completeness**: Provide comprehensive coverage of topics
- **Engagement**: Make content interesting and interactive

## 📚 Learning Resources

### For Contributors

- [Content Contribution Guide](./content-contribution.md) - Detailed content creation guide
- [Lesson Template](./lesson-template.mdx) - Copy-paste template for new lessons
- [Roles & Permissions](./roles-and-permissions.md) - Complete role system documentation

### Platform Features

- **MDX Support**: Write content with Markdown + React components
- **Syntax Highlighting**: Automatic code highlighting with copy functionality
- **Resource Cards**: Embed articles, videos, tools, and documentation
- **Assignment System**: Structured assignments with starter code
- **Progress Tracking**: Monitor student learning progress

## 🎯 Best Practices

### Content Creation

1. **Start Small**: Begin with simple lessons before tackling complex topics
2. **Test Everything**: Ensure all code examples work correctly
3. **Get Feedback**: Share drafts with other contributors
4. **Iterate**: Improve content based on student feedback

### Community Engagement

1. **Be Helpful**: Answer questions and provide guidance
2. **Stay Active**: Regular participation builds community
3. **Mentor Others**: Help new contributors learn the ropes
4. **Share Knowledge**: Contribute to discussions and documentation

### Quality Assurance

1. **Review Your Work**: Check for errors and clarity
2. **Follow Standards**: Use established patterns and conventions
3. **Update Regularly**: Keep content current with technology changes
4. **Gather Feedback**: Listen to student and community input

## 🚨 Common Issues

### Permission Problems

If you can't access contributor features:

1. **Check Your Role**: Ensure you have contributor permissions
2. **Contact Admin**: Reach out if role assignment is needed
3. **Verify Login**: Make sure you're signed in with the correct account

### Content Issues

If content isn't displaying correctly:

1. **Check MDX Syntax**: Ensure proper frontmatter and formatting
2. **Validate Structure**: Verify file organization and naming
3. **Test Locally**: Use `pnpm dev` to preview changes
4. **Check Console**: Look for error messages in browser console

## 📞 Getting Help

### Support Channels

- **GitHub Issues**: Technical problems and feature requests
- **Discord**: Community discussions and quick questions
- **Email**: admin@projectvibeit.com for urgent issues

### Documentation

- **This Guide**: Quick reference for contributors
- **Content Guide**: Detailed content creation instructions
- **Role Documentation**: Complete permissions and access information

## 🎉 Next Steps

1. **Explore the Platform**: Familiarize yourself with existing content
2. **Join Discussions**: Participate in community conversations
3. **Start Small**: Create your first lesson or resource
4. **Build Relationships**: Connect with other contributors
5. **Grow Your Skills**: Learn from feedback and collaboration

Welcome to the Project Vibe It contributor community! We're excited to see what you'll create.

---

**Need Help?** Check our [full documentation](./content-contribution.md) or reach out in our [Discord community](https://discord.gg/projectvibeit). 