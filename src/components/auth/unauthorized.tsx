import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Shield, ArrowLeft } from "lucide-react"

interface UnauthorizedProps {
  title?: string
  message?: string
  showBackButton?: boolean
  backUrl?: string
}

/**
 * Component to display when user doesn't have proper authorization
 */
export function Unauthorized({ 
  title = "Access Denied", 
  message = "You don't have permission to access this area.",
  showBackButton = true,
  backUrl = "/dashboard"
}: UnauthorizedProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
            {title}
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <p className="font-medium mb-1">What you can do:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Contact an administrator for access</li>
                  <li>• Return to your dashboard</li>
                  <li>• Continue learning with available courses</li>
                </ul>
              </div>
            </div>
          </div>
          
          {showBackButton && (
            <div className="flex gap-3">
              <Button asChild variant="outline" className="flex-1">
                <Link href={backUrl}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/dashboard">
                  Dashboard
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 