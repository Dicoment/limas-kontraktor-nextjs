import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"
import { leadsLogSchema } from "@/backend-schemas/leads-log.schema"
import { z } from "zod"
import { formatLeadsLog } from "@/helpers/leads-log-helpers"

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const lead = await prisma.leadsLog.findUnique({ 
      where: { id }
    })
    
    if (!lead) return notFoundResponse("LeadsLog")
    
    const formattedLead = formatLeadsLog(lead)
    return successResponse(formattedLead)
  } catch (error) {
    console.error("GET /api/leads-logs/[id] error:", error)
    return errorResponse("Failed to fetch leads log", 500)
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
    
    // Validate with full schema
    const validatedData = leadsLogSchema.parse(body)
    
    // Check if leads log exists
    const existingLead = await prisma.leadsLog.findUnique({
      where: { id }
    })
    
    if (!existingLead) return notFoundResponse("LeadsLog")
    
    // Optional: Check if project exists if projectId is provided
    if (validatedData.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: validatedData.projectId },
        select: { id: true }
      })
      
      if (!project) {
        return errorResponse("Project not found", 404)
      }
    }
    
    const { name, phone, message, projectId, pageUrl, ipAddress, userAgent } = validatedData
    
    const lead = await prisma.leadsLog.update({ 
      where: { id }, 
      data: {
        name: name || null,
        phone: phone || null,
        message: message || null,
        projectId: projectId || null,
        pageUrl: pageUrl || null,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      }
    })
    
    const formattedLead = formatLeadsLog(lead)
    return successResponse(formattedLead)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return notFoundResponse("LeadsLog")
    }
    console.error("PUT /api/leads-logs/[id] error:", error)
    return errorResponse("Failed to update leads log", 500)
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
    const validatedData = leadsLogSchema.partial().parse(body)
    
    // Check if leads log exists
    const existingLead = await prisma.leadsLog.findUnique({
      where: { id }
    })
    
    if (!existingLead) return notFoundResponse("LeadsLog")
    
    // Optional: Check if project exists if projectId is provided
    if (validatedData.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: validatedData.projectId },
        select: { id: true }
      })
      
      if (!project) {
        return errorResponse("Project not found", 404)
      }
    }
    
    const lead = await prisma.leadsLog.update({ 
      where: { id }, 
      data: validatedData
    })
    
    const formattedLead = formatLeadsLog(lead)
    return successResponse(formattedLead)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return notFoundResponse("LeadsLog")
    }
    console.error("PATCH /api/leads-logs/[id] error:", error)
    return errorResponse("Failed to update leads log", 500)
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if leads log exists
    const existingLead = await prisma.leadsLog.findUnique({
      where: { id }
    })
    
    if (!existingLead) return notFoundResponse("LeadsLog")
    
    await prisma.leadsLog.delete({ 
      where: { id } 
    })
    
    return successResponse({ message: "LeadsLog deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/leads-logs/[id] error:", error)
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return notFoundResponse("LeadsLog")
    }
    return errorResponse("Failed to delete leads log", 500)
  }
}