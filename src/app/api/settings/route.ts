import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-response"
import { settingsBulkSchema, settingSchema } from "@/backend-schemas/setting.schema"
import { z } from "zod"

const DEFAULT_SETTINGS: Record<string, string> = {
  company_name: "LIMAS KONTRAKTOR",
  company_description: "LIMAS KONTRAKTOR merupakan brand dari CV Listiya Mandiri Jaya Steel, perusahaan yang bergerak di bidang jasa desain dan konstruksi pembangunan.",
  company_address: "Jl. Mawar IV No.70A, RT.001/RW.007, Kali Baru, Kecamatan Medan Satria, Kota Bekasi, Jawa Barat 17183.",
  contact_phone1: "0823-2072-1150",
  contact_phone2: "0812-8767-2654",
  contact_email: "cvlistiyamandirijayasteel70a@gmail.com",
  social_instagram: "limas.kontraktor",
  social_facebook: "Limas Kontraktor",
  social_tiktok: "LIMAS KONTRAKTOR",
  social_youtube: "Limas Kontraktor",
}

export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.setting.findMany({
      orderBy: { key: "asc" },
      select: { key: true, value: true, updatedAt: true }
    })

    let settingsObject: Record<string, string> = { ...DEFAULT_SETTINGS }
    for (const item of settings) {
      settingsObject[item.key] = item.value
    }

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