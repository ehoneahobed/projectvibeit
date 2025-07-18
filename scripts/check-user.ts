import dotenv from "dotenv"
import mongoose from "mongoose"
import { User } from "../src/lib/models"

// Load environment variables
dotenv.config({ path: ".env.local" })

async function checkUser() {
  try {
    // Connect to MongoDB directly
    const DATABASE_URL = process.env.DATABASE_URL
    if (!DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required")
    }
    
    await mongoose.connect(DATABASE_URL)
    console.log("Connected to database")

    // Find the user with username "obedehoneah"
    const user = await User.findOne({ username: "obedehoneah" })
    
    if (user) {
      console.log("User found:")
      console.log("ID:", user._id.toString())
      console.log("Username:", user.username)
      console.log("Email:", user.email)
      console.log("Name:", user.name)
      console.log("Full user object:", JSON.stringify(user.toObject(), null, 2))
    } else {
      console.log("User not found with username 'obedehoneah'")
      
      // List all users
      const allUsers = await User.find({}, { username: 1, email: 1, name: 1 })
      console.log("All users:", allUsers.map(u => ({ 
        id: u._id.toString(), 
        username: u.username, 
        email: u.email, 
        name: u.name 
      })))
    }

    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error("Error checking user:", error)
    process.exit(1)
  }
}

checkUser() 