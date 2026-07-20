import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return unauthorizedResponse()
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true, avatar: true, role: true, createdAt: true },
    })

    if (!user) {
      return errorResponse("User not found", 404)
    }

    return successResponse({ data: user })
  } catch (error) {
    console.error("GET /api/profile:", error)
    return errorResponse("Failed to fetch profile", 500)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return unauthorizedResponse()
    }

    const body = await request.json()

    // FIX: sebelumnya cuma `name` yang disimpan, `email` dan `avatar` yang
    // dikirim dari ProfilePage.tsx dibuang gitu aja. `avatar` sebelumnya
    // juga gak ada kolomnya di schema User sama sekali.
    if (body.email !== undefined) {
      const existing = await prisma.user.findUnique({ where: { email: body.email } })
      if (existing && existing.id !== session.user.id) {
        return errorResponse("Email sudah dipakai user lain", 409)
      }
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.avatar !== undefined && { avatar: body.avatar }),
      },
      select: { id: true, email: true, name: true, avatar: true, role: true },
    })

    return successResponse({ data: updated, message: "Profil berhasil diperbarui" })
  } catch (error) {
    console.error("PUT /api/profile:", error)
    return errorResponse("Failed to update profile", 500)
  }
}