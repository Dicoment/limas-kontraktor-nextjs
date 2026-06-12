import { Prisma, Team } from "@prisma/client"

export type ProjectSummary = {
  id: string
  title: string
  slug: string
  coverImage: string | null
  status: string
}

export type TeamWithRelations = Team & {
  projectTeams?: Array<{ projEntry: ProjectSummary; role: string | null }>
}

export type FormattedTeam = Omit<TeamWithRelations, 'projectTeams'> & {
  projectCount?: number
  projects?: Array<{ id: string; title: string; role: string | null }>
}

export function formatTeam(team: TeamWithRelations): FormattedTeam {
  return {
    ...team,
    projectCount: team.projectTeams?.length || 0,
    projects: team.projectTeams?.map(pt => ({
      id: pt.projEntry.id,
      title: pt.projEntry.title,
      role: pt.role || null
    })) || [],
  }
}

export function formatTeams(teams: TeamWithRelations[]): FormattedTeam[] {
  return teams.map(formatTeam)
}

export function buildTeamWhereInput(searchParams: URLSearchParams): Prisma.TeamWhereInput {
  const search = searchParams.get("search")
  const hasProject = searchParams.get("hasProject")
  
  const where: Prisma.TeamWhereInput = {}
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { position: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { bio: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
    ]
  }
  
  if (hasProject === "true") {
    where.projectTeams = { some: {} }
  } else if (hasProject === "false") {
    where.projectTeams = { none: {} }
  }
  
  return where
}

export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)))
  const skip = (page - 1) * limit
  
  return { page, limit, skip }
}

export function getSortParams(searchParams: URLSearchParams): Prisma.TeamOrderByWithRelationInput {
  const sortBy = searchParams.get("sortBy") || "displayOrder"
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc"
  
  const validSortFields = ["name", "position", "displayOrder", "createdAt", "updatedAt"]
  const field = validSortFields.includes(sortBy) ? sortBy : "displayOrder"
  
  return { [field]: sortOrder }
}

export function validateEmail(email: string | null | undefined): string | null {
  if (!email) return null
  const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format")
  }
  return email
}

export function validatePhone(phone: string | null | undefined): string | null {
  if (!phone) return null
  const phoneRegex = /^[0-9+\-\s()]+$/
  if (!phoneRegex.test(phone)) {
    throw new Error("Invalid phone number format")
  }
  return phone
}