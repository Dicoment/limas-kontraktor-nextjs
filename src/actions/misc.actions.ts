"use server"

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { paginatedResponse } from "@/lib/api-response"

export async function getCategories(params: { page?: number; limit?: number; search?: string; type?: string } = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 50
  const skip = (page - 1) * limit
  const where: Record<string, unknown> = {}
  if (params.type) where.type = params.type
  if (params.search) where.name = { contains: params.search, mode: "insensitive" as const }

  const [data, total] = await Promise.all([
    prisma.category.findMany({ where, skip, take: limit, orderBy: { name: "asc" } }),
    prisma.category.count({ where }),
  ])
  return { data, total, page, totalPages: Math.ceil(total / limit) }
}

export async function createCategory(data: { name: string; slug: string; type: "blog" | "project"; description?: string | null }) {
  return prisma.category.create({ data })
}

export async function updateCategory(id: string, data: { name?: string; slug?: string; type?: string; description?: string | null }) {
  return prisma.category.update({ where: { id }, data })
}

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
    prisma.team.findMany({ where: where as any, skip, take: limit, orderBy: { displayOrder: "asc" as const } }),
    prisma.team.count({ where: where as any }),
  ])
  return { data, total, page, totalPages: Math.ceil(total / limit) }
}

// ── TAMBAHAN: Team CRUD (createTeam/updateTeam/deleteTeam belum ada sebelumnya) ──

export async function createTeam(data: { name: string; position?: string | null; bio?: string | null; avatar?: string | null; email?: string | null; phone?: string | null; displayOrder?: number }) {
  return prisma.team.create({ data })
}

export async function updateTeam(id: string, data: { name?: string; position?: string | null; bio?: string | null; avatar?: string | null; email?: string | null; phone?: string | null; displayOrder?: number }) {
  return prisma.team.update({ where: { id }, data })
}

export async function getTeamById(id: string) {
  return prisma.team.findUnique({ where: { id } })
}

export async function deleteTeam(id: string) {
  await prisma.team.delete({ where: { id } })
  return { success: true }
}

export async function deleteTeams(ids: string[]) {
  if (ids.length === 0) return { success: true, deletedCount: 0 }
  const result = await prisma.team.deleteMany({ where: { id: { in: ids } } })
  return { success: true, deletedCount: result.count }
}

export async function getTags(params: { page?: number; limit?: number; search?: string } = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 50
  const skip = (page - 1) * limit
  const where: Record<string, unknown> = {}
  if (params.search) where.name = { contains: params.search, mode: "insensitive" as const }

  const [data, total] = await Promise.all([
    prisma.tag.findMany({ where: where as any, skip, take: limit, orderBy: { name: "asc" as const } }),
    prisma.tag.count({ where: where as any }),
  ])
  return { data, total, page, totalPages: Math.ceil(total / limit) }
}

export async function createTag(data: { name: string; slug: string }) {
  return prisma.tag.create({ data: { name: data.name, slug: data.slug } })
}

export async function updateTag(id: string, data: { name?: string; slug?: string }) {
  return prisma.tag.update({ where: { id }, data })
}

export async function deleteTag(id: string) {
  return prisma.tag.delete({ where: { id } })
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      categoryProjects: { include: { catEntry: true } },
      projectTeams: { include: { teamEntry: true } },
    },
  })
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } })
  redirect("/dashboard/projects")
}

export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } })
}
export async function getAllTeams() {
  return prisma.team.findMany({ orderBy: { displayOrder: "asc" as const } })
}
export async function getAllTags() {
  return prisma.tag.findMany({ orderBy: { name: "asc" as const } })
}
export async function deleteLeadsLogs(ids: string[]) {
  if (ids.length === 0) return { success: true, deletedCount: 0 }
  const result = await prisma.leadsLog.deleteMany({ where: { id: { in: ids } } })
  return { success: true, deletedCount: result.count }
}

export async function getLeadsLogById(id: string) {
  const lead = await prisma.leadsLog.findUnique({ where: { id } })
  if (!lead) return null

  let project: { id: string; title: string } | null = null
  if (lead.projectId) {
    project = await prisma.project.findUnique({
      where: { id: lead.projectId },
      select: { id: true, title: true },
    })
  }

  return { ...lead, project }
}

export async function getSettings() {
  return prisma.setting.findMany({ orderBy: { key: "asc" } })
}

/** Versi key-value dari getSettings(), dipakai layout.tsx publik buat
 * baca google_analytics_id & google_search_console_code tanpa harus
 * looping array manual tiap kali butuh 1 value doang. */
export async function getSettingsMap() {
  const rows = await prisma.setting.findMany()
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>
}

export async function getAllProjects() {
  return prisma.project.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } })
}

export async function deleteSetting(id: string) {
  await prisma.setting.delete({ where: { id } })
}
export async function getTestimonials(params: { page?: number; limit?: number; published?: boolean; search?: string } = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 20
  const skip = (page - 1) * limit
  const where: Record<string, unknown> = {}
  if (params.published !== undefined) where.published = params.published
  if (params.search) {
    where.OR = [
      { clientName: { contains: params.search, mode: "insensitive" as const } },
      { content: { contains: params.search, mode: "insensitive" as const } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.testimonial.findMany({ where: where as any, include: { project: true }, skip, take: limit, orderBy: { createdAt: "desc" as const } }),
    prisma.testimonial.count({ where: where as any }),
  ])
  return { data, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getPages(params: { page?: number; limit?: number; published?: boolean } = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 20
  const skip = (page - 1) * limit
  const where = params.published !== undefined ? { published: params.published } : {}

  const [data, total] = await Promise.all([
    prisma.page.findMany({ where, skip, take: limit, orderBy: { title: "asc" } }),
    prisma.page.count({ where }),
  ])
  return { data, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getLeadsLogs(params: { page?: number; limit?: number; projectId?: string } = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 20
  const skip = (page - 1) * limit
  const where: Record<string, unknown> = {}
  if (params.projectId) where.projectId = params.projectId

  const [data, total] = await Promise.all([
    prisma.leadsLog.findMany({ where: where as any, skip, take: limit, orderBy: { createdAt: "desc" as const } }),
    prisma.leadsLog.count({ where: where as any }),
  ])
  return { data, total, page, totalPages: Math.ceil(total / limit) }
}

export async function deleteLeadsLog(id: string) {
  await prisma.leadsLog.delete({ where: { id } })
  return { success: true }
}

export async function deletePage(id: string) {
  await prisma.page.delete({ where: { id } })
}

// ── TAMBAHAN: Testimonial CRUD (createTestimonial/updateTestimonial/deleteTestimonial belum ada) ──

export async function getTestimonialById(id: string) {
  return prisma.testimonial.findUnique({ where: { id }, include: { project: true } })
}

export async function createTestimonial(data: {
  clientName: string
  content: string
  rating: number
  platform?: "MANUAL" | "SOCIAL_MEDIA"
  sourceUrl?: string | null
  avatar?: string | null
  projectId?: string | null
  published?: boolean
}) {
  return prisma.testimonial.create({
    data: {
      clientName: data.clientName,
      content: data.content,
      rating: data.rating,
      platform: data.platform ?? "MANUAL",
      sourceUrl: data.sourceUrl || null,
      avatar: data.avatar || null,
      projectId: data.projectId || null,
      published: data.published ?? false,
    },
  })
}

export async function updateTestimonial(id: string, data: {
  clientName?: string
  content?: string
  rating?: number
  platform?: "MANUAL" | "SOCIAL_MEDIA"
  sourceUrl?: string | null
  avatar?: string | null
  projectId?: string | null
  published?: boolean
}) {
  return prisma.testimonial.update({
    where: { id },
    data: {
      ...data,
      sourceUrl: data.sourceUrl === undefined ? undefined : data.sourceUrl || null,
      avatar: data.avatar === undefined ? undefined : data.avatar || null,
      projectId: data.projectId === undefined ? undefined : data.projectId || null,
    },
  })
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({ where: { id } })
  return { success: true }
}

export async function deleteTestimonials(ids: string[]) {
  if (ids.length === 0) return { success: true, deletedCount: 0 }
  const result = await prisma.testimonial.deleteMany({ where: { id: { in: ids } } })
  return { success: true, deletedCount: result.count }
}