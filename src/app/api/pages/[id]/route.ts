import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"
import { pageUpdateSchema } from "@/backend-schemas/page.schema"
import { z } from "zod"
import { formatPage } from "@/helpers/page-helpers"

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const page = await prisma.page.findUnique({ 
      where: { id } 
    })
    
    if (!page) return notFoundResponse("Page")
    
    const formattedPage = formatPage(page)
    return successResponse(formattedPage)
  } catch (error) {
    console.error("GET /api/pages/[id] error:", error)
    return errorResponse("Failed to fetch page", 500)
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
    
    const textSchema = pageUpdateSchema.partial()
    const validatedData = textSchema.parse(body)
    
    const existingPage = await prisma.page.findUnique({
      where: { id }
    })
    
    if (!existingPage) return notFoundResponse("Page")
    
    if (validatedData.slug && validatedData.slug !== existingPage.slug) {
      const slugExists = await prisma.page.findUnique({
        where: { slug: validatedData.slug }
      })
      
      if (slugExists) {
        return errorResponse("Slug already exists", 409)
      }
    }
    
    const page = await prisma.page.update({ 
      where: { id }, 
      data: validatedData 
    })
    
    return successResponse(page)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return notFoundResponse("Page")
    }
    console.error("PUT /api/pages/[id] error:", error)
    return errorResponse("Failed to update page", 500)
  }
}

export async function PATCH(
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
    
    const textSchema = pageUpdateSchema.partial()
    const validatedData = textSchema.parse(body)
    
    const existingPage = await prisma.page.findUnique({
      where: { id }
    })
    
    if (!existingPage) return notFoundResponse("Page")
    
    if (validatedData.slug && validatedData.slug !== existingPage.slug) {
      const slugExists = await prisma.page.findUnique({
        where: { slug: validatedData.slug }
      })
      
      if (slugExists) {
        return errorResponse("Slug already exists", 409)
      }
    }
    
    const page = await prisma.page.update({ 
      where: { id }, 
      data: validatedData 
    })
    
    return successResponse(page)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return notFoundResponse("Page")
    }
    console.error("PATCH /api/pages/[id] error:", error)
    return errorResponse("Failed to update page", 500)
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id }
    })
    
    if (!existingPage) return notFoundResponse("Page")
    
    // Optional: Prevent deletion of important pages
    const protectedPages = ["home", "about", "contact"]
    if (protectedPages.includes(existingPage.slug)) {
      return errorResponse("Cannot delete protected page", 403)
    }
    
    await prisma.page.delete({ 
      where: { id } 
    })
    
    return successResponse({ message: "Page deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/pages/[id] error:", error)
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return notFoundResponse("Page")
    }
    return errorResponse("Failed to delete page", 500)
  }
}