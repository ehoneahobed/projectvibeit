import { auth } from "@/lib/auth/auth"
import { redirect } from "next/navigation"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"

/**
 * Check if the current user has admin privileges
 */
export async function checkAdminAuth() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/portal')
  }

  await connectDB()
  
  const user = await User.findById(session.user.id)
  if (!user) {
    redirect('/auth/signin?callbackUrl=/portal')
  }

  // Check if user has admin role
  if (user.role !== 'admin') {
    redirect('/dashboard?error=unauthorized')
  }

  return { session, user }
}

/**
 * Check if the current user has contributor or admin privileges
 */
export async function checkContributorAuth() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/portal')
  }

  await connectDB()
  
  const user = await User.findById(session.user.id)
  if (!user) {
    redirect('/auth/signin?callbackUrl=/portal')
  }

  // Check if user has contributor or admin role
  if (!['contributor', 'admin'].includes(user.role)) {
    redirect('/dashboard?error=unauthorized')
  }

  return { session, user }
}

/**
 * Get user role for conditional rendering
 */
export async function getUserRole() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }

  await connectDB()
  
  const user = await User.findById(session.user.id)
  return user?.role || null
}

/**
 * Check if user can access specific admin features
 */
export function canAccessFeature(userRole: string | null, feature: 'courses' | 'users' | 'analytics' | 'community' | 'settings') {
  if (!userRole) return false
  
  switch (feature) {
    case 'courses':
      return ['contributor', 'admin'].includes(userRole)
    case 'users':
    case 'analytics':
    case 'settings':
      return userRole === 'admin'
    case 'community':
      return ['contributor', 'admin'].includes(userRole)
    default:
      return false
  }
} 