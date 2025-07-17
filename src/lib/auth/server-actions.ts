import { auth } from "./auth"
import { User, type IUser } from "@/lib/models"
import { connectDB } from "@/lib/db"

/**
 * Get the current user (server-side only)
 * @returns The current user
 */
export async function getCurrentUser(): Promise<Omit<IUser, "password"> | null> {
  try {
    await connectDB()
    const session = await auth()
    if (!session?.user) {
      return null
    }

    const user = await User.findOne({
      _id: session.user.id,
      archivedAt: null,
    })

    if (!user) {
      return null
    }

    // exclude password
    const { password: _password, ...userWithoutPassword } = user.toObject()

    return userWithoutPassword
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}