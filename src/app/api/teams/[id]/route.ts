import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const team = await prisma.team.findUnique({ where: { id } })
  if (!team) return notFoundResponse("Team")
  return successResponse(team)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const team = await prisma.team.update({ where: { id }, data: body })
    return successResponse(team)
  } catch {
    return notFoundResponse("Team")
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await prisma.team.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch {
    return notFoundResponse("Team")
  }
}