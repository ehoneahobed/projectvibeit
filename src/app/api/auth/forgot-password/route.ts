import crypto from "crypto"
import { NextResponse, type NextRequest } from "next/server"

import { sendPasswordResetEmail } from "@/lib/email-templates/send-password-reset-email"
import { logger } from "@/lib/logger"
import { User, PasswordResetToken } from "@/lib/models"
import { forgotPasswordSchema } from "@/lib/validations/auth.schema"
import { connectDB } from "@/lib/db"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { success, error, data } = forgotPasswordSchema.safeParse(body)

  if (!success) {
    logger.error(error.message, "Invalid request body")
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  try {
    await connectDB()
    const { email } = data
    const user = await User.findOne({ email }, { email: 1 })

    if (!user) {
      logger.warn("No user found with this email")
      return NextResponse.json(
        { error: "No user found with this email" },
        { status: 404 }
      )
    }

    const passwordResetToken = await PasswordResetToken.create({
      email,
      token: crypto.randomBytes(32).toString("hex"),
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    })

    await sendPasswordResetEmail({
      email: passwordResetToken.email,
      token: passwordResetToken.token,
    })

    logger.info("Password reset email sent successfully")
    return NextResponse.json(
      { message: "Password reset email sent successfully" },
      { status: 200 }
    )
  } catch (error) {
    logger.error(error, "Failed to send password reset email")
    return NextResponse.json(
      { error: "Failed to send password reset email" },
      { status: 500 }
    )
  }
}
