"use server"

import { prisma } from "@/lib/prisma"

export async function getTags(params: { page?: number; limit?: number; search?: string } = {}) {
  const { page = 1, limit = 20, search } = params
  const skip = (page - 1) * limit
  const where: any = search ? { name: { contains: search, mode: "insensitive" } } : {}

  const [data, total] = await Promise.all([
    prisma.tag.findMany({ where, skip, take: limit, orderBy: { name: "asc" } }),
    prisma.tag.count({ where }),
  ])
  return { data, total, page, totalPages: Math.ceil(total / limit) }
}

export async function deleteTags(ids: string[]) {
  try {
    const result = await prisma.tag.deleteMany({
      where: { id: { in: ids } },
    })
    return { deletedCount: result.count }
  } catch (error) {
    console.error("Gagal menghapus tags:", error)
    throw new Error("Gagal menghapus tags")
  }
}