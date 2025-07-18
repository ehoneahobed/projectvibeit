"use server"

import { auth } from "@/lib/auth/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"
import type { ISocialMedia } from "@/lib/models/User"
import { z } from "zod"

// Validation schema for social media entries
const socialMediaSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  handle: z.string().min(1, "Handle is required"),
  url: z.string().optional(),
})

// Validation schema for profile updates
const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")
    .toLowerCase(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  githubUsername: z.string().max(39, "GitHub username must be less than 39 characters").optional(),
  twitterUsername: z.string().max(15, "Twitter username must be less than 15 characters").optional(),
  linkedinUsername: z.string().max(100, "LinkedIn username must be less than 100 characters").optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  socialMedia: z.array(socialMediaSchema).optional(),
})

type ProfileUpdateData = z.infer<typeof profileUpdateSchema>

// Type for user profile data returned by lean() query
interface UserProfileData {
  name?: string
  username: string
  bio?: string
  githubUsername?: string
  twitterUsername?: string
  linkedinUsername?: string
  website?: string
  socialMedia?: ISocialMedia[]
  email: string
  image?: string
}

/**
 * Update user profile information
 */
export async function updateUserProfile(data: ProfileUpdateData) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized", data: null }
    }

    // Validate input data
    const validatedData = profileUpdateSchema.parse(data)

    await connectDB()
    
    console.log('Session debug:', {
      sessionUserId: session.user.id,
      sessionUserEmail: session.user.email
    })
    
    // First, get user for validation (without lean)
    const userForValidation = await User.findById(session.user.id).select('username')
    if (!userForValidation) {
      console.log('User not found with ID:', session.user.id)
      return { success: false, error: "User not found", data: null }
    }

    console.log('Backend validation debug:', {
      submittedUsername: validatedData.username,
      currentUsername: userForValidation.username,
      isSameUsername: validatedData.username === userForValidation.username,
      userId: userForValidation._id.toString()
    })

    // Check if username is being changed and if it's available
    if (validatedData.username !== userForValidation.username) {
      const existingUser = await User.findOne({ username: validatedData.username })
      if (existingUser) {
        // Check if the existing user is the same as the current user
        const isCurrentUser = existingUser._id.toString() === session.user.id
        if (!isCurrentUser) {
          console.log('Username conflict found:', existingUser._id.toString(), 'vs', session.user.id)
          return { success: false, error: "Username is already taken", data: null }
        }
      }
    }

    // Update user profile using findByIdAndUpdate
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        name: validatedData.name,
        username: validatedData.username,
        bio: validatedData.bio,
        githubUsername: validatedData.githubUsername,
        twitterUsername: validatedData.twitterUsername,
        linkedinUsername: validatedData.linkedinUsername,
        website: validatedData.website,
        socialMedia: validatedData.socialMedia || [],
      },
      { new: true, runValidators: true }
    )

    return { 
      success: true, 
      data: {
        name: updatedUser.name,
        username: updatedUser.username,
        bio: updatedUser.bio,
        githubUsername: updatedUser.githubUsername,
        twitterUsername: updatedUser.twitterUsername,
        linkedinUsername: updatedUser.linkedinUsername,
        website: updatedUser.website,
        socialMedia: updatedUser.socialMedia || [],
      }, 
      error: null 
    }
  } catch (error) {
    console.error('Error updating user profile:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message, data: null }
    }
    return { success: false, error: 'Failed to update profile', data: null }
  }
}

/**
 * Check if a username is available
 */
export async function checkUsernameAvailability(username: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized", data: null }
    }

    await connectDB()
    
    // Check if username exists
    const existingUser = await User.findOne({ username: username.toLowerCase() })
    
    // If username exists, check if it's the current user
    if (existingUser) {
      const isCurrentUser = existingUser._id.toString() === session.user.id
      return { 
        success: true, 
        data: { available: isCurrentUser }, 
        error: null 
      }
    }

    return { success: true, data: { available: true }, error: null }
  } catch (error) {
    console.error('Error checking username availability:', error)
    return { success: false, error: 'Failed to check username availability', data: null }
  }
}

/**
 * Get user profile data
 */
export async function getUserProfile() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized", data: null }
    }

    await connectDB()
    
    const user = await User.findById(session.user.id, {
      name: 1,
      username: 1,
      bio: 1,
      githubUsername: 1,
      twitterUsername: 1,
      linkedinUsername: 1,
      website: 1,
      socialMedia: 1,
      email: 1,
      image: 1
    }).lean() as unknown as UserProfileData

    if (!user) {
      return { success: false, error: "User not found", data: null }
    }

    return { 
      success: true, 
      data: {
        name: user.name,
        username: user.username,
        bio: user.bio,
        githubUsername: user.githubUsername,
        twitterUsername: user.twitterUsername,
        linkedinUsername: user.linkedinUsername,
        website: user.website,
        socialMedia: user.socialMedia || [],
        email: user.email,
        image: user.image,
      }, 
      error: null 
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return { success: false, error: 'Failed to fetch profile', data: null }
  }
} 