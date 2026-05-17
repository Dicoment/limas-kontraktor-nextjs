import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse } from "@/lib/api-response"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await prisma.category.findUnique({
    where: { id },
    include: { blogPostCategories: { include: { catEntry: true } }, categoryProjects: { include: { projEntry: true } } },
  })
  if (!category) return notFoundResponse("Category")
  return successResponse(category)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const category = await prisma.category.update({
      where: { id },
      data: body,
      include: { blogPostCategories: { include: { catEntry: true } }, categoryProjects: { include: { projEntry: true } } },
    })
    return successResponse(category)
  } catch {
    return notFoundResponse("Category")
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.category.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}