import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-response"
import { z } from "zod"

const reorderSchema = z.object({
  teams: z.array(z.object({
    id: z.string(),
    displayOrder: z.number().int().min(0)
  }))
})

export async function PATCH(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (error) {
      return errorResponse("Invalid JSON body", 400)
    }
    
    const validatedData = reorderSchema.parse(body)
    
    // Update all display orders in a transaction
    await prisma.$transaction(
      validatedData.teams.map(({ id, displayOrder }) =>
        prisma.team.update({
          where: { id },
          data: { displayOrder }
        })
      )
    )
    
    return successResponse({ message: "Display order updated successfully" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    console.error("PATCH /api/teams/reorder error:", error)
    return errorResponse("Failed to update display order", 500)
  }
}
