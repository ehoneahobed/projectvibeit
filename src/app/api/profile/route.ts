import { NextRequest, NextResponse } from "next/server"
import { getUserProfile } from "@/lib/profile-actions"

export async function GET(_request: NextRequest) {
  try {
    const result = await getUserProfile()
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Error in profile API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 