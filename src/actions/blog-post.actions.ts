"use server"

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
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

export async function deleteBlogPost(id: string) {
  await prisma.blogPost.delete({ where: { id } })
  redirect("/dashboard/blog-posts")
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } })
}