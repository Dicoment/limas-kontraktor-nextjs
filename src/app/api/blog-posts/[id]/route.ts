import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"
import { blogPostUpdateSchema } from "@/backend-schemas/blog-post.schema"
import { z } from "zod"
import { formatBlogPost, validateAndParseDate } from "@/lib/blog-post-helpers"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { 
        blogPostCategories: { include: { catEntry: true } }, 
        blogPostTags: { include: { tagEntry: true } } 
      },
    })
    
    if (!post) return notFoundResponse("BlogPost")
    
    const formattedPost = formatBlogPost(post)
    return successResponse(formattedPost)
  } catch (error) {
    console.error("GET /api/blog-posts/[id] error:", error)
    return errorResponse("Failed to fetch blog post", 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    let body
    try {
      body = await request.json()
    } catch (error) {
      return errorResponse("Invalid JSON body", 400)
    }
    
    // Validate with update schema
    const validatedData = blogPostUpdateSchema.parse(body)
    
    // Check if blog post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    })
    
    if (!existingPost) return notFoundResponse("BlogPost")
    
    // If slug is being changed, check for uniqueness
    if (validatedData.slug && validatedData.slug !== existingPost.slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug: validatedData.slug }
      })
      
      if (slugExists) {
        return errorResponse("Slug already exists", 409)
      }
    }
    
    const { categoryIds, tagIds, published, publishedAt, ...data } = validatedData
    
    // Handle publishedAt logic with validation
    let finalPublishedAt = existingPost.publishedAt
    if (publishedAt !== undefined) {
      try {
        finalPublishedAt = validateAndParseDate(publishedAt)
      } catch (error) {
        return errorResponse("Invalid publishedAt date format", 400)
      }
    }
    
    if (published === true && !existingPost.published && !finalPublishedAt) {
      finalPublishedAt = new Date()
    } else if (published === false) {
      finalPublishedAt = null
    }
    
    // Update with transaction
    const updated = await prisma.$transaction(async (tx: any) => {
      // Update relations if provided
      if (categoryIds !== undefined) {
        await tx.blogPostCategory.deleteMany({ where: { blogPostId: id } })
        if (categoryIds.length > 0) {
          await tx.blogPostCategory.createMany({
            data: categoryIds.map((cid: string) => ({ 
              blogPostId: id, 
              categoryId: cid 
            }))
          })
        }
      }
      
      if (tagIds !== undefined) {
        await tx.blogPostTag.deleteMany({ where: { blogPostId: id } })
        if (tagIds.length > 0) {
          await tx.blogPostTag.createMany({
            data: tagIds.map((tid: string) => ({ 
              blogPostId: id, 
              tagId: tid 
            }))
          })
        }
      }
      
      // Update main post
      return await tx.blogPost.update({
        where: { id },
        data: {
          ...data,
          published: published ?? existingPost.published,
          publishedAt: finalPublishedAt,
        },
        include: { 
          blogPostCategories: { include: { catEntry: true } }, 
          blogPostTags: { include: { tagEntry: true } } 
        },
      })
    })
    
    const formattedPost = formatBlogPost(updated)
    return successResponse(formattedPost)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    console.error("PUT /api/blog-posts/[id] error:", error)
    return errorResponse("Failed to update blog post", 500)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    let body
    try {
      body = await request.json()
    } catch (error) {
      return errorResponse("Invalid JSON body", 400)
    }
    
    // Validate partial update
    const validatedData = blogPostUpdateSchema.parse(body)
    
    // Check if blog post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    })
    
    if (!existingPost) return notFoundResponse("BlogPost")
    
    // If slug is being changed, check for uniqueness
    if (validatedData.slug && validatedData.slug !== existingPost.slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug: validatedData.slug }
      })
      
      if (slugExists) {
        return errorResponse("Slug already exists", 409)
      }
    }
    
    const { categoryIds, tagIds, published, publishedAt, ...data } = validatedData
    
    // Handle publishedAt logic with validation
    let finalPublishedAt = existingPost.publishedAt
    if (publishedAt !== undefined) {
      try {
        finalPublishedAt = validateAndParseDate(publishedAt)
      } catch (error) {
        return errorResponse("Invalid publishedAt date format", 400)
      }
    }
    
    if (published === true && !existingPost.published && !finalPublishedAt) {
      finalPublishedAt = new Date()
    } else if (published === false) {
      finalPublishedAt = null
    }
    
    // Update with transaction
    const updated = await prisma.$transaction(async (tx: any) => {
      // Update relations if provided
      if (categoryIds !== undefined) {
        await tx.blogPostCategory.deleteMany({ where: { blogPostId: id } })
        if (categoryIds.length > 0) {
          await tx.blogPostCategory.createMany({
            data: categoryIds.map((cid: string) => ({ 
              blogPostId: id, 
              categoryId: cid 
            }))
          })
        }
      }
      
      if (tagIds !== undefined) {
        await tx.blogPostTag.deleteMany({ where: { blogPostId: id } })
        if (tagIds.length > 0) {
          await tx.blogPostTag.createMany({
            data: tagIds.map((tid: string) => ({ 
              blogPostId: id, 
              tagId: tid 
            }))
          })
        }
      }
      
      // Build update data (only include fields that are provided)
      const updateData: any = { ...data }
      if (published !== undefined) updateData.published = published
      if (finalPublishedAt !== existingPost.publishedAt) updateData.publishedAt = finalPublishedAt
      
      // Update main post
      return await tx.blogPost.update({
        where: { id },
        data: updateData,
        include: { 
          blogPostCategories: { include: { catEntry: true } }, 
          blogPostTags: { include: { tagEntry: true } } 
        },
      })
    })
    
    const formattedPost = formatBlogPost(updated)
    return successResponse(formattedPost)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    console.error("PATCH /api/blog-posts/[id] error:", error)
    return errorResponse("Failed to update blog post", 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if blog post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    })
    
    if (!existingPost) return notFoundResponse("BlogPost")
    
    // Delete blog post (relations will be deleted via CASCADE)
    await prisma.blogPost.delete({ 
      where: { id } 
    })
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("DELETE /api/blog-posts/[id] error:", error)
    return errorResponse("Failed to delete blog post", 500)
  }
}