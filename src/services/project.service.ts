import { prisma } from "@/lib/prisma"
import { ProjectInput, ProjectUpdateInput } from "@/backend-schemas/project.schema"
import { formatProject, formatProjects, validateGallery } from "@/helpers/project-helpers"

export async function getProjects(params: {
  page: number
  limit: number
  search?: string
  status?: string
  categoryId?: string
  teamId?: string
}) {
  const { page, limit, search, status, categoryId, teamId } = params
  const skip = (page - 1) * limit
  
  const where: any = {}
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
    ]
  }
  
  if (status) where.status = status
  if (categoryId) {
    where.categoryProjects = { some: { categoryId } }
  }
  if (teamId) {
    where.projectTeams = { some: { teamId } }
  }
  
  const [data, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        categoryProjects: { include: { catEntry: true } },
        projectTeams: { include: { teamEntry: true } },
      },
    }),
    prisma.project.count({ where })
  ])
  
  return {
    items: formatProjects(data),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export async function getProjectBySlug(slug: string) {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      categoryProjects: { include: { catEntry: true } },
      projectTeams: { include: { teamEntry: true } },
      testimonials: {
        where: { published: true },
        orderBy: { createdAt: "desc" }
      },
    },
  })
  
  return project ? formatProject(project) : null
}

export async function createProject(data: ProjectInput) {
  const existing = await prisma.project.findUnique({
    where: { slug: data.slug }
  })
  
  if (existing) {
    throw new Error("Project with this slug already exists")
  }
  
  const validatedGallery = validateGallery(data.gallery)
  
const project = await prisma.project.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      location: data.location || null,
      client: data.client || null,
      limasRole: data.limasRole || null,
      coverImage: data.coverImage || null,
      gallery: validatedGallery,
      status: data.status || "DRAFT",
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      categoryProjects: data.categoryIds?.length
        ? { create: data.categoryIds.map(cid => ({ catEntry: { connect: { id: cid } } })) }
        : undefined,
      projectTeams: data.teamIds?.length
        ? { create: data.teamIds.map(({ teamId, role }) => ({ 
              teamEntry: { connect: { id: teamId } }, 
              role: role || null 
            })) }
        : undefined,
    },
    include: {
      categoryProjects: { include: { catEntry: true } },
      projectTeams: { include: { teamEntry: true } },
    },
  })
  
  return formatProject(project)
}

export async function updateProject(id: string, data: ProjectUpdateInput) {
  const existing = await prisma.project.findUnique({ where: { id } })
  if (!existing) throw new Error("Project not found")
  
  if (data.slug && data.slug !== existing.slug) {
    const slugExists = await prisma.project.findUnique({
      where: { slug: data.slug }
    })
    if (slugExists) throw new Error("Slug already exists")
  }
  
  const { categoryIds, teamIds, gallery, ...updateData } = data
  const validatedGallery = gallery !== undefined ? validateGallery(gallery) : undefined
  
  await prisma.$transaction(async (tx) => {
    if (categoryIds !== undefined) {
      await tx.categoryProject.deleteMany({ where: { projectId: id } })
      if (categoryIds.length > 0) {
        await tx.categoryProject.createMany({
          data: categoryIds.map(cid => ({ projectId: id, categoryId: cid }))
        })
      }
    }
    
    if (teamIds !== undefined) {
      await tx.projectTeam.deleteMany({ where: { projectId: id } })
      if (teamIds.length > 0) {
        await tx.projectTeam.createMany({
          data: teamIds.map(({ teamId, role }) => ({ 
            projectId: id, 
            teamId,
            role: role || null
          }))
        })
      }
    }
    
    await tx.project.update({
      where: { id },
      data: {
        ...updateData,
        ...(validatedGallery !== undefined && { gallery: validatedGallery }),
      },
    })
  })
  
  return await getProjectById(id)
}

export async function getProjectById(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      categoryProjects: { include: { catEntry: true } },
      projectTeams: { include: { teamEntry: true } },
      testimonials: true,
    },
  })
  
  return project ? formatProject(project) : null
}

export async function deleteProject(id: string) {
  const existing = await prisma.project.findUnique({ 
    where: { id },
    include: { testimonials: { select: { id: true } } }
  })
  
  if (!existing) throw new Error("Project not found")
  
  if (existing.testimonials.length > 0) {
    throw new Error("Cannot delete project with testimonials")
  }
  
  return await prisma.project.delete({ where: { id } })
}