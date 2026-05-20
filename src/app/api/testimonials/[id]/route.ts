import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const testimonial = await prisma.testimonial.findUnique({ where: { id } })
  if (!testimonial) return notFoundResponse("Testimonial")
  return successResponse(testimonial)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const testimonial = await prisma.testimonial.update({ where: { id }, data: body, include: { project: true } })
    return successResponse(testimonial)
  } catch {
    return notFoundResponse("Testimonial")
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.testimonial.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}
