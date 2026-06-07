import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"
import { formatProject } from "@/helpers/project-helpers"

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        categoryProjects: { include: { catEntry: true } },
        projectTeams: { include: { teamEntry: true } },
        testimonials: {
          where: { published: true },
          orderBy: { createdAt: "desc" }
        },
      },
    })
    
    if (!project) return notFoundResponse("Project")
    
    const formattedProject = formatProject(project)
    return successResponse(formattedProject)
  } catch (error) {
    console.error("GET /api/projects/slug/[slug] error:", error)
    return errorResponse("Failed to fetch project", 500)
  }
}