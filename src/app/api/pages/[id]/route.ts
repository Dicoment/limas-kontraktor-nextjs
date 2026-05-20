import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const page = await prisma.page.findUnique({ where: { id } })
  if (!page) return notFoundResponse("Page")
  return successResponse(page)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const page = await prisma.page.update({ where: { id }, data: body })
    return successResponse(page)
  } catch {
    return notFoundResponse("Page")
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.page.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}