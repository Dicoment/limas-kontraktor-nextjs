import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"
import { testimonialUpdateSchema } from "@/backend-schemas/testimonial.schema"
import { z } from "zod"
import { formatTestimonial, validateRating } from "@/helpers/testimonial-helpers"

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
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
    
    if (!testimonial) return notFoundResponse("Testimonial")
    
    const formattedTestimonial = formatTestimonial(testimonial)
    return successResponse(formattedTestimonial)
    return successResponse(formattedTestimonial)
  } catch (error) {
    console.error("GET /api/testimonials/[id] error:", error)
    return errorResponse("Failed to fetch testimonial", 500)
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
    const validatedData = testimonialUpdateSchema.parse(body)
    
    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    })
    
    if (!existingTestimonial) return notFoundResponse("Testimonial")
    
    // Validate rating if provided
    let validatedRating: number | null = existingTestimonial.rating
    if (validatedData.rating !== undefined) {
      try {
        validatedRating = validateRating(validatedData.rating)
      } catch (error) {
        return errorResponse("Rating must be between 1 and 5", 400)
      }
    }
    
    // Check if project exists if projectId is provided
    if (validatedData.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: validatedData.projectId },
        select: { id: true, title: true }
      })
      
      if (!project) {
        return errorResponse("Project not found", 404)
      }
    }
    
    const { rating, ...restData } = validatedData
    
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...restData,
        rating: validatedRating ?? undefined,
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
    return successResponse(formattedTestimonial)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return notFoundResponse("Testimonial")
    }
    console.error("PUT /api/testimonials/[id] error:", error)
    return errorResponse("Failed to update testimonial", 500)
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
    const validatedData = testimonialUpdateSchema.parse(body)
    
    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    })
    
    if (!existingTestimonial) return notFoundResponse("Testimonial")
    
    // Validate rating if provided
    let validatedRating: number | null = existingTestimonial.rating
    if (validatedData.rating !== undefined) {
      try {
        validatedRating = validateRating(validatedData.rating)
      } catch (error) {
        return errorResponse("Rating must be between 1 and 5", 400)
      }
    }
    
    // Check if project exists if projectId is provided
    if (validatedData.projectId && validatedData.projectId !== existingTestimonial.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: validatedData.projectId },
        select: { id: true, title: true }
      })
      
      if (!project) {
        return errorResponse("Project not found", 404)
      }
    }
    
    const { rating, ...restData } = validatedData
    
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...restData,
        ...(rating !== undefined && { rating: validatedRating ?? undefined }),
        projectId: validatedData.projectId,
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
    return successResponse(formattedTestimonial)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return notFoundResponse("Testimonial")
    }
    console.error("PATCH /api/testimonials/[id] error:", error)
    return errorResponse("Failed to update testimonial", 500)
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    })
    
    if (!existingTestimonial) return notFoundResponse("Testimonial")
    
    await prisma.testimonial.delete({ 
      where: { id } 
    })
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("DELETE /api/testimonials/[id] error:", error)
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return notFoundResponse("Testimonial")
    }
    return errorResponse("Failed to delete testimonial", 500)
  }
}