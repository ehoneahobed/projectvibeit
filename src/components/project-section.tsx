"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Code, 
  ExternalLink, 
  Clock, 
  Target, 
  CheckCircle,
  FileText,
  Globe,
  Download
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectStep {
  id: string
  title: string
  description: string
  order: number
  isCompleted?: boolean
}

interface ProjectResource {
  title: string
  url: string
  type: 'starter-code' | 'documentation' | 'video' | 'article' | 'template'
}

interface ProjectSubmission {
  type: 'github' | 'url' | 'text' | 'file'
  value: string
  submittedAt?: Date
}

interface ProjectSectionProps {
  title: string
  description: string
  estimatedTime: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  objectives: string[]
  steps: ProjectStep[]
  resources?: ProjectResource[]
  submissionType: 'github' | 'url' | 'text' | 'file'
  starterCode?: string
  rubric?: Array<{
    criterion: string
    points: number
    description: string
  }>
  onStepToggle?: (stepId: string, isCompleted: boolean) => void
  onSubmit?: (submission: ProjectSubmission) => void
}

export function ProjectSection({
  title,
  description,
  estimatedTime,
  difficulty,
  objectives,
  steps,
  resources = [],
  submissionType,
  starterCode,
  rubric = [],
  onStepToggle,
  onSubmit
}: ProjectSectionProps) {
  const [submission, setSubmission] = useState<ProjectSubmission>({
    type: submissionType,
    value: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const completedSteps = steps.filter(step => step.isCompleted).length
  const progressPercentage = steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 0

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800'
      case 'intermediate':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800'
      case 'advanced':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'starter-code':
        return <Code className="w-4 h-4" />
      case 'documentation':
        return <FileText className="w-4 h-4" />
      case 'video':
        return <Globe className="w-4 h-4" />
      case 'article':
        return <FileText className="w-4 h-4" />
      case 'template':
        return <Download className="w-4 h-4" />
      default:
        return <ExternalLink className="w-4 h-4" />
    }
  }

  const handleStepToggle = (stepId: string, currentStatus: boolean) => {
    if (onStepToggle) {
      onStepToggle(stepId, !currentStatus)
    }
  }

  const handleSubmit = async () => {
    if (!submission.value.trim()) return

    setIsSubmitting(true)
    try {
      if (onSubmit) {
        await onSubmit({
          ...submission,
          submittedAt: new Date()
        })
      }
    } catch (error) {
      console.error('Error submitting project:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-2 border-primary/20 bg-primary/5 dark:bg-primary/10">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Code className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            Project
          </Badge>
        </div>
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {estimatedTime}
          </div>
          <Badge variant="outline" className={cn("text-xs", getDifficultyColor(difficulty))}>
            {difficulty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Project Objectives */}
        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Project Objectives
          </h4>
          <ul className="space-y-2">
            {objectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{objective}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {completedSteps}/{steps.length} steps completed
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Project Steps */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Project Steps</h4>
          <div className="space-y-3">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
                  step.isCompleted 
                    ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800" 
                    : "bg-background border-border hover:bg-accent"
                )}
              >
                <div className="flex-shrink-0 mt-1">
                  {onStepToggle ? (
                    <button
                      onClick={() => handleStepToggle(step.id, step.isCompleted || false)}
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                        step.isCompleted 
                          ? "bg-green-600 border-green-600 hover:bg-green-700" 
                          : "border-border hover:border-primary"
                      )}
                    >
                      {step.isCompleted && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </button>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                      {step.order}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h5 className={cn(
                    "font-medium text-sm",
                    step.isCompleted 
                      ? "text-green-800 dark:text-green-200" 
                      : "text-foreground"
                  )}>
                    {step.title}
                  </h5>
                  <p className={cn(
                    "text-sm mt-1",
                    step.isCompleted 
                      ? "text-green-700 dark:text-green-300" 
                      : "text-muted-foreground"
                  )}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        {resources.length > 0 && (
          <div>
            <h4 className="font-medium text-foreground mb-3">Resources</h4>
            <div className="grid gap-2">
              {resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <div className="flex-shrink-0 text-muted-foreground">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-foreground">
                      {resource.title}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {resource.type.replace('-', ' ')}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Starter Code */}
        {starterCode && (
          <div>
            <h4 className="font-medium text-foreground mb-3">Starter Code</h4>
            <details className="group">
              <summary className="cursor-pointer list-none">
                <Button variant="outline" size="sm" className="mb-3">
                  <span className="group-open:hidden">Show Starter Code</span>
                  <span className="hidden group-open:inline">Hide Starter Code</span>
                </Button>
              </summary>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{starterCode}</code>
              </pre>
            </details>
          </div>
        )}

        {/* Rubric */}
        {rubric.length > 0 && (
          <div>
            <h4 className="font-medium text-foreground mb-3">Evaluation Rubric</h4>
            <div className="space-y-3">
              {rubric.map((item, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{item.criterion}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.points} points
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submission */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Submit Your Project</h4>
          <div className="space-y-3">
            {submissionType === 'github' && (
              <div>
                <Label htmlFor="github-url">GitHub Repository URL</Label>
                <Input
                  id="github-url"
                  type="url"
                  placeholder="https://github.com/username/project-name"
                  value={submission.value}
                  onChange={(e) => setSubmission({ ...submission, value: e.target.value })}
                  className="mt-1"
                />
              </div>
            )}
            
            {submissionType === 'url' && (
              <div>
                <Label htmlFor="project-url">Project URL</Label>
                <Input
                  id="project-url"
                  type="url"
                  placeholder="https://your-project.com"
                  value={submission.value}
                  onChange={(e) => setSubmission({ ...submission, value: e.target.value })}
                  className="mt-1"
                />
              </div>
            )}
            
            {submissionType === 'text' && (
              <div>
                <Label htmlFor="project-description">Project Description</Label>
                <Textarea
                  id="project-description"
                  placeholder="Describe your project, what you built, and any challenges you faced..."
                  value={submission.value}
                  onChange={(e) => setSubmission({ ...submission, value: e.target.value })}
                  className="mt-1 min-h-[100px]"
                />
              </div>
            )}
            
            <Button 
              onClick={handleSubmit}
              disabled={!submission.value.trim() || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Submitting..." : "Submit Project"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 