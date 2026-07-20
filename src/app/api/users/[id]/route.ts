import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse } from "@/lib/api-response"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorizedResponse()

    const { id } = await params

    // Jangan bisa hapus akun sendiri sambil masih login
    if (id === session.user.id) {
      return errorResponse("Gak bisa hapus akun sendiri yang sedang login", 400)
    }

    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) return notFoundResponse("User")

    await prisma.user.delete({ where: { id } })
    return successResponse({ message: "User berhasil dihapus" })
  } catch (error) {
    console.error("DELETE /api/users/[id]:", error)
    return errorResponse("Failed to delete user", 500)
  }
}