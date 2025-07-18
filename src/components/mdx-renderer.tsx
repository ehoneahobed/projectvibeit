import { MDXRemote } from 'next-mdx-remote/rsc'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ExternalLink, 
  Video, 
  FileText, 
  Globe, 
  Book,
  Code,
  Github,
} from 'lucide-react'
import { CodeBlockWithCopy } from './code-block-with-copy'
import { LessonQuiz, LegacyQuizQuestion, LegacyQuizOption } from './lesson-quiz'
import { LearningObjectives, LearningObjective } from './learning-objectives'
import { ProjectSection } from './project-section'
import { VideoPlayer } from './ui/video-player'

interface MDXComponentProps {
  children?: React.ReactNode | string
  className?: string
  [key: string]: unknown
}

// Custom H2 component with separator
function CustomH2({ children, ...props }: MDXComponentProps) {
  return (
    <div className="mt-8 mb-6">
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-slate-500 dark:text-slate-400">
            Section
          </span>
        </div>
      </div>
      <h2 
        className="text-2xl font-bold text-foreground scroll-mt-20"
        {...props}
      >
        {children}
      </h2>
    </div>
  )
}

interface ResourceCardProps {
  title: string
  url: string
  type: 'article' | 'video' | 'tool' | 'documentation'
}

function ResourceCard({ title, url, type }: ResourceCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />
      case 'article':
        return <FileText className="w-4 h-4" />
      case 'tool':
        return <Globe className="w-4 h-4" />
      case 'documentation':
        return <Book className="w-4 h-4" />
      default:
        return <ExternalLink className="w-4 h-4" />
    }
  }

  const getTypeColor = () => {
    switch (type) {
      case 'video':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
      case 'article':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
      case 'tool':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800'
      case 'documentation':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-border/50 hover:border-border">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1 text-muted-foreground">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground mb-2 leading-tight">
              {title}
            </h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-xs border ${getTypeColor()}`}>
                {type}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-6 px-2 text-xs hover:bg-accent"
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Open
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface AssignmentCardProps {
  title: string
  description: string
  instructions: string
  submissionType: 'github' | 'url' | 'text'
  starterCode?: string
}

function AssignmentCard({ 
  title, 
  description, 
  instructions, 
  submissionType, 
  starterCode 
}: AssignmentCardProps) {
  return (
    <Card className="border-2 border-primary/20 bg-primary/5 dark:bg-primary/10">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            {title}
          </h3>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            Assignment
          </Badge>
        </div>

        <p className="text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>

        <div className="mb-6">
          <h4 className="font-medium text-foreground mb-3">
            Instructions:
          </h4>
          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-ul:my-3 prose-li:my-1">
            <div dangerouslySetInnerHTML={{ 
              __html: instructions
                .replace(/\n/g, '<br>')
                .replace(/- (.*)/g, '• $1')
            }} />
          </div>
        </div>

        {starterCode && (
          <div className="mb-6">
            <details className="group">
              <summary className="cursor-pointer list-none">
                <Button
                  variant="outline"
                  size="sm"
                  className="mb-3 hover:bg-accent"
                >
                  <span className="group-open:hidden">Show Starter Code</span>
                  <span className="hidden group-open:inline">Hide Starter Code</span>
                </Button>
              </summary>
              <CodeBlockWithCopy className="language-html">
                {starterCode}
              </CodeBlockWithCopy>
            </details>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-border">
            <Github className="w-3 h-3 mr-1" />
            {submissionType === 'github' ? 'GitHub Repository' : submissionType}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

// MDX components configuration
const components = {
  pre: ({ children, ...props }: MDXComponentProps) => <div {...props}>{children}</div>,
  code: ({ children, className, ...props }: MDXComponentProps) => {
    if (className) {
      return (
        <CodeBlockWithCopy className={className}>
          {String(children)}
        </CodeBlockWithCopy>
      )
    }
    return (
      <code
        className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-sm font-mono text-foreground"
        {...props}
      >
        {children}
      </code>
    )
  },
  h2: CustomH2,
  ResourceCard,
  AssignmentCard,
  VideoPlayer,
  LessonQuiz,
  QuizQuestion: LegacyQuizQuestion,
  QuizOption: LegacyQuizOption,
  LearningObjectives,
  LearningObjective,
  ProjectSection,
}

interface MDXRendererProps {
  source: string
}

export function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [],
          },
        }}
      />
    </div>
  )
} 