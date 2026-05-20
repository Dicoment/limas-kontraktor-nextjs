import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tag = await prisma.tag.findUnique({ where: { id } })
  if (!tag) return notFoundResponse("Tag")
  return successResponse(tag)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const tag = await prisma.tag.update({ where: { id }, data: body })
    return successResponse(tag)
  } catch {
    return notFoundResponse("Tag")
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.tag.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}