import dotenv from "dotenv"
import mongoose from "mongoose"
import { User } from "../src/lib/models"

// Load environment variables
dotenv.config({ path: ".env.local" })

async function fixUsernames() {
  try {
    // Connect to MongoDB directly
    const DATABASE_URL = process.env.DATABASE_URL
    if (!DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required")
    }
    
    await mongoose.connect(DATABASE_URL)
    console.log("Connected to database")

    // Find users without usernames
    const usersWithoutUsername = await User.find({ 
      $or: [
        { username: { $exists: false } },
        { username: null },
        { username: "" }
      ]
    })

    console.log(`Found ${usersWithoutUsername.length} users without usernames`)

    for (const user of usersWithoutUsername) {
      let username = ""

      // Try to generate username from email first
      if (user.email) {
        username = user.email.split('@')[0].toLowerCase()
        // Remove any non-alphanumeric characters except underscore and hyphen
        username = username.replace(/[^a-z0-9_-]/g, '')
        // Ensure it's at least 3 characters
        if (username.length < 3) {
          username = username + "user"
        }
        // Truncate if too long
        if (username.length > 30) {
          username = username.substring(0, 30)
        }
      } else if (user.name) {
        // Fallback to name
        username = user.name.toLowerCase().replace(/[^a-z0-9_-]/g, '')
        if (username.length < 3) {
          username = username + "user"
        }
        if (username.length > 30) {
          username = username.substring(0, 30)
        }
      } else {
        // Final fallback
        username = "user" + Math.random().toString(36).substring(2, 8)
      }

      // Ensure username is unique
      let counter = 1
      let finalUsername = username
      while (await User.findOne({ username: finalUsername })) {
        finalUsername = `${username}${counter}`
        counter++
      }

      // Update the user
      user.username = finalUsername
      await user.save()
      console.log(`Updated user ${user.email || user.name || user._id} with username: ${finalUsername}`)
    }

    console.log("Username fix completed!")
    process.exit(0)
  } catch (error) {
    console.error("Error fixing usernames:", error)
    process.exit(1)
  }
}

fixUsernames() 