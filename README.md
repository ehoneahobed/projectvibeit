# Project Vibe It 🚀

A modern, open-source learning platform inspired by The Odin Project, designed to teach web development with hands-on projects and a supportive community.

## ✨ Features

- **Structured Learning Paths**: Carefully crafted curriculum from beginner to advanced
- **Interactive Lessons**: MDX-based content with embedded resources and syntax highlighting
- **Project-Based Learning**: Real-world projects to build your portfolio
- **Progress Tracking**: Monitor your learning journey with detailed analytics
- **Community Features**: Discussion forums and project showcases
- **Open Source Content**: Contribute to curriculum through GitHub pull requests
- **Modern Tech Stack**: Built with Next.js 15, TypeScript, and MongoDB
- **Responsive Design**: Beautiful UI that works on all devices
- **GitHub Integration**: Submit projects directly from your repositories

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: Auth.js v5
- **Deployment**: Vercel (free tier)
- **Package Manager**: pnpm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- MongoDB database (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/project-vibe-it.git
   cd project-vibe-it
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Authentication
   AUTH_SECRET=your_auth_secret_key
   NEXTAUTH_URL=http://localhost:3001
   
   # OAuth Providers (optional)
   AUTH_GITHUB_CLIENT_ID=your_github_client_id
   AUTH_GITHUB_CLIENT_SECRET=your_github_client_secret
   AUTH_GOOGLE_CLIENT_ID=your_google_client_id
   AUTH_GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Email (optional)
   RESEND_API_KEY=your_resend_api_key
   SENDER_EMAIL_ADDRESS=noreply@yourdomain.com
   ```

4. **Seed the database with initial data**
   ```bash
   pnpm seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 📚 Available Courses

### Fundamentals of Vibe Coding
- **Duration**: 120 hours
- **Modules**: 8
- **Lessons**: 40+
- **Projects**: 8

**What you'll learn:**
- HTML & CSS fundamentals
- JavaScript and modern ES6+ features
- React and Next.js development
- Database design and API development
- Deployment and DevOps basics

## 🏗️ Project Structure

```
project-vibe-it/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── courses/           # Course pages
│   │   ├── dashboard/         # User dashboard
│   │   └── ...
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── auth/             # Authentication components
│   │   └── ...
│   ├── lib/                   # Utility functions and configurations
│   │   ├── models/           # Database models
│   │   ├── auth/             # Authentication configuration
│   │   └── ...
│   └── providers/             # React context providers
├── scripts/                   # Database seeding and utilities
├── public/                    # Static assets
└── docs/                      # Documentation
```

## 🗄️ Database Schema

### Core Models

- **User**: User accounts with progress tracking
- **Course**: Learning paths with modules and lessons
- **Module**: Course sections containing lessons
- **Lesson**: Individual learning units with content
- **ProjectSubmission**: Student project submissions
- **Discussion**: Community discussions per lesson

## 🎨 Design System

The platform uses a modern design system built with:
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **Lucide Icons**: Beautiful, customizable icons
- **Custom Components**: Platform-specific UI elements

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm seed             # Seed database with initial data
```

### Code Style

- **TypeScript**: Strict typing throughout the codebase
- **ESLint**: Code linting with Next.js configuration
- **Prettier**: Code formatting
- **Conventional Commits**: Standardized commit messages

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Contributing Guidelines

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the coding standards
4. **Test your changes**: Ensure everything works correctly
5. **Commit your changes**: Use conventional commit messages
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**: Describe your changes clearly

### Areas to Contribute

- **Content**: Add new lessons, courses, or improve existing content using MDX
- **Features**: Implement new platform features
- **UI/UX**: Improve the user interface and experience
- **Bug Fixes**: Fix issues and improve stability
- **Documentation**: Improve documentation and guides

### Content Contribution

Our platform uses a **file-based content system** that makes it easy to add new courses, modules, and lessons. The system automatically loads MDX content with rich features like syntax highlighting, resources, and assignments.

#### Quick Start
- **New Lesson**: Create an `.mdx` file with frontmatter metadata
- **New Module**: Add directory structure and update course metadata
- **New Course**: Create course directory with `meta.json` file

#### Documentation
- 📖 [Content Contribution Guide](./docs/content-contribution.md) - Complete guide for contributors
- ⚡ [Quick Start Guide](./docs/quick-start-guide.md) - Get started in minutes
- 📝 [Lesson Template](./docs/lesson-template.mdx) - Copy-paste template for new lessons

#### Content Features
- **MDX Support**: Write content with Markdown + React components
- **Syntax Highlighting**: Automatic code highlighting with copy functionality
- **Resource Cards**: Embed articles, videos, tools, and documentation
- **Assignment System**: Structured assignments with starter code
- **Order Management**: Automatic navigation based on metadata
- **Version Control**: All content is tracked in Git

#### Example: Adding a Lesson
```bash
# 1. Create lesson file
touch content/courses/fundamentals-of-vibe-coding/modules/html-fundamentals/lessons/my-new-lesson.mdx

# 2. Add content with frontmatter
---
title: "My New Lesson"
description: "Learn something amazing"
type: "lesson"
order: 1
---

# My New Lesson
Your content here...

# 3. Update course metadata
# 4. Test with pnpm dev
# 5. Submit PR
```

See our [Content Contribution Guide](./docs/content-contribution.md) for detailed instructions.

## 📖 Documentation

- [Setup Guide](./docs/setup.md) - Detailed setup instructions
- [Contributing Guide](./docs/contributing.md) - How to contribute
- [Content Guidelines](./docs/content.md) - Writing lesson content
- [API Documentation](./docs/api.md) - API endpoints reference

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on every push to main

### Other Platforms

The platform can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **The Odin Project** - Inspiration for the learning platform concept
- **shadcn/ui** - Beautiful component library
- **Next.js Team** - Amazing React framework
- **Vercel** - Excellent hosting and deployment platform

## 📞 Support

- **Discord**: Join our community server
- **GitHub Issues**: Report bugs and request features
- **Email**: support@projectvibeit.com

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/project-vibe-it&type=Date)](https://star-history.com/#yourusername/project-vibe-it&Date)

---

**Built with ❤️ by the Project Vibe It community**
