import { prisma } from '@/lib/prisma'

/**
 * Get project by ID with related data
 */
export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      categoryProjects: { include: { catEntry: true } },
      projectTeams: { include: { teamEntry: true } },
    },
  })
}

/**
 * Delete project by ID
 */
export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } })
}

/**
 * Get all projects (simplified version - can be enhanced with pagination/filtering)
 */
export async function getAllProjects() {
  return prisma.project.findMany({
    include: {
      categoryProjects: { include: { catEntry: true } },
      projectTeams: { include: { teamEntry: true } },
    },
    orderBy: { createdAt: 'desc' }
  })
}