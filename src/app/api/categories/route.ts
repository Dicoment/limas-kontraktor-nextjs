import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse, paginatedResponse } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(sp.get("page") || "1", 10))
    const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") || "50", 10)))
    const skip = (page - 1) * limit
    const where = {} // Simple no-filter for now

    const [data, total] = await Promise.all([
      prisma.category.findMany({ where, skip, take: limit, orderBy: { name: "asc" } }),
      prisma.category.count({ where }),
    ])
    return successResponse(paginatedResponse(data, total, page, limit))
  } catch (error) {
    console.error("GET /api/categories error:", error)
    return errorResponse("Failed to fetch categories", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, type, description } = body

    const existing = await prisma.category.findUnique({ where: { slug } as any })
    if (existing) return errorResponse("Category with this slug already exists", 409)

    const category = await prisma.category.create({
      data: { name, slug, type, description: description || null },
    })
    return successResponse(category, 201)
  } catch (error) {
    console.error("POST /api/categories error:", error)
    return errorResponse("Failed to create category", 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const category = await prisma.category.update({ where: { id }, data: body })
    return successResponse(category)
  } catch {
    return notFoundResponse("Category")
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.category.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}