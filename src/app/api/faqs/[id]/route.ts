import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"
import { faqUpdateSchema } from "@/backend-schemas/faq.schema"
import { z } from "zod"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const faq = await prisma.faq.findUnique({ where: { id } })
    if (!faq) return notFoundResponse("Faq")
    return successResponse(faq)
  } catch (error) {
    console.error("GET /api/faqs/[id] error:", error)
    return errorResponse("Failed to fetch FAQ", 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const validated = faqUpdateSchema.parse(body)

    const existing = await prisma.faq.findUnique({ where: { id } })
    if (!existing) return notFoundResponse("Faq")

    const faq = await prisma.faq.update({ where: { id }, data: validated })
    return successResponse(faq)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    console.error("PUT /api/faqs/[id] error:", error)
    return errorResponse("Failed to update FAQ", 500)
  }
}