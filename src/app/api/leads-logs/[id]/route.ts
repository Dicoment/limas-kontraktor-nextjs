import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { deleteLeadsLog } from "@/services/lead.service"
import { successResponse, notFoundResponse } from "@/lib/api-response"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lead = await prisma.leadsLog.findUnique({ where: { id } })
  if (!lead) return notFoundResponse("LeadsLog")
  return successResponse(lead)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const lead = await prisma.leadsLog.update({ where: { id }, data: body })
    return successResponse(lead)
  } catch {
    return notFoundResponse("LeadsLog")
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await deleteLeadsLog(id)
  return new NextResponse(null, { status: 204 })
}