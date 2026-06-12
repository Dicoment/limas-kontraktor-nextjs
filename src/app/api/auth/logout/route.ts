import { NextRequest, NextResponse } from "next/server"
import { auth, signOut } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const session = await auth()
   
  if (!session) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
  }

  try {
    await signOut()
      
    return NextResponse.json({ success: true, redirectTo: "/login" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, error: "Logout failed" }, { status: 500 })
  }
}