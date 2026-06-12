import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-response"
import { pageSchema } from "@/backend-schemas/page.schema"
import { z } from "zod"
import { 
  formatPages, 
  formatPage,
  buildPageWhereInput, 
  getPaginationParams,
  getSortParams
} from "@/helpers/page-helpers"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const where = buildPageWhereInput(searchParams)
    const { page, limit, skip } = getPaginationParams(searchParams)
    const orderBy = getSortParams(searchParams)

    const [data, total] = await Promise.all([
      prisma.page.findMany({ 
        where, 
        skip, 
        take: limit, 
        orderBy 
      }),
      prisma.page.count({ where }),
    ])
    
    const formattedData = formatPages(data)
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
    console.error("GET /api/pages error:", error)
    return errorResponse("Failed to fetch pages", 500)
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
    const validatedData = pageSchema.parse(body)
    
    const { title, slug, content, seoTitle, seoDescription, published } = validatedData

    // Check for existing slug
    const existing = await prisma.page.findUnique({ 
      where: { slug } 
    })
    
    if (existing) {
      return errorResponse("Page with this slug already exists", 409)
    }

    const page = await prisma.page.create({
      data: { 
        title, 
        slug, 
        content: content || "", 
        seoTitle: seoTitle || null, 
        seoDescription: seoDescription || null, 
        published: published ?? false 
      },
    })
    
    return successResponse(page, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    console.error("POST /api/pages error:", error)
    return errorResponse("Failed to create page", 500)
  }
}
