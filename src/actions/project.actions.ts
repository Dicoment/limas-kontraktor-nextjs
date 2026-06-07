"use server"

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { formatProject, formatProjects } from "@/helpers/project-helpers"

export async function getProjects(params: { page?: number; limit?: number; search?: string; status?: string } = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 10
  const skip = (page - 1) * limit
  const where: Record<string, unknown> = {}

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" as const } },
      { location: { contains: params.search, mode: "insensitive" as const } },
    ]
  }
  if (params.status) where.status = params.status

  const [rawProjects, total] = await Promise.all([
    prisma.project.findMany({
      where: where as any,
      include: {
        categoryProjects: { include: { catEntry: true } },
        projectTeams: { include: { teamEntry: true } },
      },
      skip, take: limit, orderBy: { createdAt: "desc" },
    }),
    prisma.project.count({ where: where as any }),
  ])
  const formattedProjects = formatProjects(rawProjects)
  return { projects: formattedProjects, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getProjectById(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      categoryProjects: { include: { catEntry: true } },
      projectTeams: { include: { teamEntry: true } },
    },
  })
  return project ? formatProject(project) : null
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } })
  redirect("/dashboard/projects")
}

export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } })
}
export async function getAllTeams() {
  return prisma.team.findMany({ orderBy: { displayOrder: "asc" } })
}
export async function getAllTags() {
  return prisma.tag.findMany({ orderBy: { name: "asc" } })
}
export async function deleteLeadLog(id: string) {
  await prisma.leadsLog.delete({ where: { id } })
}
export async function getSettings() {
  return prisma.setting.findMany({ orderBy: { key: "asc" } })
}
export async function getPages(params: { published?: boolean; page?: number; limit?: number } = {}) {
  const skip = ((params.page ?? 1) - 1) * (params.limit ?? 20)
  const where = params.published !== undefined ? { published: params.published } : {}
  const [data, total] = await Promise.all([
    prisma.page.findMany({ where, skip, take: params.limit ?? 20, orderBy: { title: "asc" } }),
    prisma.page.count({ where }),
  ])
  return { data, total, page: params.page ?? 1, totalPages: Math.ceil(total / (params.limit ?? 20)) }
}