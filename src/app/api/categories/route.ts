import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-response"
import { categorySchema } from "@/backend-schemas/category.schema"
import { z } from "zod"
import { 
  formatCategories, 
  formatCategory, 
  buildCategoryWhereInput, 
  getPaginationParams 
} from "@/helpers/category-helpers"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const where = buildCategoryWhereInput(searchParams)
    const { page, limit, skip } = getPaginationParams(searchParams)

    const [data, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          blogPostCategories: {
            select: { blogPostId: true }
          },
          categoryProjects: {
            select: { projectId: true }
          }
        }
      }),
      prisma.category.count({ where }),
    ])
    
    const formattedData = formatCategories(data)
    const totalPages = Math.ceil(total / limit)
    
    // Consistent response format
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
    console.error("GET /api/categories error:", error)
    return errorResponse("Failed to fetch categories", 500)
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
    const validatedData = categorySchema.parse(body)
    
    const { name, slug, type, description } = validatedData

    // Check for existing slug
    const existing = await prisma.category.findUnique({ 
      where: { slug } 
    })
    
    if (existing) {
      return errorResponse("Category with this slug already exists", 409)
    }

    const category = await prisma.category.create({
      data: { 
        name, 
        slug, 
        type, 
        description: description || null 
      },
    })
    
    return successResponse(category, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    console.error("POST /api/categories error:", error)
    return errorResponse("Failed to create category", 500)
  }
}