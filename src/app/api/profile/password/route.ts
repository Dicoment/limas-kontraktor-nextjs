import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response"
import bcrypt from "bcryptjs"

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return unauthorizedResponse()
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return errorResponse("Password saat ini dan password baru harus diisi")
    }

    if (newPassword.length < 6) {
      return errorResponse("Password baru minimal 6 karakter")
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true },
    })

    if (!user) {
      return errorResponse("User tidak ditemukan", 404)
    }

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return errorResponse("Password saat ini salah", 400)
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    })

    return successResponse({ message: "Password berhasil diganti" })
  } catch (error) {
    console.error("PUT /api/profile/password:", error)
    return errorResponse("Failed to change password", 500)
  }
}
