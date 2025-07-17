# Project Vibe It: Open Source Platform Plan

## Tech Stack
- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: Auth.js v5
- **Deployment**: Vercel (free tier)
- **Repository**: GitHub (public)

## Core Features (MVP)

### 1. User Management
- Sign up/Sign in with Credentials, GitHub, Google
- User profiles with progress tracking
- Simple role system (student, contributor, admin)

### 2. Curriculum Structure
- Hierarchical content: Courses → Modules → Lessons (we can have multiple curriculum)
- Progress tracking per lesson/module
- Project submissions with GitHub integration

### 3. Learning Experience
- Markdown-based lesson content (Optimal User experience - inspired by that of the odins project)
- External resource links (allow embedding of youtube/vimeo or other videos, immages aand audio)
- Project details, prompt templates and starter code (when provided)
- Progress visualization

### 4. Community Features
- Simple discussion system per lesson
- Project showcase
- Basic user interactions (likes, bookmarks)

## Database Schema

### User Model
```typescript
interface User {
  _id: ObjectId;
  email: string;
  name: string;
  avatar?: string;
  githubUsername?: string;
  role: 'student' | 'contributor' | 'admin';
  progress: {
    courseId: string;
    moduleId: string;
    lessonId: string;
    completedLessons: string[];
    completedProjects: string[];
    totalProgress: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Course Model
```typescript
interface Course {
  _id: ObjectId;
  title: string;
  description: string;
  slug: string;
  order: number;
  isPublished: boolean;
  modules: ObjectId[];
  estimatedHours: number;
  prerequisites: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Module Model
```typescript
interface Module {
  _id: ObjectId;
  title: string;
  description: string;
  slug: string;
  courseId: ObjectId;
  order: number;
  lessons: ObjectId[];
  estimatedHours: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Lesson Model
```typescript
interface Lesson {
  _id: ObjectId;
  title: string;
  description: string;
  slug: string;
  moduleId: ObjectId;
  order: number;
  type: 'lesson' | 'project' | 'assignment';
  content: string; // Markdown
  resources: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'tool' | 'documentation';
  }[];
  assignment?: {
    title: string;
    description: string;
    instructions: string;
    submissionType: 'github' | 'url' | 'text';
    starterCode?: string;
  };
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Project Submission Model
```typescript
interface ProjectSubmission {
  _id: ObjectId;
  userId: ObjectId;
  lessonId: ObjectId;
  submissionUrl: string;
  submissionType: 'github' | 'url' | 'text';
  submissionData: string; // JSON string
  status: 'submitted' | 'reviewed' | 'completed';
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Discussion Model
```typescript
interface Discussion {
  _id: ObjectId;
  lessonId: ObjectId;
  userId: ObjectId;
  content: string;
  replies: {
    userId: ObjectId;
    content: string;
    createdAt: Date;
  }[];
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Folder Structure

```
project-vibe-it/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── dashboard/
│   │   ├── courses/
│   │   │   └── [courseSlug]/
│   │   │       └── [moduleSlug]/
│   │   │           └── [lessonSlug]/
│   │   ├── profile/
│   │   ├── projects/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── courses/
│   │   │   ├── progress/
│   │   │   └── submissions/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/ (shadcn/ui components)
│   │   ├── layout/
│   │   ├── curriculum/
│   │   ├── progress/
│   │   └── community/
│   ├── lib/
│   │   ├── db.ts
│   │   ├── auth.ts
│   │   ├── utils.ts
│   │   └── validations.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Course.ts
│   │   ├── Module.ts
│   │   ├── Lesson.ts
│   │   └── Submission.ts
│   └── types/
│       └── index.ts
├── public/
├── content/
│   └── courses/
│       └── fundamentals-of-vibe-coding/
│           ├── meta.json
│           └── modules/
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Development Phases

### Phase 1: Foundation (Weeks 1-2)
**Goal**: Basic platform with authentication and course structure

**Tasks**:
- [ ] Set up Next.js project with TypeScript and Tailwind
- [ ] Configure MongoDB connection with Mongoose
- [ ] Implement Auth.js v5 with Credentials and GitHub/Google providers
- [ ] Create basic database models
- [ ] Build landing page and authentication pages
- [ ] Set up basic navigation and layout

### Phase 2: Core Learning Experience (Weeks 3-4)
**Goal**: Students can view and progress through curriculum

**Tasks**:
- [ ] Create course/module/lesson pages
- [ ] Implement progress tracking system
- [ ] Build markdown content renderer
- [ ] Add external resource links
- [ ] Create user dashboard
- [ ] Basic project submission system

### Phase 3: Community Features (Weeks 5-6)
**Goal**: Students can interact and share projects

**Tasks**:
- [ ] Discussion system for lessons
- [ ] Project showcase gallery
- [ ] User profiles with project portfolio
- [ ] Simple like/bookmark system
- [ ] Search functionality

### Phase 4: Content & Polish (Weeks 7-8)
**Goal**: Add actual curriculum content and improve UX

**Tasks**:
- [ ] Create "Fundamentals of Vibe Coding" course content
- [ ] Add comprehensive project templates
- [ ] Implement mobile responsiveness
- [ ] Add error handling and loading states
- [ ] Create admin panel for content management

## Key Pages & Components

### 1. Dashboard (`/dashboard`)
- Progress overview
- Continue learning CTA
- Recent projects
- Community highlights

### 2. Course Page (`/courses/[courseSlug]`)
- Course overview
- Module list with progress
- Prerequisites check
- Enrollment/start button

### 3. Lesson Page (`/courses/[courseSlug]/[moduleSlug]/[lessonSlug]`)
- Lesson content (markdown)
- Resource links
- Assignment instructions
- Progress navigation
- Discussion section

### 4. Project Submission (`/projects/submit`)
- GitHub repo link input
- Live demo URL
- Description/reflection
- Submission confirmation

### 5. Profile Page (`/profile/[username]`)
- User info and stats
- Completed projects showcase
- Learning progress
- GitHub integration

## Open Source Strategy

### Repository Structure
```
project-vibe-it/
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE (MIT)
├── README.md
├── CHANGELOG.md
└── docs/
    ├── setup.md
    ├── contributing.md
    └── deployment.md
```

### Contribution Guidelines
- **Code**: TypeScript, ESLint, Prettier
- **Content**: Markdown-based curriculum
- **Issues**: Bug reports, feature requests, content suggestions
- **PRs**: Code improvements, new lessons, bug fixes

### Community Building
- **Discord server** for real-time collaboration
- **GitHub Discussions** for long-form conversations
- **Twitter** for updates and community highlights
- **Blog** for development journey and learnings

## Content Strategy

### Initial Course: "Fundamentals of Vibe Coding"
**Structure**: 8 modules, 40+ lessons, 8 projects

**Content Format**:
```markdown
# Lesson: Introduction to Bolt.new

## Learning Objectives
- Understand what Bolt.new is and how it works
- Create your first project using Bolt.new
- Deploy a simple web application

## Resources
- [Bolt.new Official Documentation](https://bolt.new/docs)
- [YouTube: Building with Bolt.new](https://youtube.com/...)
- [Article: Vibe Coding Best Practices](https://...)

## Assignment
Create a personal portfolio website using Bolt.new that includes:
- About section
- Skills showcase
- Contact form
- Responsive design

### Submission Requirements
- GitHub repository link
- Live demo URL
- Brief reflection (what you learned, challenges faced)

## Discussion
Share your portfolio and get feedback from the community!
```

### Content Creation Workflow
1. **Planning**: Outline lesson objectives and resources
2. **Drafting**: Write markdown content
3. **Review**: Community feedback and testing
4. **Publishing**: Merge to main branch
5. **Iteration**: Update based on student feedback

## Deployment & Infrastructure

### Free Tier Setup
- **Vercel**: Frontend hosting and serverless functions
- **MongoDB Atlas**: Database (free 512MB cluster)
- **GitHub**: Repository hosting and CI/CD
- **Cloudinary**: Image hosting (if needed)

### Environment Variables
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
MONGODB_URI=mongodb+srv://...
GITHUB_ID=your-github-app-id
GITHUB_SECRET=your-github-app-secret
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
```

## Success Metrics

### Technical Metrics
- GitHub stars and forks
- Monthly active users
- Course completion rates
- Project submissions

### Community Metrics
- Discord members
- GitHub contributors
- Content contributions
- User-generated projects

### Learning Outcomes
- Students landing jobs
- Successful project launches
- Skill assessments
- Community testimonials

## Getting Started

### 1. Set up the repository
```bash
npx create-next-app@latest project-vibe-it --typescript --tailwind --app
cd project-vibe-it
npm install mongoose @auth/mongodb-adapter next-auth@beta
```

### 2. Create basic project structure
- Set up database models
- Configure Auth.js
- Create initial pages and components

### 3. Build MVP
- Focus on core learning experience
- Get first few lessons working
- Deploy to Vercel

### 4. Launch community
- Create GitHub repository
- Set up Discord server
- Recruit initial contributors

### 5. Iterate and improve
- Gather user feedback
- Add features based on needs
- Grow the community

## Next Steps

1. **Validate the concept** - Create a detailed project roadmap
2. **Set up development environment** - Initialize the repository
3. **Build core features** - Focus on the learning experience
4. **Create initial content** - First module of the curriculum
5. **Launch MVP** - Get feedback from early users
6. **Grow community** - Attract contributors and learner
