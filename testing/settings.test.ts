import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"
import { z } from "zod"

const mockSuccessResponse = vi.fn()
const mockErrorResponse = vi.fn()

vi.mock("@/lib/prisma", () => {
  const actual = vi.importActual("@/lib/prisma")
  return {
    ...actual,
    prisma: {
      ...(actual as any).prisma,
      setting: {
        findMany: vi.fn(),
      },
    },
  }
})

vi.mock("@/lib/api-response", () => ({
  successResponse: (...args: any[]) => mockSuccessResponse(...args),
  errorResponse: (...args: any[]) => mockErrorResponse(...args),
}))

const { prisma } = await import("@/lib/prisma")
const { successResponse, errorResponse } = await import("@/lib/api-response")
const { settingsBulkSchema, settingSchema } = await import("@/backend-schemas/setting.schema")

beforeEach(() => {
  vi.clearAllMocks()
  mockSuccessResponse.mockImplementation((data: any, status = 200) => ({ success: true, data, status }))
  mockErrorResponse.mockImplementation((msg: string, status = 400) => ({ error: msg, status }))
})

describe("GET /api/settings", () => {
  it("returns settings with defaults when database has entries", async () => {
    const fakeDbSettings = [
      { key: "company_name", value: "LIMAS KONTRAKTOR", updatedAt: new Date() },
      { key: "contact_email", value: "test@example.com", updatedAt: new Date() },
    ]

    vi.mocked(prisma.setting.findMany).mockResolvedValue(fakeDbSettings as any)

    const mod = await import("@/app/api/settings/route")
    const req = new NextRequest("http://localhost/api/settings")
    const res = await mod.GET(req)

    expect(prisma.setting.findMany).toHaveBeenCalledWith({
      orderBy: { key: "asc" },
      select: { key: true, value: true, updatedAt: true },
    })
  })

  it("returns default settings when database is empty", async () => {
    vi.mocked(prisma.setting.findMany).mockResolvedValue([])

    const mod = await import("@/app/api/settings/route")
    const req = new NextRequest("http://localhost/api/settings")
    const res = await mod.GET(req)

    expect(prisma.setting.findMany).toHaveBeenCalled()
  })

  it("handles database errors gracefully", async () => {
    vi.mocked(prisma.setting.findMany).mockRejectedValue(new Error("DB connection failed"))

    const mod = await import("@/app/api/settings/route")
    const req = new NextRequest("http://localhost/api/settings")
    const res = await mod.GET(req)

    expect(mockErrorResponse).toHaveBeenCalledWith("Failed to fetch settings", 500)
  })
})

describe("PUT /api/settings", () => {
  it("validates settings array correctly", async () => {
    const validPayload = {
      settings: [
        { key: "company_name", value: "LIMAS KONTRAKTOR" },
        { key: "contact_email", value: "test@example.com" },
      ],
    }

    const result = settingsBulkSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it("rejects empty settings array", async () => {
    const invalidPayload = { settings: [] }
    const result = settingsBulkSchema.safeParse(invalidPayload)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toBe("Minimal harus ada 1 setting")
    }
  })

  it("rejects settings with empty key", async () => {
    expect(settingSchema.safeParse({ key: "", value: "test" }).success).toBe(false)
  })

  it("rejects settings with invalid key characters", async () => {
    expect(settingSchema.safeParse({ key: "key with spaces", value: "test" }).success).toBe(false)
    expect(settingSchema.safeParse({ key: "key@invalid!", value: "test" }).success).toBe(false)
  })

  it("rejects settings with empty value", async () => {
    expect(settingSchema.safeParse({ key: "valid_key", value: "" }).success).toBe(false)
  })

  it("accepts valid alphanumeric keys with underscores and dashes", async () => {
    expect(settingSchema.safeParse({ key: "company_name", value: "test" }).success).toBe(true)
    expect(settingSchema.safeParse({ key: "contact-email", value: "test" }).success).toBe(true)
    expect(settingSchema.safeParse({ key: "social_media.1", value: "test" }).success).toBe(true)
  })
})

describe("Security: API endpoints", () => {
  it("does not accept malicious payload shapes for settings", async () => {
    expect(settingsBulkSchema.safeParse({ data: { malicious: true } }).success).toBe(false)
    expect(settingsBulkSchema.safeParse({ settings: "string" }).success).toBe(false)
    expect(settingsBulkSchema.safeParse({ settings: null }).success).toBe(false)
    expect(z.object({ key: z.string(), value: z.string() }).safeParse({ injected: true }).success).toBe(false)
  })
})
