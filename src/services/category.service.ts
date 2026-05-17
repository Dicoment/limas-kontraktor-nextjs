import { prisma } from '@/lib/prisma'

/**
 * Get categories with pagination and filtering
 */
export async function getCategories(params: {
  page?: number
  limit?: number
  search?: string
  type?: string
} = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 50
  const skip = (page - 1) * limit
  const where: Record<string, unknown> = {}
  if (params.type) where.type = params.type
  if (params.search) where.name = { contains: params.search, mode: 'insensitive' as const }

  const [data, total] = await Promise.all([
    prisma.category.findMany({ where, skip, take: limit, orderBy: { name: 'asc' } }),
    prisma.category.count({ where }),
  ])
  return { data, total, page, totalPages: Math.ceil(total / limit) }
}

/**
 * Create a new category
 */
export async function createCategory(data: {
  name: string
  slug: string
  type: 'blog' | 'project'
  description?: string | null
}) {
  return prisma.category.create({ data })
}

/**
 * Update a category by ID
 */
export async function updateCategory(id: string, data: {
  name?: string
  slug?: string
  type?: string
  description?: string | null
}) {
  return prisma.category.update({ where: { id }, data })
}

/**
 * Get all categories (no pagination)
 */
export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } })
}