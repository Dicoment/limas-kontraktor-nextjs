import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"
import { paginatedResponse } from "@/lib/api-response"

const parseParams = (request: NextRequest) => {
  const sp = request.nextUrl.searchParams
  const search = sp.get("search") || undefined
  const status = sp.get("status") || undefined
  const page = Math.max(1, parseInt(sp.get("page") || "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") || "10", 10)))
  const skip = (page - 1) * limit
  const where: Record<string, unknown> = {}
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ]
  }
  if (status) where.status = status

  return { page, limit, skip, where }
}

export async function GET(request: NextRequest) {
  try {
    const { page, limit, skip, where } = parseParams(request)

    const [data, total] = await Promise.all([
      prisma.project.findMany({
        where: where as any,
        include: {
          categoryProjects: { include: { catEntry: true } },
          projectTeams: { include: { teamEntry: true } },
        },
        skip, take: limit, orderBy: { createdAt: "desc" },
      }),
      prisma.project.count({ where: where as any }),
    ])

    return successResponse(paginatedResponse(data, total, page, limit))
  } catch (error) {
    console.error("GET /api/projects error:", error)
    return errorResponse("Failed to fetch projects", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, location, client, limasRole, status, coverImage, seoTitle, seoDescription, description, categoryIds, teamIds } = body

    const existing = await prisma.project.findUnique({ where: { slug } })
    if (existing) return errorResponse("Project with this slug already exists", 409)

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description: description || "",
        location: location || null,
        client: client || null,
        limasRole: limasRole || null,
        coverImage: coverImage || null,
        status: status || "DRAFT",
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        categoryProjects: categoryIds?.length
          ? { create: categoryIds.map((cid: string) => ({ category: { connect: { id: cid } } })) }
          : undefined,
        projectTeams: teamIds?.length
          ? { create: teamIds.map(({ teamId, role }: { teamId: string; role?: string }) => ({ team: { connect: { id: teamId } }, role: role || null })) }
          : undefined,
      },
      include: {
        categoryProjects: { include: { catEntry: true } },
        projectTeams: { include: { teamEntry: true } },
      },
    })

    return successResponse(project, 201)
  } catch (error) {
    console.error("POST /api/projects error:", error)
    return errorResponse("Failed to create project", 500)
  }
}
