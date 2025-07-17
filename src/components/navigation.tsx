"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Settings, 
  LogOut,
  User,
  Home,
  Target
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState, useCallback, useRef } from "react"

interface UserProgress {
  courseId: string
  moduleId: string
  lessonId: string
  completedLessons: string[]
  completedProjects: string[]
  totalProgress: number
}

/**
 * Navigation component that shows user progress and provides quick access
 * to dashboard and user settings, similar to The Odin Project
 */
export function Navigation() {
  const { data: session } = useSession()
  const [_userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [overallProgress, setOverallProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const lastFetchTime = useRef<number>(0)
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  const fetchProgress = useCallback(async (force = false) => {
    if (!session?.user || isLoading || !isMountedRef.current) return
    
    // Prevent too frequent API calls
    const now = Date.now()
    if (!force && now - lastFetchTime.current < 2000) {
      return
    }
    
    setIsLoading(true)
    lastFetchTime.current = now
    
    try {
      const response = await fetch('/api/progress')
      const data = await response.json()
      
      if (data.success && isMountedRef.current) {
        setUserProgress(data.data || [])
        
        // Calculate overall progress
        const totalCompleted = data.data?.reduce((acc: number, progress: UserProgress) => {
          return acc + progress.completedLessons.length
        }, 0) || 0
        
        // Mock total lessons (in a real app, you'd fetch this from the content)
        const totalLessons = 40 // This should come from course content
        const progress = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0
        setOverallProgress(progress)
      }
    } catch (error) {
      console.error('Error fetching progress:', error)
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [session?.user, isLoading]) // Removed isLoading from dependencies to prevent infinite re-renders

  // Listen for custom events to refresh progress
  useEffect(() => {
    const handleProgressUpdate = () => {
      // Debounce the refresh
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current)
      }
      fetchTimeoutRef.current = setTimeout(() => {
        void fetchProgress(true)
      }, 1000)
    }

    window.addEventListener('lesson-completed', handleProgressUpdate)
    
    return () => {
      window.removeEventListener('lesson-completed', handleProgressUpdate)
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current)
      }
    }
  }, [fetchProgress])

  // Initial fetch
  useEffect(() => {
    fetchProgress(false)
  }, [fetchProgress])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current)
      }
    }
  }, [])

  if (!session?.user) {
    return null
  }

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                Project Vibe It
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/courses" 
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Courses
            </Link>
            <Link 
              href="/dashboard" 
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/community" 
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Community
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Quick Progress Indicator */}
            <div className="hidden lg:flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Progress
                </span>
              </div>
              <div className="w-20">
                <Progress value={overallProgress} className="h-2" />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {overallProgress}%
              </span>
            </div>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                    <AvatarFallback>
                      {session.user.name ? session.user.name.split(' ').map(n => n[0]).join('') : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/progress" className="flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    My Progress
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/achievements" className="flex items-center">
                    <Trophy className="w-4 h-4 mr-2" />
                    Achievements
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center text-red-600 dark:text-red-400"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
} 