import { prisma } from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      categoryProjects: { include: { catEntry: true } },
      projectTeams: { include: { teamEntry: true } },
      testimonials: true,
    },
  })
  if (!project) return notFoundResponse("Project")
  return successResponse(project)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const { categoryIds, teamIds, ...data } = body

    const existing = await prisma.project.findUnique({ where: { id } })
    if (!existing) return notFoundResponse("Project")

    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await prisma.project.findUnique({ where: { slug: data.slug } })
      if (slugExists) return errorResponse("Slug already used", 409)
    }

    await prisma.$transaction([
      prisma.categoryProject.deleteMany({ where: { projectId: id } }),
      prisma.projectTeam.deleteMany({ where: { projectId: id } }),
      prisma.project.update({
        where: { id },
        data: {
          ...data,
          categoryProjects: categoryIds?.length
            ? { create: categoryIds.map((cid: string) => ({ category: { connect: { id: cid } } })) }
            : undefined,
          projectTeams: teamIds?.length
            ? { create: teamIds.map(({ teamId, role }: { teamId: string; role?: string }) => ({ team: { connect: { id: teamId } }, role: role || null })) }
            : undefined,
        },
      }),
    ])

    const updated = await prisma.project.findUnique({
      where: { id },
      include: {
        categoryProjects: { include: { catEntry: true } },
        projectTeams: { include: { teamEntry: true } },
        testimonials: true,
      },
    })
    return successResponse(updated)
  } catch (error) {
    console.error("PUT /api/projects error:", error)
    return errorResponse("Failed to update project", 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await prisma.project.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch {
    return notFoundResponse("Project")
  }
}