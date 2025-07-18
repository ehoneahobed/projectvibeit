import { Navigation } from "@/components/navigation"

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

/**
 * Layout for authenticated pages that includes navigation
 */
export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navigation />
      <main>
        {children}
      </main>
    </div>
  )
} 