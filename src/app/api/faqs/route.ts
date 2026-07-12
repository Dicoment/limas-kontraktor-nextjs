import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-response"
import { faqSchema } from "@/backend-schemas/faq.schema"
import { z } from "zod"

export async function GET(request: NextRequest) {
  try {
    const faqs = await prisma.faq.findMany({ orderBy: { createdAt: "desc" } })
    return successResponse(faqs)
  } catch (error) {
    console.error("GET /api/faqs error:", error)
    return errorResponse("Failed to fetch FAQs", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = faqSchema.parse(body)
    const faq = await prisma.faq.create({ data: validated })
    return successResponse(faq, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    console.error("POST /api/faqs error:", error)
    return errorResponse("Failed to create FAQ", 500)
  }
}