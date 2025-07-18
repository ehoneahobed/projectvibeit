import { NextRequest, NextResponse } from "next/server"
import { checkUsernameAvailability } from "@/lib/profile-actions"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { error: 'Username parameter is required' },
        { status: 400 }
      )
    }

    const result = await checkUsernameAvailability(username)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Error in check-username API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 