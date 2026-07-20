"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function getUsers(params: { page?: number; limit?: number; search?: string } = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 20
  const skip = (page - 1) * limit
  const where: Record<string, unknown> = {}
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" as const } },
      { email: { contains: params.search, mode: "insensitive" as const } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where: where as any,
      select: { id: true, name: true, email: true, avatar: true, role: true, createdAt: true },
      skip, take: limit, orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where: where as any }),
  ])
  return { data, total, page, totalPages: Math.ceil(total / limit) }
}

export async function createUser(input: { name?: string | null; email: string; password: string }) {
  if (!input.email || !input.password) throw new Error("Email dan password wajib diisi")
  if (input.password.length < 6) throw new Error("Password minimal 6 karakter")

  const existing = await prisma.user.findUnique({ where: { email: input.email } })
  if (existing) throw new Error("Email sudah terdaftar")

  const hashedPassword = await bcrypt.hash(input.password, 10)
  return prisma.user.create({
    data: { name: input.name || null, email: input.email, password: hashedPassword },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })
}

export async function deleteUser(id: string) {
  const session = await auth()
  if (session?.user?.id === id) throw new Error("Gak bisa hapus akun sendiri yang sedang login")

  await prisma.user.delete({ where: { id } })
  return { success: true }
}

export async function deleteUsers(ids: string[]) {
  const session = await auth()
  const filteredIds = ids.filter((id) => id !== session?.user?.id)
  if (filteredIds.length === 0) return { success: true, deletedCount: 0 }

  const result = await prisma.user.deleteMany({ where: { id: { in: filteredIds } } })
  return { success: true, deletedCount: result.count }
}