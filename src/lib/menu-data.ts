import { 
  Home, 
  Settings, 
  BookOpen, 
  Users, 
  BarChart3, 
  FileText, 
  Plus, 
  List, 
  Target,
  Trophy,
  MessageSquare,
  Award,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface MenuItem {
  label: string
  href?: string
  icon: LucideIcon
  subMenu?: SubMenuItem[]
  requiredRole?: 'admin' | 'contributor' | 'any'
}

export interface SubMenuItem {
  label: string
  href: string
  icon: LucideIcon
  requiredRole?: 'admin' | 'contributor' | 'any'
}

export const menuItems: MenuItem[] = [
    {
        label: "Dashboard",
        href: "/portal",
        icon: Home,
        requiredRole: 'any'
    },
    {
        label: "Courses",
        icon: BookOpen,
        requiredRole: 'contributor',
        subMenu: [
            {
                label: "All Courses",
                href: "/portal/courses",
                icon: List,
                requiredRole: 'contributor'
            },
            {
                label: "Add Course",
                href: "/portal/courses/add",
                icon: Plus,
                requiredRole: 'contributor'
            },
            {
                label: "Course Content",
                href: "/portal/courses/content",
                icon: FileText,
                requiredRole: 'contributor'
            },
        ]
    },
    {
        label: "Users",
        icon: Users,
        requiredRole: 'admin',
        subMenu: [
            {
                label: "All Users",
                href: "/portal/users",
                icon: List,
                requiredRole: 'admin'
            },
            {
                label: "User Progress",
                href: "/portal/users/progress",
                icon: Target,
                requiredRole: 'admin'
            },
            {
                label: "Achievements",
                href: "/portal/users/achievements",
                icon: Trophy,
                requiredRole: 'admin'
            },
        ]
    },
    {
        label: "Analytics",
        icon: BarChart3,
        requiredRole: 'admin',
        subMenu: [
            {
                label: "Learning Analytics",
                href: "/portal/analytics/learning",
                icon: Target,
                requiredRole: 'admin'
            },
            {
                label: "Course Performance",
                href: "/portal/analytics/courses",
                icon: BookOpen,
                requiredRole: 'admin'
            },
            {
                label: "User Engagement",
                href: "/portal/analytics/engagement",
                icon: Users,
                requiredRole: 'admin'
            },
        ]
    },
    {
        label: "Community",
        icon: MessageSquare,
        requiredRole: 'contributor',
        subMenu: [
            {
                label: "Discussions",
                href: "/portal/community/discussions",
                icon: MessageSquare,
                requiredRole: 'contributor'
            },
            {
                label: "Project Showcase",
                href: "/portal/community/projects",
                icon: Award,
                requiredRole: 'contributor'
            },
        ]
    },
    {
        label: "Settings",
        href: "/portal/settings",
        icon: Settings,
        requiredRole: 'admin'
    },
];

/**
 * Filter menu items based on user role
 */
export function getFilteredMenuItems(userRole: string | null): MenuItem[] {
  if (!userRole) return []
  
  return menuItems.filter(item => {
    // Check if user can access this menu item
    if (item.requiredRole === 'any') return true
    if (item.requiredRole === 'contributor' && ['contributor', 'admin'].includes(userRole)) return true
    if (item.requiredRole === 'admin' && userRole === 'admin') return true
    
    return false
  }).map(item => {
    // Filter submenu items based on role
    if (item.subMenu) {
      return {
        ...item,
        subMenu: item.subMenu.filter(subItem => {
          if (subItem.requiredRole === 'any') return true
          if (subItem.requiredRole === 'contributor' && ['contributor', 'admin'].includes(userRole)) return true
          if (subItem.requiredRole === 'admin' && userRole === 'admin') return true
          return false
        })
      }
    }
    return item
  }).filter(item => {
    // Remove menu items with empty submenus
    if (item.subMenu && item.subMenu.length === 0) return false
    return true
  })
} 