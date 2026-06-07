import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, notFoundResponse } from "@/lib/api-response"
import { settingSchema } from "@/backend-schemas/setting.schema"
import { z } from "zod"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params

  const setting = await prisma.setting.findUnique({
    where: { key }
  })

  if (!setting) return notFoundResponse("Setting")

  return successResponse(setting)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params
  try {
    const body = await request.json()
    const validated = settingSchema.parse({ key, ...body })

    const setting = await prisma.setting.upsert({
      where: { key: validated.key },
      update: { value: validated.value },
      create: { key: validated.key, value: validated.value },
    })

    return successResponse(setting)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    console.error(`PUT /api/settings/${key}:`, error)
    return errorResponse("Failed to update setting", 500)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params

  await prisma.setting.delete({ where: { key } })
  return new Response(null, { status: 204 })
}