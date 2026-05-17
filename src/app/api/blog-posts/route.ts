import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse, paginatedResponse } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const { page, limit, skip, where } = buildQueryParams(request)

    const [data, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: where as any,
        include: {
          blogPostCategories: { include: { catEntry: true } },
          blogPostTags: { include: { tagEntry: true } },
        },
        skip, take: limit, orderBy: { publishedAt: "desc" },
      }),
      prisma.blogPost.count({ where: where as any }),
    ])
    return successResponse(paginatedResponse(data, total, page, limit))
  } catch (error) {
    console.error("GET /api/blog-posts error:", error)
    return errorResponse("Failed to fetch blog posts", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, published, publishedAt, categoryIds, tagIds, ...data } = body

    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (existing) return errorResponse("Blog post with this slug already exists", 409)

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content: data.content || "",
        excerpt: data.excerpt || null,
        coverImage: data.coverImage || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        published: published ?? false,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        blogPostCategories: categoryIds?.length
          ? { create: categoryIds.map((id: string) => ({ category: { connect: { id } } })) }
          : undefined,
        blogPostTags: tagIds?.length
          ? { create: tagIds.map((id: string) => ({ tag: { connect: { id } } })) }
          : undefined,
      },
      include: { blogPostCategories: { include: { catEntry: true } }, blogPostTags: { include: { tagEntry: true } } },
    })
    return successResponse(post, 201)
  } catch (error) {
    console.error("POST /api/blog-posts error:", error)
    return errorResponse("Failed to create blog post", 500)
  }
}

function buildQueryParams(request: NextRequest) {
  const sp = request.nextUrl.searchParams
  const search = sp.get("search") || undefined
  const published = sp.get("published")
  const page = Math.max(1, parseInt(sp.get("page") || "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") || "10", 10)))
  const skip = (page - 1) * limit
  const where: Record<string, unknown> = {}
  if (published !== null) where.published = published === "true"
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { content: { contains: search } },
      { excerpt: { contains: search } },
    ] as any
  }
  return { page, limit, skip, where }
}