# Contributing to Project Vibe It

Thank you for your interest in contributing to Project Vibe It! We're excited to have you join our community of developers, designers, and content creators.

## 🤝 How to Contribute

There are many ways to contribute to Project Vibe It:

### 🐛 Bug Reports
Found a bug? Please report it by creating an issue on GitHub with:
- A clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/device information

### 💡 Feature Requests
Have an idea for a new feature? We'd love to hear it! Create an issue with:
- A clear description of the feature
- Why this feature would be useful
- Any mockups or examples

### 📝 Content Contributions
Help improve our learning materials:
- Fix typos and grammar errors
- Improve lesson clarity
- Add new examples or explanations
- Create new lessons or projects
- Update outdated information

### 💻 Code Contributions
Want to help with the platform itself?
- Fix bugs
- Add new features
- Improve performance
- Enhance accessibility
- Update dependencies

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Git

### Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/projectvibeit.git
   cd projectvibeit
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Copy the environment file:
   ```bash
   cp env.example .env.local
   ```
5. Start the development server:
   ```bash
   pnpm dev
   ```

### Making Changes
1. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Test your changes thoroughly
4. Commit your changes with a clear message:
   ```bash
   git commit -m "feat: add new feature description"
   ```
5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Create a Pull Request

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows the project's style guidelines
- [ ] All tests pass
- [ ] Documentation is updated (if applicable)
- [ ] Changes are tested in both light and dark modes
- [ ] Accessibility is maintained

### PR Title Format
Use conventional commits format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### PR Description
Include:
- What changes were made
- Why the changes were made
- How to test the changes
- Screenshots (for UI changes)

## 🎨 Style Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### UI/UX Guidelines
- Follow the established design system
- Use the green color palette consistently
- Ensure accessibility (WCAG AA compliance)
- Test on multiple screen sizes
- Maintain dark mode support

### Content Guidelines
- Write clear, concise explanations
- Use active voice
- Include practical examples
- Keep lessons focused and digestible
- Use consistent terminology

## 🏗️ Project Structure

```
projectvibeit/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utility functions and configurations
│   └── providers/           # React context providers
├── content/                 # Course content (MDX files)
├── docs/                    # Documentation
├── public/                  # Static assets
└── scripts/                 # Build and utility scripts
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Testing Guidelines
- Write tests for new features
- Ensure existing tests still pass
- Test both success and error cases
- Test accessibility features

## 📚 Documentation

### Code Documentation
- Use JSDoc comments for functions and classes
- Include parameter types and return values
- Add examples for complex functions

### User Documentation
- Keep documentation up to date
- Use clear, simple language
- Include screenshots when helpful
- Provide step-by-step instructions

## 🎯 Areas That Need Help

### High Priority
- [ ] Content review and improvements
- [ ] Accessibility enhancements
- [ ] Performance optimizations
- [ ] Mobile responsiveness
- [ ] Error handling improvements

### Medium Priority
- [ ] Additional course content
- [ ] UI/UX improvements
- [ ] Testing coverage
- [ ] Documentation updates
- [ ] Internationalization

### Low Priority
- [ ] New features
- [ ] Advanced integrations
- [ ] Analytics improvements
- [ ] SEO optimizations

## 🤝 Community Guidelines

### Be Respectful
- Treat all contributors with respect
- Be patient with newcomers
- Provide constructive feedback
- Avoid personal attacks or criticism

### Be Helpful
- Answer questions when you can
- Share your knowledge and experience
- Help review others' contributions
- Welcome new contributors

### Be Professional
- Use clear, professional language
- Follow the project's code of conduct
- Respect project maintainers' decisions
- Be open to feedback and suggestions

## 📞 Getting Help

### Questions?
- Check the [FAQ](link-to-faq)
- Search existing issues
- Ask in our [Discord community](link-to-discord)
- Create a new issue for bugs or feature requests

### Need Guidance?
- Join our [Discord server](link-to-discord)
- Check out our [development roadmap](link-to-roadmap)
- Review existing PRs for examples
- Ask maintainers for help

## 🏆 Recognition

We appreciate all contributions! Contributors will be:
- Listed in our [contributors file](CONTRIBUTORS.md)
- Mentioned in release notes
- Invited to join our core team (for significant contributions)
- Featured in our community highlights

## 📄 License

By contributing to Project Vibe It, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Project Vibe It! Your help makes this platform better for everyone. 🌟 