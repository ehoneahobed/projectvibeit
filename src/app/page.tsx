import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  ArrowRight, 
  BookOpen, 
  Code, 
  Users, 
  Trophy, 
  Github, 
  Globe, 
  Shield,
  Sparkles,
  CheckCircle,
  Zap,
  Play
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-foreground">VibeIt</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6" aria-label="Hero section">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <div className="space-y-8 mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight tracking-tight">
              Learn to Build
              <br />
              <span className="text-primary">Anything</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Master AI-assisted coding with step-by-step lessons and hands-on projects. 
              From zero to hero, completely free.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Button asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium rounded-lg transition-colors"
            >
              <Link href="/courses" className="flex items-center">
                <Play className="mr-2 w-5 h-5" />
                Start Learning Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            
            <Button asChild
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-accent hover:text-accent-foreground px-8 py-4 text-lg font-medium rounded-lg transition-colors"
            >
              <Link href="https://github.com/your-username/projectvibeit" target="_blank" rel="noopener noreferrer" className="flex items-center">
                <Github className="mr-2 w-5 h-5" />
                View on GitHub
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 mt-12">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-medium">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Code className="w-5 h-5 text-primary" />
              <span className="font-medium">No Experience Required</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="font-medium">Cross-Platform</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why AI-Assisted Section */}
      <section className="py-20 bg-card/90 dark:bg-slate-950/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Why AI-Assisted Learning?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We believe anyone can build amazing things with the right tools. That&apos;s why we&apos;re making AI-assisted coding accessible to everyone, regardless of experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-card/95 dark:bg-slate-950/95 backdrop-blur-sm border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center mb-4 border border-primary/20 dark:border-primary/30">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-card-foreground">Free Forever</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  No hidden costs, no premium tiers. Everything we build is free and open source.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-card/95 dark:bg-slate-950/95 backdrop-blur-sm border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4 border border-blue-200 dark:border-blue-700">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl text-card-foreground">Community Driven</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Built by creators, for creators. Your contributions shape the platform.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-card/95 dark:bg-slate-950/95 backdrop-blur-sm border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 dark:bg-accent/20 rounded-xl flex items-center justify-center mb-4 border border-accent/20 dark:border-accent/30">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl text-card-foreground">Always Up-to-Date</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Learn the latest AI tools and coding practices as they emerge, not outdated content.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-card/95 dark:bg-slate-950/95 backdrop-blur-sm border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center mb-4 border border-amber-200 dark:border-amber-700">
                  <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-xl text-card-foreground">Cross-Platform Projects</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Build portfolio-worthy projects across web, mobile, and desktop platforms.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-card/95 dark:bg-slate-950/95 backdrop-blur-sm border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center mb-4 border border-red-200 dark:border-red-700">
                  <Github className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-xl text-card-foreground">GitHub Integration</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Submit projects directly from GitHub and showcase your work to the world.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-card/95 dark:bg-slate-950/95 backdrop-blur-sm border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 rounded-xl flex items-center justify-center mb-4 border border-teal-200 dark:border-teal-700">
                  <Globe className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <CardTitle className="text-xl text-card-foreground">AI-Powered Learning</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Learn to leverage AI tools and assistants to code faster and more efficiently.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Course Section */}
      <section className="py-20 bg-background/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Start Your Journey
            </h2>
            <p className="text-xl text-muted-foreground">
              Begin with our comprehensive fundamentals course
            </p>
          </div>

          <Card className="max-w-5xl mx-auto border-0 shadow-2xl bg-card/95 dark:bg-slate-950/95 backdrop-blur-sm border-border overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 lg:p-12">
                <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary border-primary/20 dark:border-primary/30">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Fundamentals Course
                </Badge>
                <CardTitle className="text-3xl md:text-4xl text-primary mb-4">
                  Fundamentals of Vibe Coding
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mb-6">
                  Master AI-assisted coding fundamentals with hands-on projects across web, mobile, and desktop platforms.
                </CardDescription>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-5 h-5 mr-3 text-primary" />
                    <span>8 comprehensive modules</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-5 h-5 mr-3 text-primary" />
                    <span>40+ interactive lessons</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-5 h-5 mr-3 text-primary" />
                    <span>8 portfolio projects</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-5 h-5 mr-3 text-primary" />
                    <span>Community support</span>
                  </div>
                </div>

                <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200">
                  <Link href="/courses/fundamentals-of-vibe-coding">
                    Start This Course
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              
              <div className="bg-gradient-to-br from-primary to-primary/80 p-8 lg:p-12 flex flex-col justify-center">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-6">What You&apos;ll Learn</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3" />
                      <span>AI-Assisted Coding Fundamentals</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3" />
                      <span>Cross-Platform Development</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3" />
                      <span>Modern Programming Workflows</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3" />
                      <span>AI Tools & Best Practices</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3" />
                      <span>Real-world Project Building</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Contribute Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Github className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Contribute to the Future of Learning
            </h2>
            <p className="text-xl text-slate-100 mb-8">
              Help us build the best open-source learning platform. Whether you&apos;re a developer, designer, or content creator, 
              your contributions make a difference.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Code className="w-8 h-8 text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Code</h3>
              <p className="text-slate-100 text-sm">Improve the platform, fix bugs, add features</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <BookOpen className="w-8 h-8 text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Content</h3>
              <p className="text-slate-100 text-sm">Write lessons, create projects, improve documentation</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Users className="w-8 h-8 text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Community</h3>
              <p className="text-slate-100 text-sm">Help other learners, moderate discussions</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-primary hover:bg-slate-50 shadow-lg hover:shadow-xl transition-all duration-200">
              <Link href="https://github.com/your-username/projectvibeit" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                Contribute on GitHub
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary transition-all duration-200">
              <Link href="/docs/contributing">
                View Contributing Guide
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-100">Project Vibe It</span>
              </div>
              <p className="text-slate-400 mb-4">
                Empowering developers to code faster and smarter with AI assistance. 
                Free, open source, and community-driven.
              </p>
              <div className="flex space-x-4">
                <Link href="https://github.com/your-username/projectvibeit" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-100 transition-colors">
                  <Github className="w-5 h-5" />
                </Link>
                <Link href="https://discord.gg/your-discord" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-100 transition-colors">
                  <Users className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 mb-4">Learning</h4>
              <ul className="space-y-2">
                <li><Link href="/courses" className="hover:text-slate-100 transition-colors">Courses</Link></li>
                <li><Link href="/projects" className="hover:text-slate-100 transition-colors">Projects</Link></li>
                <li><Link href="/community" className="hover:text-slate-100 transition-colors">Community</Link></li>
                <li><Link href="/roadmap" className="hover:text-slate-100 transition-colors">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 mb-4">Contribute</h4>
              <ul className="space-y-2">
                <li><Link href="https://github.com/your-username/projectvibeit" target="_blank" rel="noopener noreferrer" className="hover:text-slate-100 transition-colors">GitHub</Link></li>
                <li><Link href="/docs/contributing" className="hover:text-slate-100 transition-colors">Contributing Guide</Link></li>
                <li><Link href="/docs/content-guidelines" className="hover:text-slate-100 transition-colors">Content Guidelines</Link></li>
                <li><Link href="/discord" className="hover:text-slate-100 transition-colors">Discord</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/help" className="hover:text-slate-100 transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-slate-100 transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-slate-100 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-slate-100 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-slate-400">
              © 2024 Project Vibe It. Built with ❤️ by the open source community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
