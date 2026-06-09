import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

const mockSuccessResponse = vi.fn()
const mockErrorResponse = vi.fn()

vi.mock("@/lib/prisma", () => {
  const actual = vi.importActual("@/lib/prisma")
  return {
    ...actual,
    prisma: {
      ...(actual as any).prisma,
      page: {
        findMany: vi.fn(),
        count: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  }
})

vi.mock("@/lib/api-response", () => ({
  successResponse: (...args: any[]) => mockSuccessResponse(...args),
  errorResponse: (...args: any[]) => mockErrorResponse(...args),
  notFoundResponse: (entity: string) => mockErrorResponse(`${entity} not found`, 404),
}))

const { prisma } = await import("@/lib/prisma")
const { successResponse, errorResponse } = await import("@/lib/api-response")

const mockPage = {
  id: "page-123",
  title: "About Us",
  slug: "about",
  content: "About content",
  seoTitle: "About Us - LIMAS",
  seoDescription: "About LIMAS Kontraktor",
  published: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

beforeEach(() => {
  vi.clearAllMocks()
  mockSuccessResponse.mockImplementation((data: any, status = 200) => ({ success: true, data, status }))
  mockErrorResponse.mockImplementation((msg: string, status = 400) => ({ error: msg, status }))
})

describe("GET /api/pages", () => {
  it("returns paginated pages", async () => {
    const fakePages = [mockPage]
    const fakeTotal = 1

    vi.mocked(prisma.page.findMany).mockResolvedValue(fakePages as any)
    vi.mocked(prisma.page.count).mockResolvedValue(fakeTotal)

    const mod = await import("@/app/api/pages/route")
    const req = new NextRequest("http://localhost/api/pages")
    await mod.GET(req)

    expect(prisma.page.findMany).toHaveBeenCalled()
    expect(prisma.page.count).toHaveBeenCalled()
  })
})

describe("POST /api/pages", () => {
  it("creates page with valid data", async () => {
    const validPayload = {
      title: "New Page",
      slug: "new-page",
      content: "Page content",
    }

    vi.mocked(prisma.page.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.page.create).mockResolvedValue(mockPage as any)

    const mod = await import("@/app/api/pages/route")
    const req = new NextRequest("http://localhost/api/pages", {
      method: "POST",
      body: JSON.stringify(validPayload),
    })
    await mod.POST(req)

    expect(prisma.page.create).toHaveBeenCalled()
  })

  it("returns 409 when slug already exists", async () => {
    const validPayload = {
      title: "About",
      slug: "about",
      content: "Page content here",
    }
    vi.mocked(prisma.page.findUnique).mockResolvedValue(mockPage)

    const mod = await import("@/app/api/pages/route")
    const req = new NextRequest("http://localhost/api/pages", {
      method: "POST",
      body: JSON.stringify(validPayload),
    })
    await mod.POST(req)

    expect(prisma.page.create).not.toHaveBeenCalled()
    expect(mockErrorResponse).toHaveBeenCalledWith("Page with this slug already exists", 409)
  })
})

describe("GET /api/pages/[id]", () => {
  it("returns page by id", async () => {
    vi.mocked(prisma.page.findUnique).mockResolvedValue(mockPage as any)

    const mod = await import("@/app/api/pages/[id]/route")
    const req = new NextRequest("http://localhost/api/pages/page-123")
    await mod.GET(req, { params: Promise.resolve({ id: "page-123" }) })

    expect(prisma.page.findUnique).toHaveBeenCalledWith({ where: { id: "page-123" } })
  })

  it("returns not found for nonexistent page", async () => {
    vi.mocked(prisma.page.findUnique).mockResolvedValue(null)

    const mod = await import("@/app/api/pages/[id]/route")
    const req = new NextRequest("http://localhost/api/pages/nonexistent")
    await mod.GET(req, { params: Promise.resolve({ id: "nonexistent" }) })

    expect(mockErrorResponse).toHaveBeenCalledWith(expect.any(String), 404)
  })
})

describe("PUT /api/pages/[id]", () => {
  it("updates page successfully", async () => {
    vi.mocked(prisma.page.findUnique).mockResolvedValue(mockPage as any)
    vi.mocked(prisma.page.update).mockResolvedValue({ ...mockPage, title: "Updated" } as any)

    const mod = await import("@/app/api/pages/[id]/route")
    const req = new NextRequest("http://localhost/api/pages/page-123", {
      method: "PUT",
      body: JSON.stringify({ title: "Updated Page" }),
    })
    await mod.PUT(req, { params: Promise.resolve({ id: "page-123" }) })

    expect(prisma.page.update).toHaveBeenCalled()
  })
})

describe("PATCH /api/pages/[id]", () => {
  it("partially updates page", async () => {
    vi.mocked(prisma.page.findUnique).mockResolvedValue(mockPage as any)
    vi.mocked(prisma.page.update).mockResolvedValue({ ...mockPage, title: "Patched" } as any)

    const mod = await import("@/app/api/pages/[id]/route")
    const req = new NextRequest("http://localhost/api/pages/page-123", {
      method: "PATCH",
      body: JSON.stringify({ title: "Patched" }),
    })
    await mod.PATCH(req, { params: Promise.resolve({ id: "page-123" }) })

    expect(prisma.page.update).toHaveBeenCalled()
  })
})

describe("DELETE /api/pages/[id]", () => {
  it("deletes non-protected page", async () => {
    const nonProtectedPage = { ...mockPage, slug: "custom-page" }
    vi.mocked(prisma.page.findUnique).mockResolvedValue(nonProtectedPage as any)
    vi.mocked(prisma.page.delete).mockResolvedValue(nonProtectedPage as any)

    const mod = await import("@/app/api/pages/[id]/route")
    const req = new NextRequest("http://localhost/api/pages/page-123", {
      method: "DELETE",
    })
    await mod.DELETE(req, { params: Promise.resolve({ id: "page-123" }) })

    expect(prisma.page.delete).toHaveBeenCalledWith({ where: { id: "page-123" } })
  })

  it("prevents deletion of protected pages", async () => {
    const protectedPage = { ...mockPage, slug: "home" }
    vi.mocked(prisma.page.findUnique).mockResolvedValue(protectedPage as any)

    const mod = await import("@/app/api/pages/[id]/route")
    const req = new NextRequest("http://localhost/api/pages/page-123", {
      method: "DELETE",
    })
    await mod.DELETE(req, { params: Promise.resolve({ id: "page-123" }) })

    expect(prisma.page.delete).not.toHaveBeenCalled()
    expect(mockErrorResponse).toHaveBeenCalledWith("Cannot delete protected page", 403)
  })
})

describe("GET /api/pages/slug/[slug]", () => {
  it("returns published page by slug", async () => {
    vi.mocked(prisma.page.findUnique).mockResolvedValue(mockPage as any)

    const mod = await import("@/app/api/pages/slug/[slug]/route")
    const req = new NextRequest("http://localhost/api/pages/slug/about")
    await mod.GET(req, { params: Promise.resolve({ slug: "about" }) })

    expect(prisma.page.findUnique).toHaveBeenCalled()
  })

  it("returns 404 for unpublished page", async () => {
    const unpublishedPage = { ...mockPage, published: false }
    vi.mocked(prisma.page.findUnique).mockResolvedValue(unpublishedPage as any)

    const mod = await import("@/app/api/pages/slug/[slug]/route")
    const req = new NextRequest("http://localhost/api/pages/slug/about")
    await mod.GET(req, { params: Promise.resolve({ slug: "about" }) })

    expect(mockErrorResponse).toHaveBeenCalledWith(expect.any(String), 404)
  })
})
