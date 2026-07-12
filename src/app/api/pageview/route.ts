import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { path, ip, ua } = await request.json()
    if (!path) return NextResponse.json({ success: false }, { status: 400 })

    // Hash IP+UA, jangan simpan data personal mentah. Dipakai buat estimasi
    // "Unique Visitors" (kombinasi IP+UA unik per hari).
    const visitorHash = crypto.createHash("sha256").update(`${ip}-${ua}`).digest("hex")

    await prisma.pageView.create({ data: { path, visitorHash } })
    return NextResponse.json({ success: true })
  } catch {
    // Sengaja gak return error ke client — logging gak boleh ganggu UX
    return NextResponse.json({ success: false }, { status: 200 })
  }
}