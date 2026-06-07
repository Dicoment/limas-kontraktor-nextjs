import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"
import { categoryUpdateSchema } from "@/backend-schemas/category.schema"
import { z } from "zod"
import { formatCategory } from "@/helpers/category-helpers"

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const category = await prisma.category.findUnique({
      where: { id },
      include: { 
        blogPostCategories: { 
          include: { postEntry: { select: { id: true, title: true, slug: true } } }
        }, 
        categoryProjects: { 
          include: { projEntry: { select: { id: true, title: true, slug: true } } }
        } 
      },
    })
    
    if (!category) return notFoundResponse("Category")
    
    const formattedCategory = formatCategory(category)
    return successResponse(formattedCategory)
  } catch (error) {
    console.error("GET /api/categories/[id] error:", error)
    return errorResponse("Failed to fetch category", 500)
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
    const validatedData = categoryUpdateSchema.parse(body)
    
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })
    
    if (!existingCategory) return notFoundResponse("Category")
    
    // If slug is being changed, check for uniqueness
    if (validatedData.slug && validatedData.slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: validatedData.slug }
      })
      
      if (slugExists) {
        return errorResponse("Slug already exists", 409)
      }
    }
    
    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: validatedData,
      include: { 
        blogPostCategories: { 
          include: { postEntry: { select: { id: true, title: true, slug: true } } }
        }, 
        categoryProjects: { 
          include: { projEntry: { select: { id: true, title: true, slug: true } } }
        } 
      },
    })
    
    const formattedCategory = formatCategory(category)
    return successResponse(formattedCategory)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return notFoundResponse("Category")
    }
    console.error("PUT /api/categories/[id] error:", error)
    return errorResponse("Failed to update category", 500)
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
    const validatedData = categoryUpdateSchema.parse(body)
    
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })
    
    if (!existingCategory) return notFoundResponse("Category")
    
    // If slug is being changed, check for uniqueness
    if (validatedData.slug && validatedData.slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: validatedData.slug }
      })
      
      if (slugExists) {
        return errorResponse("Slug already exists", 409)
      }
    }
    
    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: validatedData,
      include: { 
        blogPostCategories: { 
          include: { postEntry: { select: { id: true, title: true, slug: true } } }
        }, 
        categoryProjects: { 
          include: { projEntry: { select: { id: true, title: true, slug: true } } }
        } 
      },
    })
    
    const formattedCategory = formatCategory(category)
    return successResponse(formattedCategory)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return notFoundResponse("Category")
    }
    console.error("PATCH /api/categories/[id] error:", error)
    return errorResponse("Failed to update category", 500)
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        blogPostCategories: { select: { blogPostId: true } },
        categoryProjects: { select: { projectId: true } }
      }
    })
    
    if (!existingCategory) return notFoundResponse("Category")
    
    // Optional: Check if category is being used
    const isUsed = (existingCategory.blogPostCategories?.length || 0) > 0 || 
                   (existingCategory.categoryProjects?.length || 0) > 0
    
    if (isUsed) {
      return errorResponse(
        "Cannot delete category because it is being used by blog posts or projects", 
        409
      )
    }
    
    // Delete category (relations will be deleted via CASCADE)
    await prisma.category.delete({ 
      where: { id } 
    })
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("DELETE /api/categories/[id] error:", error)
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return notFoundResponse("Category")
    }
    return errorResponse("Failed to delete category", 500)
  }
}