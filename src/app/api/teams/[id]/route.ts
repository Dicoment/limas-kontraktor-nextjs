import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"
import { teamUpdateSchema } from "@/backend-schemas/team.schema"
import { z } from "zod"
import { formatTeam, validateEmail, validatePhone } from "@/helpers/team-helpers"

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        projectTeams: {
          include: {
            projEntry: {
              select: {
                id: true,
                title: true,
                slug: true,
                status: true,
                coverImage: true
              }
            }
          }
        }
      }
    })
    
    if (!team) return notFoundResponse("Team")
    
    const formattedTeam = formatTeam(team)
    return successResponse(formattedTeam)
  } catch (error) {
    console.error("GET /api/teams/[id] error:", error)
    return errorResponse("Failed to fetch team", 500)
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
    
    // Validate with update schema
    const validatedData = teamUpdateSchema.parse(body)
    
    // Check if team exists
    const existingTeam = await prisma.team.findUnique({
      where: { id }
    })
    
    if (!existingTeam) return notFoundResponse("Team")
    
    // Validate email format if provided
    let validatedEmail = existingTeam.email
    if (validatedData.email !== undefined) {
      if (validatedData.email) {
        try {
          validatedEmail = validateEmail(validatedData.email)
        } catch (error) {
          return errorResponse("Invalid email format", 400)
        }
      } else {
        validatedEmail = null
      }
    }
    
    // Validate phone format if provided
    let validatedPhone = existingTeam.phone
    if (validatedData.phone !== undefined) {
      if (validatedData.phone) {
        try {
          validatedPhone = validatePhone(validatedData.phone)
        } catch (error) {
          return errorResponse("Invalid phone number format", 400)
        }
      } else {
        validatedPhone = null
      }
    }
    
    const team = await prisma.team.update({
      where: { id },
      data: {
        ...validatedData,
        email: validatedEmail,
        phone: validatedPhone,
      },
      include: {
        projectTeams: {
          include: {
            projEntry: {
              select: {
                id: true,
                title: true,
                slug: true,
                status: true,
                coverImage: true
              }
            }
          }
        }
      }
    })
    
    const formattedTeam = formatTeam(team)
    return successResponse(formattedTeam)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return notFoundResponse("Team")
    }
    console.error("PUT /api/teams/[id] error:", error)
    return errorResponse("Failed to update team", 500)
  }
}

export async function PATCH(
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
    
    // Validate partial update
    const validatedData = teamUpdateSchema.parse(body)
    
    // Check if team exists
    const existingTeam = await prisma.team.findUnique({
      where: { id }
    })
    
    if (!existingTeam) return notFoundResponse("Team")
    
    // Validate email format if provided
    let validatedEmail = existingTeam.email
    if (validatedData.email !== undefined) {
      if (validatedData.email) {
        try {
          validatedEmail = validateEmail(validatedData.email)
        } catch (error) {
          return errorResponse("Invalid email format", 400)
        }
      } else {
        validatedEmail = null
      }
    }
    
    // Validate phone format if provided
    let validatedPhone = existingTeam.phone
    if (validatedData.phone !== undefined) {
      if (validatedData.phone) {
        try {
          validatedPhone = validatePhone(validatedData.phone)
        } catch (error) {
          return errorResponse("Invalid phone number format", 400)
        }
      } else {
        validatedPhone = null
      }
    }
    
    const team = await prisma.team.update({
      where: { id },
      data: {
        ...validatedData,
        ...(validatedData.email !== undefined && { email: validatedEmail }),
        ...(validatedData.phone !== undefined && { phone: validatedPhone }),
      },
      include: {
        projectTeams: {
          include: {
            projEntry: {
              select: {
                id: true,
                title: true,
                slug: true,
                status: true,
                coverImage: true
              }
            }
          }
        }
      }
    })
    
    const formattedTeam = formatTeam(team)
    return successResponse(formattedTeam)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return notFoundResponse("Team")
    }
    console.error("PATCH /api/teams/[id] error:", error)
    return errorResponse("Failed to update team", 500)
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if team exists with project relations
    const existingTeam = await prisma.team.findUnique({
      where: { id },
      include: {
        projectTeams: {
          select: { projectId: true }
        }
      }
    })
    
    if (!existingTeam) return notFoundResponse("Team")
    
    // Check if team is assigned to any project
    if (existingTeam.projectTeams.length > 0) {
      return errorResponse(
        "Cannot delete team member because they are assigned to projects. Remove them from projects first.",
        409
      )
    }
    
    await prisma.team.delete({ 
      where: { id } 
    })
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("DELETE /api/teams/[id] error:", error)
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return notFoundResponse("Team")
    }
    return errorResponse("Failed to delete team", 500)
  }
}