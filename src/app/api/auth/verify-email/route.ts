import { NextResponse, type NextRequest } from "next/server"

import { auth } from "@/lib/auth/auth"
import { logger } from "@/lib/logger"
import { User, VerificationToken } from "@/lib/models"
import { saltAndHash } from "@/lib/utils"
import { connectDB } from "@/lib/db"

export async function PATCH(request: NextRequest) {
  const token = new URL(request.url).searchParams.get("token")
  const session = await auth()

  if (!session || !session.user || !session.user.email) {
    logger.error("Unauthorized")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!token) {
    logger.error("Missing token")
    return NextResponse.json({ error: "Missing token" }, { status: 400 })
  }

  await connectDB()
  const hashedToken = await saltAndHash(token)

  const existingToken = await VerificationToken.findOne({
    identifier: session.user.email,
    token: hashedToken,
    expires: { $gt: new Date() },
  })

  if (!existingToken) {
    logger.error("Invalid token")
    return NextResponse.json({ error: "Invalid token" }, { status: 400 })
  }

  try {
    await User.updateOne(
      { email: existingToken.identifier },
      { emailVerified: new Date() }
    )

    await VerificationToken.deleteOne({
      identifier: existingToken.identifier,
      token: existingToken.token,
    })

    logger.info("Email verified successfully")
    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    )
  } catch (error) {
    logger.error(error, "Failed to verify email")
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    )
  }
}
