import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-response"
import { tagSchema } from "@/backend-schemas/tag.schema"
import { z } from "zod"
import { 
  formatTags, 
  formatTag,
  buildTagWhereInput, 
  getPaginationParams,
  getSortParams
} from "@/helpers/tag-helpers"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const where = buildTagWhereInput(searchParams)
    const { page, limit, skip } = getPaginationParams(searchParams)
    const orderBy = getSortParams(searchParams)

    const [data, total] = await Promise.all([
      prisma.tag.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          blogPostTags: {
            select: { blogPostId: true }
          }
        }
      }),
      prisma.tag.count({ where }),
    ])
    
    const formattedData = formatTags(data)
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
    console.error("GET /api/tags error:", error)
    return errorResponse("Failed to fetch tags", 500)
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
    const validatedData = tagSchema.parse(body)
    
    const { name, slug } = validatedData

    // Check for existing slug
    const existing = await prisma.tag.findUnique({ 
      where: { slug } 
    })
    
    if (existing) {
      return errorResponse("Tag with this slug already exists", 409)
    }

    const tag = await prisma.tag.create({ 
      data: { 
        name, 
        slug 
      } 
    })
    
    return successResponse(tag, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    console.error("POST /api/tags error:", error)
    return errorResponse("Failed to create tag", 500)
  }
}