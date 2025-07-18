import { connectDB } from "../src/lib/db"
import { User } from "../src/lib/models"

async function addSocialMediaField() {
  try {
    await connectDB()
    
    console.log("Starting migration: Adding socialMedia field to users...")
    
    // Update all users to have an empty socialMedia array if they don't have one
    const result = await User.updateMany(
      { socialMedia: { $exists: false } },
      { $set: { socialMedia: [] } }
    )
    
    console.log(`✅ Migration completed successfully!`)
    console.log(`Updated ${result.modifiedCount} users`)
    
    // Verify the migration
    const usersWithoutSocialMedia = await User.countDocuments({ socialMedia: { $exists: false } })
    console.log(`Users without socialMedia field: ${usersWithoutSocialMedia}`)
    
    if (usersWithoutSocialMedia === 0) {
      console.log("✅ All users now have the socialMedia field")
    } else {
      console.log("⚠️  Some users still don't have the socialMedia field")
    }
    
  } catch (error) {
    console.error("❌ Error during migration:", error)
  } finally {
    process.exit(0)
  }
}

addSocialMediaField() 