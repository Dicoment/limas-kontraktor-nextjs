import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-response"
import { projectSchema } from "@/backend-schemas/project.schema"
import { z } from "zod"
import { 
  formatProjects, 
  formatProject,
  buildProjectWhereInput, 
  getPaginationParams,
  getSortParams,
  validateGallery
} from "@/helpers/project-helpers"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const where = buildProjectWhereInput(searchParams)
    const { page, limit, skip } = getPaginationParams(searchParams)
    const orderBy = getSortParams(searchParams)

    const [data, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          categoryProjects: { include: { catEntry: true } },
          projectTeams: { include: { teamEntry: true } },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.project.count({ where }),
    ])
    
    const formattedData = formatProjects(data)
    const totalPages = Math.ceil(total / limit)
    
    // Consistent response format
    return successResponse({
      items: formattedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    })
  } catch (error) {
    console.error("GET /api/projects error:", error)
    return errorResponse("Failed to fetch projects", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (error) {
      return errorResponse("Invalid JSON body", 400)
    }
    
    // Validate with zod schema
    const validatedData = projectSchema.parse(body)
    
    const { 
      title, slug, description, location, client, limasRole, 
      coverImage, gallery, status, seoTitle, seoDescription, 
      categoryIds, teamIds 
    } = validatedData

    // Check for existing slug
    const existing = await prisma.project.findUnique({ 
      where: { slug } 
    })
    
    if (existing) {
      return errorResponse("Project with this slug already exists", 409)
    }

    // Validate gallery URLs
    const validatedGallery = validateGallery(gallery)

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description: description || "",
        location: location || null,
        client: client || null,
        limasRole: limasRole || null,
        coverImage: coverImage || null,
        gallery: validatedGallery,
        status: status || "DRAFT",
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        categoryProjects: categoryIds?.length
          ? { create: categoryIds.map((cid: string) => ({ catEntry: { connect: { id: cid } } })) }
          : undefined,
        projectTeams: teamIds?.length
          ? { create: teamIds.map(({ teamId, role }) => ({ 
              teamEntry: { connect: { id: teamId } }, 
              role: role || null 
            })) }
          : undefined,
      },
      include: {
        categoryProjects: { include: { catEntry: true } },
        projectTeams: { include: { teamEntry: true } },
      },
    })
    
    const formattedProject = formatProject(project)
    return successResponse(formattedProject, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    console.error("POST /api/projects error:", error)
    return errorResponse("Failed to create project", 500)
  }
}
