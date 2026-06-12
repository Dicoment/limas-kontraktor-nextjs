import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"
import { formatTestimonials } from "@/helpers/testimonial-helpers"

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const url = new URL(request.url)
    const onlyPublished = url.searchParams.get("published") !== "false"
    
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, title: true }
    })
    
    if (!project) return notFoundResponse("Project")
    
    const testimonials = await prisma.testimonial.findMany({
      where: {
        projectId,
        ...(onlyPublished && { published: true })
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
      },
      orderBy: { createdAt: "desc" }
    })
    
    const formattedTestimonials = formatTestimonials(testimonials)
    
    // Calculate average rating
    const ratings = testimonials.filter((t: { rating: number | null }) => t.rating !== null).map((t: { rating: number | null }) => t.rating as number)
    const averageRating = ratings.length > 0 
      ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length 
      : null
    
    return successResponse({
      project,
      testimonials: formattedTestimonials,
      summary: {
        total: testimonials.length,
        averageRating: averageRating ? Number(averageRating.toFixed(1)) : null,
        totalWithRating: ratings.length,
      }
    })
  } catch (error) {
    console.error("GET /api/testimonials/project/[projectId] error:", error)
    return errorResponse("Failed to fetch project testimonials", 500)
  }
}