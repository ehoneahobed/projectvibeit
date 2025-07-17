import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"
import { logger } from "@/lib/logger"
import { User } from "@/lib/models"
import { stripe } from "@/lib/stripe"
import { connectDB } from "@/lib/db"

export async function POST() {
  try {
    await connectDB()
    const session = await auth()

    if (!session?.user?.id) {
      logger.error("Authentication required")
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Get the user from the database
    const user = await User.findById(session.user.id, { stripeCustomerId: 1 })

    if (!user?.stripeCustomerId) {
      logger.error("No Stripe customer found")
      return NextResponse.json(
        { error: "No Stripe customer found" },
        { status: 404 }
      )
    }

    // Create a portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/portal/settings`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    logger.error(error, "Error creating portal session")
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
