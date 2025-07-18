"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { 
  User, 
  AtSign, 
  Github, 
  Twitter, 
  Linkedin, 
  Globe, 
  Save, 
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { updateUserProfile } from "@/lib/profile-actions"

// Validation schema for profile settings
const profileSchema = z.object({
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
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileSettingsFormProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [currentUsername, setCurrentUsername] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,

    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      username: "",
      bio: "",
      githubUsername: "",
      twitterUsername: "",
      linkedinUsername: "",
      website: "",
    }
  })

  const watchedUsername = watch("username")

  // Load current user data
  useEffect(() => {
    async function loadUserData() {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const userData = await response.json()
          setCurrentUsername(userData.username || "")
          reset({
            name: userData.name || "",
            username: userData.username || "",
            bio: userData.bio || "",
            githubUsername: userData.githubUsername || "",
            twitterUsername: userData.twitterUsername || "",
            linkedinUsername: userData.linkedinUsername || "",
            website: userData.website || "",
          })
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }
    loadUserData()
  }, [reset])

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      if (!watchedUsername || watchedUsername.length < 3) {
        setUsernameAvailable(null)
        return
      }

      // If it's the user's own username, it's always available
      if (watchedUsername === currentUsername) {
        setUsernameAvailable(true)
        return
      }

      setIsCheckingUsername(true)
      try {
        const response = await fetch(`/api/profile/check-username?username=${watchedUsername}`)
        if (!response.ok) {
          throw new Error('Failed to check username')
        }
        const data = await response.json()
        setUsernameAvailable(data.available)
      } catch (error) {
        console.error('Error checking username:', error)
        setUsernameAvailable(null)
      } finally {
        setIsCheckingUsername(false)
      }
    }

    const timeoutId = setTimeout(checkUsername, 500)
    return () => clearTimeout(timeoutId)
  }, [watchedUsername, currentUsername])

  const onSubmit = async (data: ProfileFormData) => {
    // Debug logging
    console.log('Form submission debug:', {
      submittedUsername: data.username,
      currentUsername,
      usernameAvailable,
      isOwnUsername: data.username === currentUsername,
      isUsernameAvailable: usernameAvailable === true
    })

    // Check if username is valid for submission
    const isOwnUsername = data.username === currentUsername
    const isUsernameAvailable = usernameAvailable === true
    
    if (!isOwnUsername && !isUsernameAvailable) {
      toast.error("Please choose a different username")
      return
    }

    setIsLoading(true)
    try {
      const result = await updateUserProfile(data)
      if (result.success) {
        toast.success("Profile updated successfully!")
        setCurrentUsername(data.username)
        reset(data)
      } else {
        toast.error(result.error || "Failed to update profile")
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getUsernameStatus = () => {
    if (isCheckingUsername) {
      return (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Checking availability...
        </div>
      )
    }

    if (usernameAvailable === true) {
      return (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="w-4 h-4" />
          Username available
        </div>
      )
    }

    if (usernameAvailable === false) {
      return (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          Username taken
        </div>
      )
    }

    return null
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Update your name, username, and bio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
              <AvatarFallback className="text-lg">
                {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Profile picture managed by your authentication provider
              </p>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AtSign className="h-4 w-4 text-slate-400" />
              </div>
              <Input
                id="username"
                {...register("username")}
                className="pl-10"
                placeholder="Enter your username"
              />
            </div>
            {getUsernameStatus()}
            {errors.username && (
              <p className="text-sm text-red-600">{errors.username.message}</p>
            )}
            <p className="text-xs text-slate-500">
              This will be your public profile URL: /profile/{watchedUsername || "username"}
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              {...register("bio")}
              placeholder="Tell us about yourself..."
              rows={3}
            />
            {errors.bio && (
              <p className="text-sm text-red-600">{errors.bio.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Social Media & Links
          </CardTitle>
          <CardDescription>
            Add your social media accounts and website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* GitHub */}
          <div className="space-y-2">
            <Label htmlFor="githubUsername" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub Username
            </Label>
            <Input
              id="githubUsername"
              {...register("githubUsername")}
              placeholder="your-github-username"
            />
            {errors.githubUsername && (
              <p className="text-sm text-red-600">{errors.githubUsername.message}</p>
            )}
          </div>

          {/* Twitter */}
          <div className="space-y-2">
            <Label htmlFor="twitterUsername" className="flex items-center gap-2">
              <Twitter className="w-4 h-4" />
              Twitter Username
            </Label>
            <Input
              id="twitterUsername"
              {...register("twitterUsername")}
              placeholder="your-twitter-username"
            />
            {errors.twitterUsername && (
              <p className="text-sm text-red-600">{errors.twitterUsername.message}</p>
            )}
          </div>

          {/* LinkedIn */}
          <div className="space-y-2">
            <Label htmlFor="linkedinUsername" className="flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              LinkedIn Profile
            </Label>
            <Input
              id="linkedinUsername"
              {...register("linkedinUsername")}
              placeholder="your-linkedin-profile"
            />
            {errors.linkedinUsername && (
              <p className="text-sm text-red-600">{errors.linkedinUsername.message}</p>
            )}
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Website
            </Label>
            <Input
              id="website"
              {...register("website")}
              placeholder="https://your-website.com"
            />
            {errors.website && (
              <p className="text-sm text-red-600">{errors.website.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading || !isDirty || !usernameAvailable}
          className="min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )
} 