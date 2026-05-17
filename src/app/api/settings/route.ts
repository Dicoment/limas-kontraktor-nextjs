import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse, paginatedResponse } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(sp.get("page") || "1", 10))
    const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") || "50", 10)))
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      prisma.setting.findMany({ skip, take: limit, orderBy: { key: "asc" } }),
      prisma.setting.count(),
    ])
    return successResponse(paginatedResponse(data, total, page, limit))
  } catch (error) {
    console.error("GET /api/settings error:", error)
    return errorResponse("Failed to fetch settings", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value } = body

    const existing = await prisma.setting.findUnique({ where: { key } })
    if (existing) return errorResponse("Setting with this key already exists", 409)

    return successResponse(await prisma.setting.create({ data: { key, value: value || "" } }), 201)
  } catch (error) {
    console.error("POST /api/settings error:", error)
    return errorResponse("Failed to create setting", 500)
  }
}