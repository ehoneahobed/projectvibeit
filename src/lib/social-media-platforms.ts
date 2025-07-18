import { 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube, 
  Facebook, 
  Twitch, 
  MessageCircle, 
  BookOpen,
  Code,
  Hash,
  HelpCircle,
  MessageSquare,
  Video,
  Camera,
  Heart,
  Palette,
  Circle,
  FileText,
  Rss,
  Gift,
  Coffee,
  Zap
} from "lucide-react"

export interface SocialMediaPlatform {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  urlPattern: string
  placeholder: string
  validation: {
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    message?: string
  }
  color: string
}

export const socialMediaPlatforms: SocialMediaPlatform[] = [
  {
    id: "github",
    name: "GitHub",
    icon: Github,
    urlPattern: "https://github.com/{handle}",
    placeholder: "username",
    validation: {
      minLength: 1,
      maxLength: 39,
      pattern: /^[a-zA-Z0-9-]+$/,
      message: "GitHub username can only contain letters, numbers, and hyphens"
    },
    color: "text-gray-900 dark:text-gray-100"
  },
  {
    id: "twitter",
    name: "Twitter/X",
    icon: Twitter,
    urlPattern: "https://twitter.com/{handle}",
    placeholder: "username",
    validation: {
      minLength: 1,
      maxLength: 15,
      pattern: /^[a-zA-Z0-9_]+$/,
      message: "Twitter username can only contain letters, numbers, and underscores"
    },
    color: "text-blue-500"
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    urlPattern: "https://linkedin.com/in/{handle}",
    placeholder: "profile-id",
    validation: {
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9-]+$/,
      message: "LinkedIn profile ID can only contain letters, numbers, and hyphens"
    },
    color: "text-blue-600"
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    urlPattern: "https://instagram.com/{handle}",
    placeholder: "username",
    validation: {
      minLength: 1,
      maxLength: 30,
      pattern: /^[a-zA-Z0-9._]+$/,
      message: "Instagram username can only contain letters, numbers, dots, and underscores"
    },
    color: "text-pink-500"
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    urlPattern: "https://youtube.com/@{handle}",
    placeholder: "channel-name",
    validation: {
      minLength: 3,
      maxLength: 30,
      pattern: /^[a-zA-Z0-9_-]+$/,
      message: "YouTube channel name can only contain letters, numbers, underscores, and hyphens"
    },
    color: "text-red-500"
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    urlPattern: "https://facebook.com/{handle}",
    placeholder: "profile-id",
    validation: {
      minLength: 3,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9.]+$/,
      message: "Facebook profile ID can only contain letters, numbers, and dots"
    },
    color: "text-blue-600"
  },
  {
    id: "twitch",
    name: "Twitch",
    icon: Twitch,
    urlPattern: "https://twitch.tv/{handle}",
    placeholder: "username",
    validation: {
      minLength: 4,
      maxLength: 25,
      pattern: /^[a-zA-Z0-9_]+$/,
      message: "Twitch username can only contain letters, numbers, and underscores"
    },
    color: "text-purple-500"
  },
  {
    id: "discord",
    name: "Discord",
    icon: MessageCircle,
    urlPattern: "https://discord.gg/{handle}",
    placeholder: "server-invite",
    validation: {
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9]+$/,
      message: "Discord invite code can only contain letters and numbers"
    },
    color: "text-indigo-500"
  },
  {
    id: "medium",
    name: "Medium",
    icon: BookOpen,
    urlPattern: "https://medium.com/@{handle}",
    placeholder: "username",
    validation: {
      minLength: 1,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9-]+$/,
      message: "Medium username can only contain letters, numbers, and hyphens"
    },
    color: "text-green-600"
  },
  {
    id: "dev",
    name: "Dev.to",
    icon: Code,
    urlPattern: "https://dev.to/{handle}",
    placeholder: "username",
    validation: {
      minLength: 1,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9-]+$/,
      message: "Dev.to username can only contain letters, numbers, and hyphens"
    },
    color: "text-black dark:text-white"
  },
  {
    id: "hashnode",
    name: "Hashnode",
    icon: Hash,
    urlPattern: "https://hashnode.dev/@{handle}",
    placeholder: "username",
    validation: {
      minLength: 1,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9-]+$/,
      message: "Hashnode username can only contain letters, numbers, and hyphens"
    },
    color: "text-blue-600"
  },
  {
    id: "stackoverflow",
    name: "Stack Overflow",
    icon: HelpCircle,
    urlPattern: "https://stackoverflow.com/users/{handle}",
    placeholder: "user-id",
    validation: {
      minLength: 1,
      maxLength: 10,
      pattern: /^[0-9]+$/,
      message: "Stack Overflow user ID must be a number"
    },
    color: "text-orange-500"
  },
  {
    id: "reddit",
    name: "Reddit",
    icon: MessageSquare,
    urlPattern: "https://reddit.com/user/{handle}",
    placeholder: "username",
    validation: {
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_-]+$/,
      message: "Reddit username can only contain letters, numbers, underscores, and hyphens"
    },
    color: "text-orange-500"
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Video,
    urlPattern: "https://tiktok.com/@{handle}",
    placeholder: "username",
    validation: {
      minLength: 2,
      maxLength: 24,
      pattern: /^[a-zA-Z0-9._]+$/,
      message: "TikTok username can only contain letters, numbers, dots, and underscores"
    },
    color: "text-black dark:text-white"
  },
  {
    id: "snapchat",
    name: "Snapchat",
    icon: Camera,
    urlPattern: "https://snapchat.com/add/{handle}",
    placeholder: "username",
    validation: {
      minLength: 3,
      maxLength: 15,
      pattern: /^[a-zA-Z0-9._-]+$/,
      message: "Snapchat username can only contain letters, numbers, dots, underscores, and hyphens"
    },
    color: "text-yellow-500"
  },
  {
    id: "pinterest",
    name: "Pinterest",
    icon: Heart,
    urlPattern: "https://pinterest.com/{handle}",
    placeholder: "username",
    validation: {
      minLength: 3,
      maxLength: 30,
      pattern: /^[a-zA-Z0-9._]+$/,
      message: "Pinterest username can only contain letters, numbers, dots, and underscores"
    },
    color: "text-red-500"
  },
  {
    id: "behance",
    name: "Behance",
    icon: Palette,
    urlPattern: "https://behance.net/{handle}",
    placeholder: "username",
    validation: {
      minLength: 1,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9-]+$/,
      message: "Behance username can only contain letters, numbers, and hyphens"
    },
    color: "text-blue-600"
  },
  {
    id: "dribbble",
    name: "Dribbble",
    icon: Circle,
    urlPattern: "https://dribbble.com/{handle}",
    placeholder: "username",
    validation: {
      minLength: 1,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9-]+$/,
      message: "Dribbble username can only contain letters, numbers, and hyphens"
    },
    color: "text-pink-500"
  },
  {
    id: "figma",
    name: "Figma",
    icon: Circle,
    urlPattern: "https://figma.com/@{handle}",
    placeholder: "username",
    validation: {
      minLength: 1,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9-]+$/,
      message: "Figma username can only contain letters, numbers, and hyphens"
    },
    color: "text-purple-500"
  },
  {
    id: "notion",
    name: "Notion",
    icon: FileText,
    urlPattern: "https://notion.so/{handle}",
    placeholder: "page-id",
    validation: {
      minLength: 1,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9-]+$/,
      message: "Notion page ID can only contain letters, numbers, and hyphens"
    },
    color: "text-black dark:text-white"
  },
  {
    id: "substack",
    name: "Substack",
    icon: Rss,
    urlPattern: "https://{handle}.substack.com",
    placeholder: "publication-name",
    validation: {
      minLength: 1,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9-]+$/,
      message: "Substack publication name can only contain letters, numbers, and hyphens"
    },
    color: "text-orange-500"
  },
  {
    id: "patreon",
    name: "Patreon",
    icon: Gift,
    urlPattern: "https://patreon.com/{handle}",
    placeholder: "creator-name",
    validation: {
      minLength: 1,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9-]+$/,
      message: "Patreon creator name can only contain letters, numbers, and hyphens"
    },
    color: "text-orange-500"
  },
  {
    id: "buymeacoffee",
    name: "Buy Me a Coffee",
    icon: Coffee,
    urlPattern: "https://buymeacoffee.com/{handle}",
    placeholder: "username",
    validation: {
      minLength: 1,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9-]+$/,
      message: "Buy Me a Coffee username can only contain letters, numbers, and hyphens"
    },
    color: "text-orange-500"
  },
  {
    id: "kofi",
    name: "Ko-fi",
    icon: Zap,
    urlPattern: "https://ko-fi.com/{handle}",
    placeholder: "username",
    validation: {
      minLength: 1,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9-]+$/,
      message: "Ko-fi username can only contain letters, numbers, and hyphens"
    },
    color: "text-purple-500"
  }
]

export function getPlatformById(id: string): SocialMediaPlatform | undefined {
  return socialMediaPlatforms.find(platform => platform.id === id)
}

export function getPlatformByName(name: string): SocialMediaPlatform | undefined {
  return socialMediaPlatforms.find(platform => 
    platform.name.toLowerCase() === name.toLowerCase()
  )
}

export function generateSocialMediaUrl(platform: SocialMediaPlatform, handle: string): string {
  return platform.urlPattern.replace('{handle}', handle)
} 