import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-response"
import { testimonialSchema } from "@/backend-schemas/testimonial.schema"
import { z } from "zod"
import { 
  formatTestimonials, 
  formatTestimonial,
  buildTestimonialWhereInput, 
  getPaginationParams,
  getSortParams,
  validateRating
} from "@/helpers/testimonial-helpers"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const where = buildTestimonialWhereInput(searchParams)
    const { page, limit, skip } = getPaginationParams(searchParams)
    const orderBy = getSortParams(searchParams)

    const [data, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              title: true,
              slug: true,
              coverImage: true
            }
          }
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.testimonial.count({ where }),
    ])
    
    const formattedData = formatTestimonials(data)
    const totalPages = Math.ceil(total / limit)
    
    // Calculate summary statistics
    const ratings = data.filter(t => t.rating !== null).map(t => t.rating as number)
    const averageRating = ratings.length > 0 
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
      : null
    
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
      },
      summary: {
        averageRating: averageRating ? Number(averageRating.toFixed(1)) : null,
        totalWithRating: ratings.length,
        totalPublished: data.filter(t => t.published).length,
      }
    })
  } catch (error) {
    console.error("GET /api/testimonials error:", error)
    return errorResponse("Failed to fetch testimonials", 500)
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
    const validatedData = testimonialSchema.parse(body)
    
    const { 
      clientName, content, rating, platform, 
      sourceUrl, avatar, published, projectId 
    } = validatedData

    // Validate rating
    let validatedRating = null
    if (rating !== null && rating !== undefined) {
      try {
        validatedRating = validateRating(rating)
      } catch (error) {
        return errorResponse("Rating must be between 1 and 5", 400)
      }
    }

    // Check if project exists if projectId is provided
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true, title: true }
      })
      
      if (!project) {
        return errorResponse("Project not found", 404)
      }
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        clientName,
        content,
        rating: validatedRating,
        platform: platform || "MANUAL",
        sourceUrl: sourceUrl || null,
        avatar: avatar || null,
        published: published ?? false,
        projectId: projectId || null,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true
          }
        }
      }
    })
    
    const formattedTestimonial = formatTestimonial(testimonial)
    return successResponse(formattedTestimonial, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    console.error("POST /api/testimonials error:", error)
    return errorResponse("Failed to create testimonial", 500)
  }
}