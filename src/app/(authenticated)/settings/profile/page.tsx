import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/auth"
import { EnhancedProfileSettingsForm } from "@/components/enhanced-profile-settings-form"

export default async function ProfileSettingsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=' + encodeURIComponent('/settings/profile'))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Manage your profile information, username, and social media accounts
          </p>
        </div>

        {/* Profile Settings Form */}
        <EnhancedProfileSettingsForm user={session.user} />
      </div>
    </div>
  )
} 