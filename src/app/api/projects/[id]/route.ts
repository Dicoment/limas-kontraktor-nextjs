import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"
import { projectUpdateSchema } from "@/backend-schemas/project.schema"
import { z } from "zod"
import { formatProject, validateGallery } from "@/helpers/project-helpers"

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    
    const formattedProject = formatProject(project)
    return successResponse(formattedProject)
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error)
    return errorResponse("Failed to fetch project", 500)
  }
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    let body
    try {
      body = await request.json()
    } catch (error) {
      return errorResponse("Invalid JSON body", 400)
    }
    
    const validatedData = projectUpdateSchema.parse(body)
    
    const existingProject = await prisma.project.findUnique({
      where: { id }
    })
    
    if (!existingProject) return notFoundResponse("Project")
    
    if (validatedData.slug && validatedData.slug !== existingProject.slug) {
      const slugExists = await prisma.project.findUnique({
        where: { slug: validatedData.slug }
      })
      
      if (slugExists) {
        return errorResponse("Slug already exists", 409)
      }
    }
    
    const { categoryIds, teamIds, gallery, ...updateData } = validatedData
    
    const validatedGallery = gallery !== undefined ? validateGallery(gallery) : undefined
    
    const updatePayload: any = {
      ...updateData,
      ...(validatedGallery !== undefined && { gallery: validatedGallery }),
    }
    
    const updatedProject = await prisma.$transaction(async (tx: any) => {
      if (categoryIds !== undefined) {
        await tx.categoryProject.deleteMany({ where: { projectId: id } })
        if (categoryIds.length > 0) {
          await tx.categoryProject.createMany({
            data: categoryIds.map((cid: string) => ({ 
              projectId: id, 
              categoryId: cid 
            }))
          })
        }
      }
      
      if (teamIds !== undefined) {
        await tx.projectTeam.deleteMany({ where: { projectId: id } })
        if (teamIds.length > 0) {
          await tx.projectTeam.createMany({
            data: teamIds.map(({ teamId, role }: { teamId: string; role?: string }) => ({ 
              projectId: id, 
              teamId: teamId,
              role: role || null
            }))
          })
        }
      }
      
      return await tx.project.update({
        where: { id },
        data: updatePayload,
      })
    })
    
    const finalProject = await prisma.project.findUnique({
      where: { id },
      include: {
        categoryProjects: { include: { catEntry: true } },
        projectTeams: { include: { teamEntry: true } },
        testimonials: true,
      },
    })
    
    const formattedProject = formatProject(finalProject!)
    return successResponse(formattedProject)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    console.error("PUT /api/projects/[id] error:", error)
    return errorResponse("Failed to update project", 500)
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        testimonials: { select: { id: true } }
      }
    })
    
    if (!existingProject) return notFoundResponse("Project")
    
    if (existingProject.testimonials.length > 0) {
      return errorResponse(
        "Cannot delete project because it has testimonials. Delete testimonials first.",
        409
      )
    }
    
    await prisma.project.delete({ 
      where: { id } 
    })
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error)
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return notFoundResponse("Project")
    }
    return errorResponse("Failed to delete project", 500)
  }
}