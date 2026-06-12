export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { auth, signOut } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const session = await auth()
    
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  await signOut({ redirectTo: "/login" })
  return NextResponse.redirect(new URL("/login", request.url))
}
