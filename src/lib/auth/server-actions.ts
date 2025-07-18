import { auth } from "@/lib/auth/auth"

/**
 * Get the current user (server-side only)
 * @returns The current user
 */
export async function getCurrentUser() {
  try {
    const session = await auth()
    if (!session?.user) {
      return null
    }

    return session.user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}