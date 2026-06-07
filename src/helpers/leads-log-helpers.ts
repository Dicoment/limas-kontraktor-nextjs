import { Prisma,LeadsLog } from "@/generated/client"

export type FormattedLeadsLog = LeadsLog

export function formatLeadsLog(log: LeadsLog): FormattedLeadsLog {
  return log
}

export function formatLeadsLogs(logs: LeadsLog[]): FormattedLeadsLog[] {
  return logs.map(formatLeadsLog)
}

export function buildLeadsLogWhereInput(searchParams: URLSearchParams): Prisma.LeadsLogWhereInput {
  const search = searchParams.get("search")
  const projectId = searchParams.get("projectId")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const hasPhone = searchParams.get("hasPhone")
  const hasMessage = searchParams.get("hasMessage")
  
  const where: Prisma.LeadsLogWhereInput = {}
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { phone: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { message: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { pageUrl: { contains: search, mode: Prisma.QueryMode.insensitive } },
    ]
  }
  
  if (projectId) {
    where.projectId = projectId
  }
  
  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) {
      where.createdAt.gte = new Date(startDate)
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate)
    }
  }
  
  if (hasPhone === "true") {
    where.phone = { not: null }
  } else if (hasPhone === "false") {
    where.phone = null
  }
  
  if (hasMessage === "true") {
    where.message = { not: null }
  } else if (hasMessage === "false") {
    where.message = null
  }
  
  return where
}

export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)))
  const skip = (page - 1) * limit
  
  return { page, limit, skip }
}

export function getSortParams(searchParams: URLSearchParams): Prisma.LeadsLogOrderByWithRelationInput {
  const sortBy = searchParams.get("sortBy") || "createdAt"
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc"
  
  const validSortFields = ["createdAt", "name", "phone", "projectId"]
  const field = validSortFields.includes(sortBy) ? sortBy : "createdAt"
  
  return { [field]: sortOrder }
}