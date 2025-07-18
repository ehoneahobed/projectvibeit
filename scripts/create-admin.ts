import { connectDB } from "../src/lib/db"
import { User } from "../src/lib/models"
import bcrypt from "bcryptjs"

async function createAdminUser() {
  try {
    await connectDB()
    
    const adminEmail = "admin@vibeit.com"
    const adminPassword = "admin123"
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail })
    if (existingAdmin) {
      console.log("Admin user already exists!")
      console.log("Email:", adminEmail)
      console.log("Role:", existingAdmin.role)
      process.exit(0)
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    
    // Create admin user
    const adminUser = new User({
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      emailVerified: new Date(),
      planName: "admin"
    })
    
    await adminUser.save()
    
    console.log("✅ Admin user created successfully!")
    console.log("Email:", adminEmail)
    console.log("Password:", adminPassword)
    console.log("Role: admin")
    console.log("\nYou can now log in to the admin portal at /portal")
    
  } catch (error) {
    console.error("❌ Error creating admin user:", error)
  } finally {
    process.exit(0)
  }
}

createAdminUser() 