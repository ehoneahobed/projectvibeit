# Project Vibe It 🌱

A modern, **open-source** learning platform inspired by The Odin Project, designed to teach web development with hands-on projects and a supportive community. **Free forever, built by developers for developers.**

[![Open Source](https://img.shields.io/badge/Open%20Source-100%25-green?style=for-the-badge&logo=github)](https://github.com/your-username/projectvibeit)
[![Contributors](https://img.shields.io/badge/Contributors-50+-blue?style=for-the-badge&logo=github)](https://github.com/your-username/projectvibeit/graphs/contributors)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

## 🎯 Mission

We believe education should be accessible to everyone. That's why we're building the future of learning in the open - free forever, community-driven, and built by developers for developers.

## ✨ Why Open Source Learning?

- **🆓 Free Forever**: No hidden costs, no premium tiers
- **🤝 Community Driven**: Built by developers, for developers
- **⚡ Always Up-to-Date**: Learn the latest technologies as they emerge
- **🎯 Real Projects**: Build portfolio-worthy projects
- **🔗 GitHub Integration**: Submit projects directly from your repositories
- **📚 Modern Curriculum**: Comprehensive learning paths from beginner to advanced

## 🚀 Features

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

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/projectvibeit.git
   cd projectvibeit
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
projectvibeit/
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
├── content/                   # Course content (MDX files)
├── scripts/                   # Database seeding and utilities
├── public/                    # Static assets
└── docs/                      # Documentation
```

## 🗄️ Database Schema

### Core Models

- **User**: User accounts with progress tracking and role-based permissions
- **Course**: Learning paths with modules and lessons
- **Module**: Course sections containing lessons
- **Lesson**: Individual learning units with content
- **ProjectSubmission**: Student project submissions
- **Discussion**: Course-based Q&A discussions with community support

## 👥 User Roles & Permissions

The platform implements a three-tier role system to support both learners and contributors:

- **Student** (Default): Access courses, track progress, participate in community
- **Contributor**: Create/edit content, moderate discussions, review projects
- **Admin**: Full platform access, user management, analytics, system settings

See [Roles & Permissions Guide](./docs/roles-and-permissions.md) for detailed information.

## 💬 Discussion System

The platform includes a comprehensive discussion system that enables collaborative learning:

### For Students
- **Ask Questions**: Create discussions on any lesson to get help
- **Community Support**: Reply to other students' questions
- **Track Progress**: See resolved discussions and learning history
- **Easy Navigation**: Discussions are integrated into lesson pages

### For Admins & Contributors
- **Moderation Tools**: Manage all discussions across courses
- **Analytics Dashboard**: View discussion statistics and engagement
- **Search & Filter**: Find specific discussions by content or status
- **Resolve Discussions**: Mark questions as resolved when answered

See [Discussion System Guide](./docs/discussion-system.md) for detailed information.

## 🎨 Design System

The platform uses a modern design system built with:
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **Lucide Icons**: Beautiful, customizable icons
- **Custom Components**: Platform-specific UI elements
- **Green Color Palette**: Modern, accessible color scheme

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

# Role Management
pnpm run create-admin      # Create an admin user
pnpm run create-contributor # Create a contributor user
```

### Code Style

- **TypeScript**: Strict typing throughout the codebase
- **ESLint**: Code linting with Next.js configuration
- **Prettier**: Code formatting
- **Conventional Commits**: Standardized commit messages

## 🤝 Contributing

We welcome contributions from developers, designers, and content creators! Here's how you can help:

### Ways to Contribute

- **🐛 Bug Reports**: Help us identify and fix issues
- **💡 Feature Requests**: Suggest new features and improvements
- **📝 Content**: Improve lessons, add examples, fix typos
- **💻 Code**: Fix bugs, add features, improve performance
- **🎨 Design**: Enhance UI/UX, improve accessibility
- **📚 Documentation**: Update docs, add guides, improve clarity

### Quick Start for Contributors

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow our [style guidelines](./docs/contributing.md#style-guidelines)
4. **Test your changes**: Ensure everything works correctly
5. **Commit your changes**: Use [conventional commit messages](./docs/contributing.md#pr-title-format)
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**: Describe your changes clearly

### Areas That Need Help

**High Priority:**
- Content review and improvements
- Accessibility enhancements
- Performance optimizations
- Mobile responsiveness
- Error handling improvements

**Medium Priority:**
- Additional course content
- UI/UX improvements
- Testing coverage
- Documentation updates
- Internationalization

See our [Contributing Guide](./docs/contributing.md) for detailed information.

## 🌟 Community

- **Discord**: [Join our community](https://discord.gg/your-discord)
- **GitHub Discussions**: [Start a discussion](https://github.com/your-username/projectvibeit/discussions)
- **Issues**: [Report bugs or request features](https://github.com/your-username/projectvibeit/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [The Odin Project](https://www.theodinproject.com/)
- Built with [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Components by [shadcn/ui](https://ui.shadcn.com/)

---

**Built with ❤️ by the open source community**

[![GitHub stars](https://img.shields.io/github/stars/your-username/projectvibeit?style=social)](https://github.com/your-username/projectvibeit)
[![GitHub forks](https://img.shields.io/github/forks/your-username/projectvibeit?style=social)](https://github.com/your-username/projectvibeit)
[![GitHub issues](https://img.shields.io/github/issues/your-username/projectvibeit)](https://github.com/your-username/projectvibeit/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/your-username/projectvibeit)](https://github.com/your-username/projectvibeit/pulls)
