import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-response"
import { settingsBulkSchema, settingSchema } from "@/backend-schemas/setting.schema"
import { z } from "zod"

export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.setting.findMany({
      orderBy: { key: "asc" },
      select: { key: true, value: true, updatedAt: true }
    })

    // Ubah menjadi object format yang nyaman dipakai di frontend
    const settingsObject = settings.reduce((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {} as Record<string, string>)

    return successResponse({
      data: settingsObject,
      meta: { total: settings.length }
    })
  } catch (error) {
    console.error("GET /api/settings:", error)
    return errorResponse("Failed to fetch settings", 500)
  }
}

// Bulk Upsert
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = settingsBulkSchema.parse(body)

    const operations = validated.settings.map(({ key, value }) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )

    const results = await prisma.$transaction(operations)

    return successResponse({
      message: "Settings berhasil diupdate",
      updated: results.length
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    console.error("PUT /api/settings:", error)
    return errorResponse("Failed to update settings", 500)
  }
}