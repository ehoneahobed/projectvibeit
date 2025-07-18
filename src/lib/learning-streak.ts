import type { IProgress } from "@/lib/models/User"

export interface LearningStreak {
  currentStreak: number
  longestStreak: number
  lastActivityDate: Date | null
  totalActiveDays: number
  milestones: Milestone[]
}

export interface Milestone {
  id: string
  type: "streak" | "lessons" | "courses" | "study-time"
  title: string
  description: string
  threshold: number
  achieved: boolean
  achievedAt?: Date
  icon: string
}

/**
 * Calculate learning streak from user progress
 */
export function calculateLearningStreak(userProgress: IProgress[]): LearningStreak {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  
  // Debug: Log today and all completion dates
  // if (typeof window !== 'undefined') {
  //   // Only log in browser
  //   // eslint-disable-next-line no-console
  //   console.log('[Streak Debug] Today:', todayStr)
  //   // eslint-disable-next-line no-console
  //   console.log('[Streak Debug] Raw progress data:', userProgress)
  // }
  
  // Get all completion dates
  const completionDates = new Set<string>()
  
  // userProgress.forEach(progress => {
  //   if (progress.completedAt) {
  //     const dateStr = new Date(progress.completedAt).toISOString().split('T')[0]
  //     completionDates.add(dateStr)
  //     // if (typeof window !== 'undefined') {
  //     //   // eslint-disable-next-line no-console
  //     //   console.log('[Streak Debug] CompletedAt:', progress.completedAt, '->', dateStr)
  //     // }
  //   } else {
  //     // if (typeof window !== 'undefined') {
  //     //   // eslint-disable-next-line no-console
  //     //   console.log('[Streak Debug] Progress item has no completedAt:', progress)
  //     // }
  //   }
  // })
  
  // Since completedAt is only set when course is fully completed, 
  // we'll use a fallback: if user has completed lessons, count today as active
  const totalCompletedLessons = userProgress.reduce((acc, p) => acc + (p.completedLessons?.length || 0), 0)
  if (totalCompletedLessons > 0 && completionDates.size === 0) {
    completionDates.add(todayStr)
    // if (typeof window !== 'undefined') {
    //   // eslint-disable-next-line no-console
    //   console.log('[Streak Debug] Fallback: Adding today as completion date since user has', totalCompletedLessons, 'completed lessons')
    // }
  }
  
  // if (typeof window !== 'undefined') {
  //   // eslint-disable-next-line no-console
  //   console.log('[Streak Debug] All completion dates:', Array.from(completionDates))
  // }
  
  // Convert to sorted array of dates
  const sortedDates = Array.from(completionDates).sort()
  
  if (sortedDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      totalActiveDays: 0,
      milestones: generateMilestones(0, 0, 0, 0)
    }
  }
  
  // Calculate current streak
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0
  let lastActivityDate: Date | null = null
  
  // Start from today and work backwards
  const todayDate = new Date(todayStr)
  const currentDate = new Date(todayDate)
  
  for (let i = 0; i < 30; i++) {
    const dateStr = currentDate.toISOString().split('T')[0]
    
    if (completionDates.has(dateStr)) {
      tempStreak++
      if (lastActivityDate === null) {
        lastActivityDate = new Date(currentDate)
      }
    } else {
      // Break streak if we miss a day
      if (tempStreak > 0) {
        break
      }
    }
    
    // Move to previous day
    currentDate.setDate(currentDate.getDate() - 1)
  }
  
  currentStreak = tempStreak
  
  // Calculate longest streak
  tempStreak = 0
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      tempStreak = 1
    } else {
      const prevDate = new Date(sortedDates[i - 1])
      const currDate = new Date(sortedDates[i])
      const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 1) {
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak)
  
  // Calculate total active days
  const totalActiveDays = completionDates.size
  
  // Generate milestones
  const totalLessons = userProgress.reduce((acc, p) => acc + p.completedLessons.length, 0)
  const totalCourses = userProgress.length
  const totalStudyTime = Math.round(totalLessons * 0.5) // 30 minutes per lesson
  
  const milestones = generateMilestones(currentStreak, totalLessons, totalCourses, totalStudyTime)
  
  return {
    currentStreak,
    longestStreak,
    lastActivityDate,
    totalActiveDays,
    milestones
  }
}

/**
 * Generate learning milestones based on current progress
 */
function generateMilestones(
  currentStreak: number,
  totalLessons: number,
  totalCourses: number,
  totalStudyTime: number
): Milestone[] {
  const milestones: Milestone[] = [
    // Streak milestones
    {
      id: "streak-3",
      type: "streak",
      title: "3-Day Streak",
      description: "Learn for 3 days in a row",
      threshold: 3,
      achieved: currentStreak >= 3,
      icon: "🔥"
    },
    {
      id: "streak-7",
      type: "streak",
      title: "Week Warrior",
      description: "Learn for 7 days in a row",
      threshold: 7,
      achieved: currentStreak >= 7,
      icon: "⚡"
    },
    {
      id: "streak-14",
      type: "streak",
      title: "Fortnight Fighter",
      description: "Learn for 14 days in a row",
      threshold: 14,
      achieved: currentStreak >= 14,
      icon: "💪"
    },
    {
      id: "streak-30",
      type: "streak",
      title: "Monthly Master",
      description: "Learn for 30 days in a row",
      threshold: 30,
      achieved: currentStreak >= 30,
      icon: "👑"
    },
    
    // Lesson milestones
    {
      id: "lessons-10",
      type: "lessons",
      title: "Lesson Learner",
      description: "Complete 10 lessons",
      threshold: 10,
      achieved: totalLessons >= 10,
      icon: "📚"
    },
    {
      id: "lessons-25",
      type: "lessons",
      title: "Lesson Lover",
      description: "Complete 25 lessons",
      threshold: 25,
      achieved: totalLessons >= 25,
      icon: "📖"
    },
    {
      id: "lessons-50",
      type: "lessons",
      title: "Lesson Legend",
      description: "Complete 50 lessons",
      threshold: 50,
      achieved: totalLessons >= 50,
      icon: "🎓"
    },
    {
      id: "lessons-100",
      type: "lessons",
      title: "Century Scholar",
      description: "Complete 100 lessons",
      threshold: 100,
      achieved: totalLessons >= 100,
      icon: "🏆"
    },
    
    // Course milestones
    {
      id: "courses-3",
      type: "courses",
      title: "Course Explorer",
      description: "Start 3 different courses",
      threshold: 3,
      achieved: totalCourses >= 3,
      icon: "🗺️"
    },
    {
      id: "courses-5",
      type: "courses",
      title: "Course Collector",
      description: "Start 5 different courses",
      threshold: 5,
      achieved: totalCourses >= 5,
      icon: "📚"
    },
    
    // Study time milestones
    {
      id: "study-5",
      type: "study-time",
      title: "5-Hour Learner",
      description: "Study for 5 hours total",
      threshold: 5,
      achieved: totalStudyTime >= 5,
      icon: "⏰"
    },
    {
      id: "study-10",
      type: "study-time",
      title: "10-Hour Scholar",
      description: "Study for 10 hours total",
      threshold: 10,
      achieved: totalStudyTime >= 10,
      icon: "📊"
    },
    {
      id: "study-25",
      type: "study-time",
      title: "25-Hour Expert",
      description: "Study for 25 hours total",
      threshold: 25,
      achieved: totalStudyTime >= 25,
      icon: "🎯"
    },
    {
      id: "study-50",
      type: "study-time",
      title: "50-Hour Master",
      description: "Study for 50 hours total",
      threshold: 50,
      achieved: totalStudyTime >= 50,
      icon: "👑"
    }
  ]
  
  return milestones
}

/**
 * Check if a new milestone was just achieved
 */
export function checkNewMilestones(
  oldMilestones: Milestone[],
  newMilestones: Milestone[]
): Milestone[] {
  return newMilestones.filter(newMilestone => {
    const oldMilestone = oldMilestones.find(m => m.id === newMilestone.id)
    return newMilestone.achieved && (!oldMilestone || !oldMilestone.achieved)
  })
}

/**
 * Get shareable text for a milestone
 */
export function getMilestoneShareText(milestone: Milestone, stats: {
  currentStreak?: number
  totalLessons?: number
  totalCourses?: number
  totalStudyTime?: number
}): string {
  const baseText = `🎉 Just achieved the "${milestone.title}" milestone!`
  
  switch (milestone.type) {
    case "streak":
      return `${baseText}\n\n🔥 Learning streak: ${stats.currentStreak} days\n\n${milestone.description}`
    
    case "lessons":
      return `${baseText}\n\n📚 Total lessons completed: ${stats.totalLessons}\n\n${milestone.description}`
    
    case "courses":
      return `${baseText}\n\n🗺️ Courses started: ${stats.totalCourses}\n\n${milestone.description}`
    
    case "study-time":
      return `${baseText}\n\n⏰ Total study time: ${stats.totalStudyTime} hours\n\n${milestone.description}`
    
    default:
      return `${baseText}\n\n${milestone.description}`
  }
} 