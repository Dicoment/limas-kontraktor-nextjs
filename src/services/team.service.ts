import { prisma } from '@/lib/prisma'

/**
 * Get teams with pagination and filtering
 */
export async function getTeams(params: {
  page?: number
  limit?: number
  search?: string
} = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 20
  const skip = (page - 1) * limit
  const where: Record<string, unknown> = {}
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' as const } },
      { position: { contains: params.search, mode: 'insensitive' as const } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.team.findMany({ where: where as any, skip, take: limit, orderBy: { displayOrder: 'asc' as const } }),
    prisma.team.count({ where: where as any }),
  ])
  return { data, total, page, totalPages: Math.ceil(total / limit) }
}

/**
 * Get all teams (no pagination)
 */
export async function getAllTeams() {
  return prisma.team.findMany({ orderBy: { displayOrder: 'asc' as const } })
}