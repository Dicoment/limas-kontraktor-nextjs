import { prisma } from "@/lib/prisma"
import { TeamInput, TeamUpdateInput } from "@/backend-schemas/team.schema"
import { formatTeam, formatTeams, validateEmail, validatePhone } from "@/helpers/team-helpers"

export async function getTeams(params: {
  page: number
  limit: number
  search?: string
  hasProject?: boolean
  includeProjects?: boolean
}) {
  const { page, limit, search, hasProject, includeProjects = false } = params
  const skip = (page - 1) * limit
  
  const where: any = {}
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { position: { contains: search, mode: 'insensitive' } },
      { bio: { contains: search, mode: 'insensitive' } },
    ]
  }
  
  if (hasProject === true) {
    where.projectTeams = { some: {} }
  } else if (hasProject === false) {
    where.projectTeams = { none: {} }
  }
  
  const [data, total] = await Promise.all([
    prisma.team.findMany({
      where,
      skip,
      take: limit,
      orderBy: { displayOrder: 'asc' },
      ...(includeProjects && {
        include: {
          projectTeams: {
            include: {
              projEntry: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  status: true,
                  coverImage: true
                }
              }
            }
          }
        }
      })
    }),
    prisma.team.count({ where })
  ])
  
  return {
    items: includeProjects ? formatTeams(data) : data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export async function getTeamById(id: string, includeProjects: boolean = true) {
  const team = await prisma.team.findUnique({
    where: { id },
    ...(includeProjects && {
      include: {
        projectTeams: {
          include: {
            projEntry: {
              select: {
                id: true,
                title: true,
                slug: true,
                status: true,
                coverImage: true
              }
            }
          }
        }
      }
    })
  })
  
  return team ? (includeProjects ? formatTeam(team) : team) : null
}

export async function createTeam(data: TeamInput) {
  // Validate email format if provided
  let validatedEmail = null
  if (data.email) {
    validatedEmail = validateEmail(data.email)
  }
  
  // Validate phone format if provided
  let validatedPhone = null
  if (data.phone) {
    validatedPhone = validatePhone(data.phone)
  }
  
  const team = await prisma.team.create({
    data: {
      name: data.name,
      position: data.position || null,
      bio: data.bio || null,
      avatar: data.avatar || null,
      email: validatedEmail,
      phone: validatedPhone,
      displayOrder: data.displayOrder ?? 0,
    },
  })
  
  return team
}

export async function updateTeam(id: string, data: TeamUpdateInput) {
  const existing = await prisma.team.findUnique({ where: { id } })
  if (!existing) throw new Error("Team not found")
  
  // Validate email format if provided
  let validatedEmail = existing.email
  if (data.email !== undefined) {
    validatedEmail = data.email ? validateEmail(data.email) : null
  }
  
  // Validate phone format if provided
  let validatedPhone = existing.phone
  if (data.phone !== undefined) {
    validatedPhone = data.phone ? validatePhone(data.phone) : null
  }
  
  const team = await prisma.team.update({
    where: { id },
    data: {
      ...data,
      email: validatedEmail,
      phone: validatedPhone,
    },
  })
  
  return team
}

export async function deleteTeam(id: string) {
  const existing = await prisma.team.findUnique({
    where: { id },
    include: {
      projectTeams: {
        select: { projectId: true }
      }
    }
  })
  
  if (!existing) throw new Error("Team not found")
  
  if (existing.projectTeams.length > 0) {
    throw new Error("Cannot delete team member assigned to projects")
  }
  
  return await prisma.team.delete({ where: { id } })
}

export async function reorderTeams(teams: Array<{ id: string; displayOrder: number }>) {
  await prisma.$transaction(
    teams.map(({ id, displayOrder }) =>
      prisma.team.update({
        where: { id },
        data: { displayOrder }
      })
    )
  )
  
  return { success: true }
}

export async function getActiveTeams(limit?: number) {
  const teams = await prisma.team.findMany({
    orderBy: { displayOrder: 'asc' },
    ...(limit && { take: limit })
  })
  
  return teams
}