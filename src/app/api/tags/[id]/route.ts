import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"
import { tagUpdateSchema } from "@/backend-schemas/tag.schema"
import { z } from "zod"
import { formatTag } from "@/helpers/tag-helpers"

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const tag = await prisma.tag.findUnique({ 
      where: { id },
      include: {
        blogPostTags: {
          select: { blogPostId: true }
        }
      }
    })
    
    if (!tag) return notFoundResponse("Tag")
    
    const formattedTag = formatTag(tag)
    return successResponse(formattedTag)
  } catch (error) {
    console.error("GET /api/tags/[id] error:", error)
    return errorResponse("Failed to fetch tag", 500)
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
    const validatedData = tagUpdateSchema.parse(body)
    
    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id }
    })
    
    if (!existingTag) return notFoundResponse("Tag")
    
    // If slug is being changed, check for uniqueness
    if (validatedData.slug && validatedData.slug !== existingTag.slug) {
      const slugExists = await prisma.tag.findUnique({
        where: { slug: validatedData.slug }
      })
      
      if (slugExists) {
        return errorResponse("Slug already exists", 409)
      }
    }
    
    // Update tag
    const tag = await prisma.tag.update({ 
      where: { id }, 
      data: validatedData,
      include: {
        blogPostTags: {
          select: { blogPostId: true }
        }
      }
    })
    
    const formattedTag = formatTag(tag)
    return successResponse(formattedTag)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return notFoundResponse("Tag")
    }
    console.error("PUT /api/tags/[id] error:", error)
    return errorResponse("Failed to update tag", 500)
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
    const validatedData = tagUpdateSchema.parse(body)
    
    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id }
    })
    
    if (!existingTag) return notFoundResponse("Tag")
    
    // If slug is being changed, check for uniqueness
    if (validatedData.slug && validatedData.slug !== existingTag.slug) {
      const slugExists = await prisma.tag.findUnique({
        where: { slug: validatedData.slug }
      })
      
      if (slugExists) {
        return errorResponse("Slug already exists", 409)
      }
    }
    
    // Update tag
    const tag = await prisma.tag.update({ 
      where: { id }, 
      data: validatedData,
      include: {
        blogPostTags: {
          select: { blogPostId: true }
        }
      }
    })
    
    const formattedTag = formatTag(tag)
    return successResponse(formattedTag)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return notFoundResponse("Tag")
    }
    console.error("PATCH /api/tags/[id] error:", error)
    return errorResponse("Failed to update tag", 500)
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if tag exists with usage count
    const existingTag = await prisma.tag.findUnique({
      where: { id },
      include: {
        blogPostTags: {
          select: { blogPostId: true }
        }
      }
    })
    
    if (!existingTag) return notFoundResponse("Tag")
    
    // Check if tag is being used
    const isUsed = (existingTag.blogPostTags?.length || 0) > 0
    
    if (isUsed) {
      return errorResponse(
        "Cannot delete tag because it is being used by blog posts", 
        409
      )
    }
    
    await prisma.tag.delete({ 
      where: { id } 
    })
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("DELETE /api/tags/[id] error:", error)
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return notFoundResponse("Tag")
    }
    return errorResponse("Failed to delete tag", 500)
  }
}