import { NextRequest, NextResponse } from "next/server"
import { getLeadsLogs, deleteLeadsLog } from "@/services/lead.service"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(sp.get("page") || "1", 10))
    const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") || "20", 10)))

    const result = await getLeadsLogs({ page, limit })
    return successResponse(result)
  } catch (error) {
    console.error("GET /api/leads-logs error:", error)
    return errorResponse("Failed to fetch leads logs", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, message, projectId, pageUrl, ipAddress, userAgent } = body
    const { prisma } = await import("@/lib/prisma")
    const log = await prisma.leadsLog.create({
      data: { name: name || null, phone: phone || null, message: message || null, projectId: projectId || null, pageUrl: pageUrl || null, ipAddress: ipAddress || null, userAgent: userAgent || null },
    })
    return successResponse(log, 201)
  } catch (error) {
    console.error("POST /api/leads-logs error:", error)
    return errorResponse("Failed to create leads log", 500)
  }
}