import { config } from "dotenv"
import { resolve } from "path"
import mongoose from "mongoose"

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

/**
 * Migration script to add new profile fields to existing users
 */
async function addProfileFieldsToExistingUsers() {
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
      bio: String,
      githubUsername: String,
      twitterUsername: String,
      linkedinUsername: String,
      website: String,
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

    // Find all users and ensure they have the new fields
    const users = await User.find({})
    console.log(`Found ${users.length} users to update`)

    let updatedCount = 0
    for (const user of users) {
      let needsUpdate = false
      const updates: Record<string, string> = {}

      // Check and add missing fields
      if (user.bio === undefined) {
        updates.bio = ""
        needsUpdate = true
      }
      if (user.twitterUsername === undefined) {
        updates.twitterUsername = ""
        needsUpdate = true
      }
      if (user.linkedinUsername === undefined) {
        updates.linkedinUsername = ""
        needsUpdate = true
      }
      if (user.website === undefined) {
        updates.website = ""
        needsUpdate = true
      }

      if (needsUpdate) {
        await User.findByIdAndUpdate(user._id, { $set: updates })
        updatedCount++
        console.log(`Updated profile fields for user ${user.email}`)
      }
    }

    console.log(`Migration completed successfully! Updated ${updatedCount} users.`)
    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

// Run the migration
addProfileFieldsToExistingUsers() 