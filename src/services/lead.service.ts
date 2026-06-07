import { prisma } from "@/lib/prisma"
import { LeadsLogInput } from "@/backend-schemas/leads-log.schema"

export interface GetLeadsLogsParams {
  page: number
  limit: number
  search?: string
  projectId?: string
  startDate?: string
  endDate?: string
}

export async function getLeadsLogs(params: GetLeadsLogsParams) {
  const { page, limit, search, projectId, startDate, endDate } = params
  const skip = (page - 1) * limit
  
  const where: any = {}
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { message: { contains: search, mode: 'insensitive' } },
    ]
  }
  
  if (projectId) {
    where.projectId = projectId
  }
  
  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) where.createdAt.gte = new Date(startDate)
    if (endDate) where.createdAt.lte = new Date(endDate)
  }
  
  const [data, total] = await Promise.all([
    prisma.leadsLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    }),
    prisma.leadsLog.count({ where })
  ])
  
  return {
    items: data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export async function deleteLeadsLog(id: string) {
  const existing = await prisma.leadsLog.findUnique({ where: { id } })
  if (!existing) throw new Error("LeadsLog not found")
  
  return await prisma.leadsLog.delete({ where: { id } })
}

export async function createLeadsLog(data: LeadsLogInput & { ipAddress?: string, userAgent?: string }) {
  return await prisma.leadsLog.create({
    data: {
      name: data.name || null,
      phone: data.phone || null,
      message: data.message || null,
      projectId: data.projectId || null,
      pageUrl: data.pageUrl || null,
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
    }
  })
}