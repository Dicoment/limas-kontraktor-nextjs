import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"
import { teamUpdateSchema } from "@/backend-schemas/team.schema"
import { z } from "zod"
import { formatTeam, validateEmail, validatePhone } from "@/helpers/team-helpers"

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
const MAX_FILE_SIZE = 5 * 1024 * 1024

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
    
    const formData = await request.formData()
    
    const body: Record<string, any> = {}
    for (const [key, value] of (formData as any).entries()) {
      if (typeof value === "string") {
        body[key] = value
      }
    }
    
    const textSchema = teamUpdateSchema.partial()
    const validatedData = textSchema.parse(body)
    
    const existingTeam = await prisma.team.findUnique({
      where: { id }
    })
    
    if (!existingTeam) return notFoundResponse("Team")
    
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
        name: validatedData.name ?? undefined,
        position: validatedData.position ?? undefined,
        bio: validatedData.bio ?? undefined,
        avatar: validatedData.avatar ?? null,
        email: validatedEmail ?? undefined,
        phone: validatedPhone ?? undefined,
        displayOrder: validatedData.displayOrder ?? undefined,
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