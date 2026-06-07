import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const page = await prisma.page.findUnique({
      where: { slug }
    })
    
    if (!page) return notFoundResponse("Page")
    
    // Only return published pages for public access
    if (!page.published) {
      return notFoundResponse("Page")
    }
    
    return successResponse(page)
  } catch (error) {
    console.error("GET /api/pages/slug/[slug] error:", error)
    return errorResponse("Failed to fetch page", 500)
  }
}   