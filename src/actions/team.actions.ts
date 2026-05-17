import { prisma } from "@/lib/prisma"

export type TeamRecord = { id: string; name: string; position: string | null; email: string | null; displayOrder: string | number | null }

export async function getTeams(params: { page?: number; limit?: number; search?: string } = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 20
  const skip = (page - 1) * limit
  const where: Record<string, unknown> = {}

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" as const } },
      { position: { contains: params.search, mode: "insensitive" as const } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.team.findMany({
      where: where as any,
      orderBy: { displayOrder: "asc" },
      skip,
      take: limit,
    }),
    prisma.team.count({ where: where as any }),
  ])
  return { data, total, page, totalPages: Math.ceil(total / limit) }
}

export async function createTeam(data: { name: string; position?: string | null; bio?: string | null; avatar?: string | null; email?: string | null; phone?: string | null; displayOrder?: number | null }) {
  return prisma.team.create({ data })
}

export async function updateTeam(id: string, data: { name?: string; position?: string | null; bio?: string | null; avatar?: string | null; email?: string | null; phone?: string | null; displayOrder?: number }) {
  return prisma.team.update({ where: { id }, data })
}