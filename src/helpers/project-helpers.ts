import { Prisma, Project, Category, Team } from "@/generated/client"

export type ProjectWithRelations = Project & {
  categoryProjects?: Array<{ catEntry: Category }>
  projectTeams?: Array<{ teamEntry: Team; role: string | null }>
  testimonials?: Array<any>
}

export type FormattedProject = Omit<ProjectWithRelations, 'categoryProjects' | 'projectTeams'> & {
  categories: Category[]
  teams: Array<{ id: string; name: string; role: string | null }>
  gallery: string[]
}

export function formatProject(project: ProjectWithRelations): FormattedProject {
  return {
    ...project,
    gallery: project.gallery as string[] || [],
    categories: project.categoryProjects?.map(cp => cp.catEntry) || [],
    teams: project.projectTeams?.map(pt => ({
      id: pt.teamEntry.id,
      name: pt.teamEntry.name,
      role: pt.role
    })) || [],
  }
}

export function formatProjects(projects: ProjectWithRelations[]): FormattedProject[] {
  return projects.map(formatProject)
}

export function buildProjectWhereInput(searchParams: URLSearchParams): Prisma.ProjectWhereInput {
  const search = searchParams.get("search")
  const status = searchParams.get("status")
  const categoryId = searchParams.get("categoryId")
  const teamId = searchParams.get("teamId")
  
  const where: Prisma.ProjectWhereInput = {}
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { location: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { client: { contains: search, mode: Prisma.QueryMode.insensitive } },
    ]
  }
  
  if (status && ["DRAFT", "ONGOING", "COMPLETED"].includes(status)) {
    where.status = status as any
  }
  
  if (categoryId) {
    where.categoryProjects = {
      some: { categoryId: categoryId }
    }
  }
  
  if (teamId) {
    where.projectTeams = {
      some: { teamId: teamId }
    }
  }
  
  return where
}

export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)))
  const skip = (page - 1) * limit
  
  return { page, limit, skip }
}

export function getSortParams(searchParams: URLSearchParams): Prisma.ProjectOrderByWithRelationInput {
  const sortBy = searchParams.get("sortBy") || "createdAt"
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc"
  
  const validSortFields = ["title", "status", "createdAt", "updatedAt"]
  const field = validSortFields.includes(sortBy) ? sortBy : "createdAt"
  
  return { [field]: sortOrder }
}

export function validateGallery(gallery: any): string[] {
  if (!gallery) return []
  if (Array.isArray(gallery)) {
    return gallery.filter(url => typeof url === "string" && url.startsWith("http"))
  }
  return []
}