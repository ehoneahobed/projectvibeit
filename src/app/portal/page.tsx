import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/auth"
import { AuthCheck } from "@/components/auth/auth-check"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function PortalPage() {
  const session = await auth()
  
  // Protect the page - redirect to sign in if not authenticated
  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">
          Welcome back, {session.user.name || session.user.email}
        </h1>
        <DashboardContent />
      </div>
    </AuthCheck>
  )
}
