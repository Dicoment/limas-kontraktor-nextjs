import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-response"
import { blogPostSchema } from "@/backend-schemas/blog-post.schema"
import { z } from "zod"
import { 
  formatBlogPosts, 
  formatBlogPost, 
  validateAndParseDate, 
  buildBlogPostWhereInput, 
  getPaginationParams 
} from "@/lib/blog-post-helpers"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const where = buildBlogPostWhereInput(searchParams)
    const { page, limit, skip } = getPaginationParams(searchParams)

    const [data, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          blogPostCategories: { include: { catEntry: true } },
          blogPostTags: { include: { tagEntry: true } },
        },
        skip,
        take: limit,
        orderBy: { publishedAt: "desc" },
      }),
      prisma.blogPost.count({ where }),
    ])
    
    const formattedData = formatBlogPosts(data)
    const totalPages = Math.ceil(total / limit)
    
    // Consistent response format: { success, data, pagination }
    return successResponse({
      items: formattedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    })
  } catch (error) {
    console.error("GET /api/blog-posts error:", error)
    return errorResponse("Failed to fetch blog posts", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (error) {
      return errorResponse("Invalid JSON body", 400)
    }
    
    // Validate with zod schema
    const validatedData = blogPostSchema.parse(body)
    
    const { title, slug, published, publishedAt, categoryIds, tagIds, content, excerpt, coverImage, seoTitle, seoDescription } = validatedData

    // Check for existing slug
    const existing = await prisma.blogPost.findUnique({ 
      where: { slug } 
    })
    
    if (existing) {
      return errorResponse("Blog post with this slug already exists", 409)
    }

    // Validate and parse publishedAt
    let finalPublishedAt = null
    if (publishedAt) {
      try {
        finalPublishedAt = validateAndParseDate(publishedAt)
      } catch (error) {
        return errorResponse("Invalid publishedAt date format", 400)
      }
    }
    
    // Auto-set publishedAt if published is true
    if (published && !finalPublishedAt) {
      finalPublishedAt = new Date()
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content: content || "",
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        published: published ?? false,
        publishedAt: finalPublishedAt,
        blogPostCategories: categoryIds?.length
          ? { create: categoryIds.map((id: string) => ({ catEntry: { connect: { id } } })) }
          : undefined,

        blogPostTags: tagIds?.length
          ? { create: tagIds.map((id: string) => ({ tagEntry: { connect: { id } } })) }
          : undefined,
      },
      include: { 
        blogPostCategories: { include: { catEntry: true } }, 
        blogPostTags: { include: { tagEntry: true } } 
      },
    })
    
    const formattedPost = formatBlogPost(post)
    
    // Consistent response format
    return successResponse(formattedPost, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    console.error("POST /api/blog-posts error:", error)
    return errorResponse("Failed to create blog post", 500)
  }
}