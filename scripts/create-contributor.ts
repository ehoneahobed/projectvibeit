import { connectDB } from "../src/lib/db"
import { User } from "../src/lib/models"
import bcrypt from "bcryptjs"

async function createContributorUser() {
  try {
    await connectDB()
    
    const contributorEmail = "contributor@vibeit.com"
    const contributorPassword = "contributor123"
    
    // Check if contributor already exists
    const existingContributor = await User.findOne({ email: contributorEmail })
    if (existingContributor) {
      console.log("Contributor user already exists!")
      console.log("Email:", contributorEmail)
      console.log("Role:", existingContributor.role)
      process.exit(0)
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(contributorPassword, 12)
    
    // Create contributor user
    const contributorUser = new User({
      name: "Content Contributor",
      email: contributorEmail,
      password: hashedPassword,
      role: "contributor",
      emailVerified: new Date(),
      planName: "contributor"
    })
    
    await contributorUser.save()
    
    console.log("✅ Contributor user created successfully!")
    console.log("Email:", contributorEmail)
    console.log("Password:", contributorPassword)
    console.log("Role: contributor")
    console.log("\nThis user can access courses and community features in the admin portal")
    
  } catch (error) {
    console.error("❌ Error creating contributor user:", error)
  } finally {
    process.exit(0)
  }
}

createContributorUser() 