import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const setting = await prisma.setting.findUnique({ where: { id } })
  if (!setting) return notFoundResponse("Setting")
  return successResponse(setting)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const setting = await prisma.setting.update({ where: { id }, data: body })
    return successResponse(setting)
  } catch {
    return notFoundResponse("Setting")
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.setting.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}