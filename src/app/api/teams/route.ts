import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse, paginatedResponse } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(sp.get("page") || "1", 10))
    const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") || "20", 10)))
    const search = sp.get("search") || undefined
    const skip = (page - 1) * limit
    const where = search ? {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { position: { contains: search, mode: "insensitive" as const } },
      ],
    } : {}

    const [data, total] = await Promise.all([
      prisma.team.findMany({ where: where as any, skip, take: limit, orderBy: { displayOrder: "asc" as const } }),
      prisma.team.count({ where: where as any }),
    ])
    return successResponse(paginatedResponse(data, total, page, limit))
  } catch (error) {
    console.error("GET /api/teams error:", error)
    return errorResponse("Failed to fetch teams", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, position, bio, avatar, email, phone, displayOrder } = body
    const team = await prisma.team.create({
      data: { name, position: position || null, bio: bio || null, avatar: avatar || null, email: email || null, phone: phone || null, displayOrder: displayOrder ?? 0 },
    })
    return successResponse(team, 201)
  } catch (error) {
    console.error("POST /api/teams error:", error)
    return errorResponse("Failed to create team", 500)
  }
}
