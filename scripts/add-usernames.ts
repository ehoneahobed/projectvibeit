import { config } from "dotenv"
import { resolve } from "path"
import mongoose from "mongoose"

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

/**
 * Migration script to add usernames to existing users
 * Generates unique usernames based on name or email
 */
async function addUsernamesToExistingUsers() {
  try {
    const MONGODB_URI = process.env.DATABASE_URL
    if (!MONGODB_URI) {
      throw new Error("Please define the DATABASE_URL environment variable inside .env.local")
    }

    await mongoose.connect(MONGODB_URI)
    console.log("Connected to database")

    // Define the User schema for this migration
    const UserSchema = new mongoose.Schema({
      name: String,
      username: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        match: /^[a-zA-Z0-9_-]+$/
      },
      email: { type: String, required: true, unique: true },
      emailVerified: Date,
      password: String,
      image: String,
      githubUsername: String,
      role: { 
        type: String, 
        enum: ["student", "contributor", "admin"], 
        default: "student" 
      },
      progress: [{
        courseId: { type: String, required: true },
        moduleId: { type: String, required: true },
        lessonId: { type: String, required: true },
        completedLessons: [{ type: String }],
        completedProjects: [{ type: String }],
        totalProgress: { type: Number, default: 0 },
        completedAt: Date,
      }],
      stripeCustomerId: { type: String, unique: true, sparse: true },
      stripeSubscriptionId: { type: String, unique: true, sparse: true },
      planName: { type: String, default: "free" },
      subscriptionStatus: String,
      archivedAt: Date,
    }, {
      timestamps: true,
    })

    const User = mongoose.models.User || mongoose.model("User", UserSchema)

    // Find all users without usernames
    const usersWithoutUsernames = await User.find({ username: { $exists: false } })
    console.log(`Found ${usersWithoutUsernames.length} users without usernames`)

    for (const user of usersWithoutUsernames) {
      const username = generateUsername(user.name || user.email)
      
      // Check if username already exists and generate a unique one
      let counter = 1
      let finalUsername = username
      while (await User.findOne({ username: finalUsername })) {
        finalUsername = `${username}${counter}`
        counter++
      }

      // Update user with username
      await User.findByIdAndUpdate(user._id, { username: finalUsername })
      console.log(`Added username "${finalUsername}" to user ${user.email}`)
    }

    console.log("Migration completed successfully!")
    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

/**
 * Generate a username from name or email
 */
function generateUsername(nameOrEmail: string): string {
  // Remove special characters and convert to lowercase
  let username = nameOrEmail
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '') // Remove spaces
    .trim()

  // If empty or too short, use a default
  if (!username || username.length < 3) {
    username = 'learner'
  }

  // Truncate if too long
  if (username.length > 30) {
    username = username.substring(0, 30)
  }

  return username
}

// Run the migration
addUsernamesToExistingUsers() 