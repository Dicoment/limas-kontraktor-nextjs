import { NextRequest, NextResponse } from "next/server"
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
      prisma.page.findMany({ where: where as any, skip, take: limit, orderBy: { title: "asc" } }),
      prisma.page.count({ where: where as any }),
    ])
    return successResponse(paginatedResponse(data, total, page, limit))
  } catch (error) {
    console.error("GET /api/pages error:", error)
    return errorResponse("Failed to fetch pages", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, content, seoTitle, seoDescription, published } = body

    const existing = await prisma.page.findUnique({ where: { slug } })
    if (existing) return errorResponse("Page with this slug already exists", 409)

    return successResponse(await prisma.page.create({
      data: { title, slug, content: content || "", seoTitle: seoTitle || null, seoDescription: seoDescription || null, published: published ?? false },
    }), 201)
  } catch (error) {
    console.error("POST /api/pages error:", error)
    return errorResponse("Failed to create page", 500)
  }
}