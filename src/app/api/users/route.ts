import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response"
import bcrypt from "bcryptjs"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, avatar: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  })
  return successResponse(users)
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorizedResponse()

    const body = await request.json()
    const { name, email, password } = body

    if (!email || !password) {
      return errorResponse("Email dan password wajib diisi")
    }
    if (password.length < 6) {
      return errorResponse("Password minimal 6 karakter")
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return errorResponse("Email sudah terdaftar", 409)
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name: name || null, email, password: hashedPassword },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    return successResponse(user, 201)
  } catch (error) {
    console.error("POST /api/users:", error)
    return errorResponse("Failed to create user", 500)
  }
}