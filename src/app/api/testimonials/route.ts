import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse, paginatedResponse } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(sp.get("page") || "1", 10))
    const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") || "20", 10)))
    const published = sp.get("published")
    const skip = (page - 1) * limit
    const where = published !== null ? { published: published === "true" } : {}

    const [data, total] = await Promise.all([
      prisma.testimonial.findMany({ where: where as any, include: { project: true }, skip, take: limit, orderBy: { createdAt: "desc" as const } }),
      prisma.testimonial.count({ where: where as any }),
    ])
    return successResponse(paginatedResponse(data, total, page, limit))
  } catch (error) {
    console.error("GET /api/testimonials error:", error)
    return errorResponse("Failed to fetch testimonials", 500)
  }
}