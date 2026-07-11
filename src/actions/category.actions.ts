"use server"

import { prisma } from "@/lib/prisma"

export async function getCategories(params: { page?: number; limit?: number; search?: string; type?: string } = {}) {
  const { page = 1, limit = 50, search, type } = params
  const skip = (page - 1) * limit
  const where: Record<string, unknown> = {}
  if (type) where.type = type
  if (search) where.name = { contains: search, mode: "insensitive" as const }

  const [data, total] = await Promise.all([
    prisma.category.findMany({ where: where as any, skip, take: limit, orderBy: { name: "asc" } }),
    prisma.category.count({ where: where as any }),
  ])
  return { data, total, page, totalPages: Math.ceil(total / limit) }
}

export async function createCategory(data: { name: string; slug: string; type: "blog" | "project"; description?: string | null }) {
  return prisma.category.create({ data: { ...data, description: data.description || null } })
}

export async function updateCategory(id: string, data: { name?: string; slug?: string; type?: "blog" | "project"; description?: string | null }) {
  return prisma.category.update({ where: { id }, data })
}

export async function deleteCategories(ids: string[]) {
  try {
    const result = await prisma.category.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })
    return { deletedCount: result.count }
  } catch (error) {
    console.error("Gagal menghapus kategori:", error)
    throw new Error("Gagal menghapus kategori")
  }
}