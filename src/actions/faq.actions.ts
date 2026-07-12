"use server"

import { prisma } from "@/lib/prisma"

export async function getFaqs(params: { page?: number; limit?: number; search?: string } = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 10
  const skip = (page - 1) * limit
  const where: Record<string, unknown> = {}
  if (params.search) {
    where.OR = [
      { question: { contains: params.search, mode: "insensitive" as const } },
      { answer: { contains: params.search, mode: "insensitive" as const } },
    ]
  }

  const [faqs, total] = await Promise.all([
    prisma.faq.findMany({ where: where as any, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.faq.count({ where: where as any }),
  ])
  return { faqs, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getFaqById(id: string) {
  return prisma.faq.findUnique({ where: { id } })
}

export async function deleteFaqs(ids: string[]) {
  if (ids.length === 0) return { success: true, deletedCount: 0 }
  const result = await prisma.faq.deleteMany({ where: { id: { in: ids } } })
  return { success: true, deletedCount: result.count }
}