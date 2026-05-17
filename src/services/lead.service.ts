import { prisma } from '@/lib/prisma'

/**
 * Get leads logs with pagination and filtering
 */
export async function getLeadsLogs(params: {
  page?: number
  limit?: number
  projectId?: string
} = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 20
  const skip = (page - 1) * limit
  const where: Record<string, unknown> = {}
  if (params.projectId) where.projectId = params.projectId

  const [data, total] = await Promise.all([
    prisma.leadsLog.findMany({ where: where as any, skip, take: limit, orderBy: { createdAt: 'desc' as const } }),
    prisma.leadsLog.count({ where: where as any }),
  ])
  return { data, total, page, totalPages: Math.ceil(total / limit) }
}

/**
 * Delete a leads log by ID
 */
export async function deleteLeadsLog(id: string) {
  await prisma.leadsLog.delete({ where: { id } })
}