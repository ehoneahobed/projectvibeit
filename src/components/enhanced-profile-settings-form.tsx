"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

import { 
  User, 
  AtSign, 
  Globe, 
  Save, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  X,
  ExternalLink
} from "lucide-react"
import { toast } from "sonner"
import { updateUserProfile } from "@/lib/profile-actions"
import { socialMediaPlatforms, getPlatformById, generateSocialMediaUrl } from "@/lib/social-media-platforms"

// Validation schema for social media entries
const socialMediaSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  handle: z.string().min(1, "Handle is required"),
  url: z.string().optional(),
})

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
  socialMedia: z.array(socialMediaSchema).optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface EnhancedProfileSettingsFormProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function EnhancedProfileSettingsForm({ user }: EnhancedProfileSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [currentUsername, setCurrentUsername] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    control,
    reset,
    setValue
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
      socialMedia: [],
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialMedia"
  })

  const watchedUsername = watch("username")
  const watchedSocialMedia = watch("socialMedia")

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
            socialMedia: userData.socialMedia || [],
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

  const addSocialMedia = () => {
    append({ platform: "", handle: "", url: "" })
  }

  const removeSocialMedia = (index: number) => {
    remove(index)
  }

  const getAvailablePlatforms = (currentIndex: number) => {
    const usedPlatforms = watchedSocialMedia?.map((item, index) => 
      index !== currentIndex ? item.platform : null
    ).filter(Boolean) || []
    
    return socialMediaPlatforms.filter(platform => 
      !usedPlatforms.includes(platform.id)
    )
  }

  const validateSocialMediaHandle = (platformId: string, handle: string) => {
    const platform = getPlatformById(platformId)
    if (!platform || !handle) return null

    const { validation } = platform
    
    if (validation.minLength && handle.length < validation.minLength) {
      return `Handle must be at least ${validation.minLength} characters`
    }
    
    if (validation.maxLength && handle.length > validation.maxLength) {
      return `Handle must be less than ${validation.maxLength} characters`
    }
    
    if (validation.pattern && !validation.pattern.test(handle)) {
      return validation.message || "Invalid handle format"
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

      {/* Legacy Social Media */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Legacy Social Media
          </CardTitle>
          <CardDescription>
            These fields are kept for backward compatibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* GitHub */}
          <div className="space-y-2">
            <Label htmlFor="githubUsername">GitHub Username</Label>
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
            <Label htmlFor="twitterUsername">Twitter Username</Label>
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
            <Label htmlFor="linkedinUsername">LinkedIn Profile</Label>
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
            <Label htmlFor="website">Website</Label>
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

      {/* Dynamic Social Media */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Social Media & Links
          </CardTitle>
          <CardDescription>
            Add your social media accounts and other online presence
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => {
            const platform = getPlatformById(watchedSocialMedia?.[index]?.platform || "")
            const handleError = validateSocialMediaHandle(
              watchedSocialMedia?.[index]?.platform || "",
              watchedSocialMedia?.[index]?.handle || ""
            )
            
            return (
              <div key={field.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-slate-900 dark:text-white">
                    Social Media #{index + 1}
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSocialMedia(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Platform Selection */}
                  <div className="space-y-2">
                    <Label>Platform</Label>
                                         <Select
                       value={watchedSocialMedia?.[index]?.platform || ""}
                       onValueChange={(value: string) => {
                         setValue(`socialMedia.${index}.platform`, value)
                         setValue(`socialMedia.${index}.handle`, "")
                         setValue(`socialMedia.${index}.url`, "")
                       }}
                     >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailablePlatforms(index).map((platform) => (
                          <SelectItem key={platform.id} value={platform.id}>
                            <div className="flex items-center gap-2">
                              <platform.icon className="w-4 h-4" />
                              {platform.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Handle Input */}
                  <div className="space-y-2">
                    <Label>Handle</Label>
                    <Input
                      {...register(`socialMedia.${index}.handle`)}
                      placeholder={platform?.placeholder || "Enter handle"}
                    />
                    {handleError && (
                      <p className="text-sm text-red-600">{handleError}</p>
                    )}
                  </div>
                </div>

                {/* Preview URL */}
                {platform && watchedSocialMedia?.[index]?.handle && (
                  <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded text-sm">
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600 dark:text-slate-300">
                      {generateSocialMediaUrl(platform, watchedSocialMedia[index].handle)}
                    </span>
                  </div>
                )}

                {/* Platform Icon and Color */}
                {platform && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={platform.color}>
                      <platform.icon className="w-3 h-3 mr-1" />
                      {platform.name}
                    </Badge>
                  </div>
                )}
              </div>
            )
          })}

          {/* Add New Social Media Button */}
          <Button
            type="button"
            variant="outline"
            onClick={addSocialMedia}
            className="w-full"
            disabled={fields.length >= socialMediaPlatforms.length}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Social Media Platform
          </Button>

                     {fields.length >= socialMediaPlatforms.length && (
             <p className="text-sm text-slate-500 text-center">
               You&apos;ve added all available platforms
             </p>
           )}
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