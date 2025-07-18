"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface LearningObjectivesProps {
  children?: React.ReactNode
  title?: string
  description?: string
  collapsible?: boolean
  showProgress?: boolean
  onObjectiveToggle?: (objectiveId: string, isCompleted: boolean) => void
}

export function LearningObjectives({ 
  children,
  title = "Learning Objectives", 
  description = "By the end of this lesson, you will be able to:",
  collapsible = true
}: LearningObjectivesProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Card className="border-2 border-primary/20 bg-primary/5 dark:bg-primary/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              Objectives
            </Badge>
          </div>
          
          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
        
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      {(!collapsible || isExpanded) && (
        <CardContent>
          <div className="space-y-3">
            {children}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// Individual objective component for MDX
interface LearningObjectiveProps {
  children?: React.ReactNode
  category?: 'knowledge' | 'skill' | 'understanding' | 'application'
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  isCompleted?: boolean
}

export function LearningObjective({ 
  children, 
  category = 'knowledge', 
  difficulty = 'beginner',
  isCompleted = false 
}: LearningObjectiveProps) {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'knowledge':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
      case 'skill':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800'
      case 'understanding':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800'
      case 'application':
        return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

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

  return (
    <div className={cn(
      "flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
      isCompleted 
        ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800" 
        : "bg-background border-border hover:bg-accent"
    )}>
      <div className="flex-shrink-0 mt-1">
        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
          ✓
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm leading-relaxed",
          isCompleted 
            ? "text-green-800 dark:text-green-200" 
            : "text-foreground"
        )}>
          {children}
        </p>
        
        <div className="flex items-center gap-2 mt-2">
          <Badge 
            variant="outline" 
            className={cn("text-xs", getCategoryColor(category))}
          >
            {category}
          </Badge>
          <Badge 
            variant="outline" 
            className={cn("text-xs", getDifficultyColor(difficulty))}
          >
            {difficulty}
          </Badge>
        </div>
      </div>
    </div>
  )
} 