# Contributing to Project Vibe It

Thank you for your interest in contributing to Project Vibe It! This guide will help you get started with contributing to our open-source learning platform.

## Table of Contents

- [Getting Started](#getting-started)
- [Types of Contributions](#types-of-contributions)
- [Content Contribution](#content-contribution)
- [Code Contribution](#code-contribution)
- [Development Setup](#development-setup)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Code of Conduct](#code-of-conduct)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Git
- MongoDB (local or Atlas)

### Quick Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/project-vibe-it.git
   cd project-vibe-it
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

## Types of Contributions

We welcome various types of contributions:

### 🎓 Content Contributions
- **New Lessons**: Add educational content using MDX
- **Course Modules**: Create new learning modules
- **Complete Courses**: Develop full course curricula
- **Resource Updates**: Improve existing content and resources

### 💻 Code Contributions
- **New Features**: Implement platform enhancements
- **Bug Fixes**: Resolve issues and improve stability
- **UI/UX Improvements**: Enhance user interface and experience
- **Performance Optimizations**: Improve speed and efficiency

### 📚 Documentation
- **Guides**: Write tutorials and how-to guides
- **API Documentation**: Document endpoints and functions
- **Code Comments**: Add helpful comments to code
- **README Updates**: Improve project documentation

### 🐛 Bug Reports
- **Issue Reports**: Report bugs with detailed information
- **Feature Requests**: Suggest new features and improvements
- **Feedback**: Provide feedback on existing features

## Content Contribution

Our platform uses a **file-based content system** that makes it easy to add new courses, modules, and lessons. This is the most common type of contribution and doesn't require deep technical knowledge.

### Quick Start for Content

1. **Choose what to contribute:**
   - New lesson in existing module
   - New module in existing course
   - New course entirely

2. **Use our templates:**
   - 📖 [Content Contribution Guide](./docs/content-contribution.md) - Complete guide
   - ⚡ [Quick Start Guide](./docs/quick-start-guide.md) - Get started in minutes
   - 📝 [Lesson Template](./docs/lesson-template.mdx) - Copy-paste template

3. **Follow the structure:**
   ```
   content/courses/[course-slug]/
   ├── meta.json
   └── modules/
       └── [module-slug]/
           └── lessons/
               └── [lesson-name].mdx
   ```

4. **Validate your content:**
   ```bash
   pnpm validate-content
   ```

5. **Test locally:**
   ```bash
   pnpm dev
   # Navigate to your content at:
   # http://localhost:3001/courses/[course-slug]/[module-slug]/[lesson-slug]
   ```

### Content Guidelines

#### Writing Style
- **Clear and conversational**: Write as if explaining to a friend
- **Progressive complexity**: Start simple, build up to advanced concepts
- **Practical examples**: Include real-world applications
- **Hands-on learning**: Provide exercises and challenges

#### Technical Requirements
- **MDX format**: Use Markdown with frontmatter metadata
- **Syntax highlighting**: Specify language in code blocks
- **Resource links**: Include helpful external resources
- **Assignment structure**: Provide clear instructions and starter code

#### Quality Standards
- **Accuracy**: Ensure all information is correct and up-to-date
- **Completeness**: Provide comprehensive coverage of topics
- **Accessibility**: Use proper heading structure and alt text
- **Mobile-friendly**: Ensure content works on all devices

### Content Types

#### Lesson Types
- **`lesson`**: Standard learning content with theory and examples
- **`project`**: Hands-on project with practical application
- **`assignment`**: Structured assignment with submission requirements

#### Resource Types
- **`article`**: Blog posts, tutorials, documentation
- **`video`**: YouTube videos, course videos, screencasts
- **`tool`**: Online tools, playgrounds, generators
- **`documentation`**: Official documentation, API references

## Code Contribution

### Development Setup

1. **Fork and clone the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with conventional messages**
6. **Push and create a pull request**

### Code Standards

#### TypeScript
- Use strict typing throughout
- Prefer types over interfaces (except for inheritance)
- Avoid `any` type
- Use proper error handling

#### React/Next.js
- Use functional components with hooks
- Prefer server components when possible
- Follow Next.js App Router patterns
- Use proper TypeScript interfaces

#### Styling
- Use Tailwind CSS for styling
- Follow the existing design system
- Ensure responsive design
- Maintain accessibility standards

#### File Structure
- Use kebab-case for file names
- Follow the existing directory structure
- Group related components together
- Use descriptive names

### Testing

#### Manual Testing
```bash
# Start development server
pnpm dev

# Test your changes
# Navigate to relevant pages and test functionality
```

#### Content Validation
```bash
# Validate content structure
pnpm validate-content

# Check for linting errors
pnpm lint
```

#### Build Testing
```bash
# Test production build
pnpm build

# Start production server
pnpm start
```

## Pull Request Process

### Before Submitting

1. **Test your changes thoroughly**
2. **Validate content structure** (if adding content)
3. **Run linting and fix any issues**
4. **Update documentation** if needed
5. **Ensure all tests pass**

### PR Guidelines

#### Title Format
- **Content**: `feat: add [content type] - [brief description]`
- **Features**: `feat: add [feature name]`
- **Bug fixes**: `fix: [brief description]`
- **Documentation**: `docs: [brief description]`

#### Description Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Content addition
- [ ] Performance improvement
- [ ] Other (please describe)

## Changes Made
- [List specific changes]

## Testing
- [ ] Manual testing completed
- [ ] Content validation passed (if applicable)
- [ ] Linting passed
- [ ] Build successful

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Related Issues
Closes #[issue-number]
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests
2. **Code Review**: Maintainers review your changes
3. **Content Review**: Content team reviews educational value
4. **Final Approval**: Changes are approved and merged

## Development Workflow

### Branch Strategy

- **`main`**: Production-ready code
- **`develop`**: Integration branch for features
- **`feature/*`**: Individual feature branches
- **`hotfix/*`**: Critical bug fixes

### Commit Messages

Use conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `content`: Content-related changes
- `documentation`: Documentation updates
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed

## Getting Help

### Community Resources

- **Discord**: Join our community server for real-time help
- **GitHub Issues**: Open issues for bugs or questions
- **GitHub Discussions**: Ask questions and share ideas
- **Documentation**: Check our comprehensive guides

### Mentorship

- **New Contributors**: We provide mentorship for first-time contributors
- **Code Reviews**: Detailed feedback on your contributions
- **Pair Programming**: Collaborative coding sessions
- **Office Hours**: Regular Q&A sessions

## Recognition

### Contributor Recognition

- **GitHub Contributors**: Your commits appear in the repository
- **Content Credits**: Attribution in lesson content
- **Community Recognition**: Featured in Discord and social media
- **Contributor Hall of Fame**: Listed in project documentation

### Contribution Levels

- **Bronze**: 1-5 contributions
- **Silver**: 6-15 contributions
- **Gold**: 16+ contributions
- **Platinum**: Significant impact on the project

## Code of Conduct

### Our Standards

- **Be respectful**: Treat everyone with respect
- **Be inclusive**: Welcome contributors from all backgrounds
- **Be constructive**: Provide helpful, constructive feedback
- **Be collaborative**: Work together to improve the project

### Enforcement

- **Reporting**: Report violations to project maintainers
- **Investigation**: Issues are investigated promptly
- **Action**: Appropriate action is taken based on severity
- **Appeal**: Decisions can be appealed to the project team

## License

By contributing to Project Vibe It, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Project Vibe It!** 🚀

Your contributions help make learning web development accessible to everyone. Whether you're adding content, fixing bugs, or improving features, every contribution makes a difference.

**Questions?** Join our [Discord community](https://discord.gg/projectvibeit) or open a [GitHub issue](https://github.com/yourusername/project-vibe-it/issues). 