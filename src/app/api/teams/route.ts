import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-response"
import { teamSchema } from "@/backend-schemas/team.schema"
import { z } from "zod"
import { 
  formatTeams, 
  formatTeam,
  buildTeamWhereInput, 
  getPaginationParams,
  getSortParams,
  validateEmail,
  validatePhone
} from "@/helpers/team-helpers"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const where = buildTeamWhereInput(searchParams)
    const { page, limit, skip } = getPaginationParams(searchParams)
    const orderBy = getSortParams(searchParams)

    const [data, total] = await Promise.all([
      prisma.team.findMany({
        where,
        include: {
          projectTeams: {
            include: {
              projEntry: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  coverImage: true,
                  status: true
                }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.team.count({ where }),
    ])
    
    const formattedData = formatTeams(data)
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
    console.error("GET /api/teams error:", error)
    return errorResponse("Failed to fetch teams", 500)
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
    const validatedData = teamSchema.parse(body)
    
    const { name, position, bio, avatar, email, phone, displayOrder } = validatedData

    // Validate email format if provided
    let validatedEmail = null
    if (email) {
      try {
        validatedEmail = validateEmail(email)
      } catch (error) {
        return errorResponse("Invalid email format", 400)
      }
    }
    
    // Validate phone format if provided
    let validatedPhone = null
    if (phone) {
      try {
        validatedPhone = validatePhone(phone)
      } catch (error) {
        return errorResponse("Invalid phone number format", 400)
      }
    }

    const team = await prisma.team.create({
      data: {
        name,
        position: position || null,
        bio: bio || null,
        avatar: avatar || null,
        email: validatedEmail,
        phone: validatedPhone,
        displayOrder: displayOrder ?? 0,
      },
    })
    
    return successResponse(team, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    console.error("POST /api/teams error:", error)
    return errorResponse("Failed to create team", 500)
  }
}