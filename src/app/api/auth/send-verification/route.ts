import crypto from "crypto"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"
import VerificationEmail from "@/lib/email-templates/verification-email"
import { logger } from "@/lib/logger"
import { User, VerificationToken } from "@/lib/models"
import { sendEmail } from "@/lib/send-email"
import { saltAndHash } from "@/lib/utils"
import { connectDB } from "@/lib/db"

async function handleSendVerificationEmail(
  email: string,
  mode: "resend" | "send"
) {
  await connectDB()
  const token = crypto.randomBytes(32).toString("hex")
  const hashedToken = await saltAndHash(token)
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours

  if (mode === "resend") {
    await VerificationToken.updateOne(
      { identifier: email },
      { token: hashedToken, expires }
    )
  } else {
    await VerificationToken.create({
      identifier: email,
      token: hashedToken,
      expires,
    })
  }

  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`

  const { error } = await sendEmail({
    to: email,
    subject: "Verify your email",
    react: VerificationEmail({
      verificationUrl,
      unsubscribeUrl: "#",
    }),
  })

  if (error) {
    logger.error(error, "Failed to send verification email")
    return {
      success: false,
      error: error.message,
    }
  }

  return {
    success: true,
    message: "Verification email sent",
  }
}

export async function POST() {
  const session = await auth()

  if (!session || !session.user || !session.user.email) {
    logger.error("Unauthorized")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    const { email } = session.user

    const user = await User.findOne({ email }, { email: 1, emailVerified: 1 })

    if (!user) {
      logger.error("User not found")
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.emailVerified) {
      logger.error("Email already verified")
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      )
    }

    const existingToken = await VerificationToken.findOne({
      identifier: email,
      expires: { $gt: new Date() },
    })

    if (existingToken) {
      logger.error("Verification token already exists")

      const { success, message, error } = await handleSendVerificationEmail(
        email,
        "resend"
      )

      if (!success) {
        logger.error(error, "Failed to send verification email")
        return NextResponse.json({ error }, { status: 500 })
      }

      return NextResponse.json({ message }, { status: 200 })
    }

    const { success, message, error } = await handleSendVerificationEmail(
      email,
      "send"
    )

    if (!success) {
      logger.error(error, "Failed to send verification email")
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      )
    }

    return NextResponse.json({ message }, { status: 200 })
  } catch (error) {
    logger.error(error, "Failed to send verification email")
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    )
  }
}
