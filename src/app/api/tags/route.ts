import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse, paginatedResponse } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(sp.get("page") || "1", 10))
    const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") || "50", 10)))
    const search = sp.get("search") || undefined
    const skip = (page - 1) * limit
    const where = search && typeof search === "string" ? { name: { contains: search, mode: "insensitive" as const } } : {}

    const [data, total] = await Promise.all([
      prisma.tag.findMany({ where, skip, take: limit, orderBy: { name: "asc" } }),
      prisma.tag.count({ where }),
    ])
    return successResponse(paginatedResponse(data, total, page, limit))
  } catch (error) {
    console.error("GET /api/tags error:", error)
    return errorResponse("Failed to fetch tags", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug } = body
    const existing = await prisma.tag.findUnique({ where: { slug } as any })
    if (existing) return errorResponse("Tag with this slug already exists", 409)
    const tag = await prisma.tag.create({ data: { name, slug } })
    return successResponse(tag, 201)
  } catch (error) {
    console.error("POST /api/tags error:", error)
    return errorResponse("Failed to create tag", 500)
  }
}
export async function PUT(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await ({} as any).request.json()
    const tag = await prisma.tag.update({ where: { id }, data: body })
    return successResponse(tag)
  } catch {
    return notFoundResponse("Tag")
  }
}
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.tag.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}