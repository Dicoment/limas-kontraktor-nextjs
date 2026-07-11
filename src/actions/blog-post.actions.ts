"use server"

import { prisma } from "@/lib/prisma"
import { formatBlogPost, formatBlogPosts } from "@/lib/blog-post-helpers"

export async function getBlogPosts(params: { page?: number; limit?: number; search?: string; published?: boolean } = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 10
  const skip = (page - 1) * limit
  const where: Record<string, unknown> = {}
  if (params.published !== undefined) where.published = params.published
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" as const } },
      { excerpt: { contains: params.search, mode: "insensitive" as const } },
    ]
  }

  const [rawPosts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: where as any,
      include: { blogPostCategories: { include: { catEntry: true } }, blogPostTags: { include: { tagEntry: true } } },
      skip, take: limit, orderBy: { publishedAt: "desc" },
    }),
    prisma.blogPost.count({ where: where as any }),
  ])
  return { posts: formatBlogPosts(rawPosts), total, page, totalPages: Math.ceil(total / limit) }
}

export async function getBlogPostById(id: string) {
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: { blogPostCategories: { include: { catEntry: true } }, blogPostTags: { include: { tagEntry: true } } },
  })
  return post ? formatBlogPost(post) : null
}

// FIX: versi asli manggil redirect() langsung di dalam action ini, yang cuma
// tepat kalau dipanggil dari <form action={deleteBlogPost}> server-side.
// Dipakai buat bulk-delete dari client component (BlogPostTable, sama pola
// kayak ProjectTable), redirect() di sini bakal salah perilaku / error.
// Sekarang cuma delete & return, navigasi/refresh jadi tanggung jawab caller.
export async function deleteBlogPost(id: string) {
  await prisma.blogPost.delete({ where: { id } })
  return { success: true, message: "Blog post deleted successfully" }
}

// Batch delete — 1 query lewat deleteMany, sama pola & trade-off kayak
// deleteProjects() di project.actions.ts (kalau salah satu ID kena FK
// constraint, SELURUH batch gagal, bukan partial-success).
export async function deleteBlogPosts(ids: string[]) {
  if (ids.length === 0) return { success: true, deletedCount: 0 }
  const result = await prisma.blogPost.deleteMany({ where: { id: { in: ids } } })
  return { success: true, deletedCount: result.count }
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } })
}

export async function getAllTags() {
  return prisma.tag.findMany({ orderBy: { name: "asc" } })
}