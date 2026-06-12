import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return unauthorizedResponse()
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
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

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
      },
      select: { id: true, email: true, name: true, role: true },
    })

    return successResponse({ data: updated, message: "Profil berhasil diperbarui" })
  } catch (error) {
    console.error("PUT /api/profile:", error)
    return errorResponse("Failed to update profile", 500)
  }
}

