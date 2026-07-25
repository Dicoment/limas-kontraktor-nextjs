import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-response"
import { leadsLogSchema } from "@/backend-schemas/leads-log.schema"
import { z } from "zod"
import { 
  formatLeadsLogs, 
  formatLeadsLog,
  buildLeadsLogWhereInput, 
  getPaginationParams,
  getSortParams
} from "@/helpers/leads-log-helpers"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const where = buildLeadsLogWhereInput(searchParams)
    const { page, limit, skip } = getPaginationParams(searchParams)
    const orderBy = getSortParams(searchParams)

    const [data, total] = await Promise.all([
      prisma.leadsLog.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.leadsLog.count({ where }),
    ])
    
    const formattedData = formatLeadsLogs(data)
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
      },
      summary: {
        totalLeads: total,
        withPhone: data.filter((l: { phone: string | null }) => l.phone).length,
        withMessage: data.filter((l: { message: string | null }) => l.message).length,
      }
    })
  } catch (error) {
    console.error("GET /api/leads-logs error:", error)
    return errorResponse("Failed to fetch leads logs", 500)
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
    
    // Get client IP and user agent from request headers
    // FIX: x-forwarded-for bisa berisi beberapa IP dipisah koma kalau request
    // lewat beberapa proxy/CDN (mis. "203.0.113.5, 70.41.3.18") — ambil yang
    // PERTAMA aja (itu IP client asli), sisanya IP proxy perantara.
    const xForwardedFor = request.headers.get("x-forwarded-for")
    const ipAddress = xForwardedFor
      ? xForwardedFor.split(",")[0].trim()
      : (request.headers.get("x-real-ip") || "unknown")
    const userAgent = request.headers.get("user-agent") || "unknown"
    
    // Validate with zod schema
    const validatedData = leadsLogSchema.parse({
      ...body,
      ipAddress: body.ipAddress || ipAddress,
      userAgent: body.userAgent || userAgent,
    })
    
    const { name, phone, message, projectId, pageUrl, ipAddress: finalIp, userAgent: finalUserAgent } = validatedData

    // Optional: Check if project exists if projectId is provided
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true }
      })
      
      if (!project) {
        return errorResponse("Project not found", 404)
      }
    }

    const log = await prisma.leadsLog.create({
      data: { 
        name: name || null, 
        phone: phone || null, 
        message: message || null, 
        projectId: projectId || null, 
        pageUrl: pageUrl || null, 
        ipAddress: finalIp || null, 
        userAgent: finalUserAgent || null 
      }
    })
    
    const formattedLog = formatLeadsLog(log)
    return successResponse(formattedLog, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    console.error("POST /api/leads-logs error:", error)
    return errorResponse("Failed to create leads log", 500)
  }
}