import dbConnect from "./mongoose"

export async function connectDB() {
  try {
    await dbConnect()
  } catch (error) {
    console.error("Failed to connect to database:", error)
    throw error
  }
}