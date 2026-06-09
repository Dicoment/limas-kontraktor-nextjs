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
      category: {
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

const mockCategory = {
  id: "cat-123",
  name: "Technology",
  slug: "technology",
  type: "blog",
  description: "Tech related posts",
  createdAt: new Date(),
  updatedAt: new Date(),
  blogPostCategories: [],
  categoryProjects: [],
}

beforeEach(() => {
  vi.clearAllMocks()
  mockSuccessResponse.mockImplementation((data: any, status = 200) => ({ success: true, data, status }))
  mockErrorResponse.mockImplementation((msg: string, status = 400) => ({ error: msg, status }))
})

describe("GET /api/categories", () => {
  it("returns paginated categories", async () => {
    const fakeCategories = [mockCategory]
    const fakeTotal = 1

    vi.mocked(prisma.category.findMany).mockResolvedValue(fakeCategories as any)
    vi.mocked(prisma.category.count).mockResolvedValue(fakeTotal)

    const mod = await import("@/app/api/categories/route")
    const req = new NextRequest("http://localhost/api/categories")
    await mod.GET(req)

    expect(prisma.category.findMany).toHaveBeenCalled()
    expect(prisma.category.count).toHaveBeenCalled()
  })
})

describe("POST /api/categories", () => {
  it("creates category with valid data", async () => {
    const validPayload = {
      name: "Technology",
      slug: "technology",
      type: "blog",
    }

    vi.mocked(prisma.category.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.category.create).mockResolvedValue(mockCategory as any)

    const mod = await import("@/app/api/categories/route")
    const req = new NextRequest("http://localhost/api/categories", {
      method: "POST",
      body: JSON.stringify(validPayload),
    })
    await mod.POST(req)

    expect(prisma.category.create).toHaveBeenCalled()
  })

  it("returns 409 when slug already exists", async () => {
    vi.mocked(prisma.category.findUnique).mockResolvedValue(mockCategory)

    const mod = await import("@/app/api/categories/route")
    const req = new NextRequest("http://localhost/api/categories", {
      method: "POST",
      body: JSON.stringify({ name: "Technology", slug: "technology", type: "blog" }),
    })
    await mod.POST(req)

    expect(prisma.category.create).not.toHaveBeenCalled()
    expect(mockErrorResponse).toHaveBeenCalledWith("Category with this slug already exists", 409)
  })
})

describe("GET /api/categories/[id]", () => {
  it("returns category by id", async () => {
    vi.mocked(prisma.category.findUnique).mockResolvedValue(mockCategory as any)

    const mod = await import("@/app/api/categories/[id]/route")
    const req = new NextRequest("http://localhost/api/categories/cat-123")
    await mod.GET(req, { params: Promise.resolve({ id: "cat-123" }) })

    expect(prisma.category.findUnique).toHaveBeenCalled()
  })

  it("returns not found for nonexistent category", async () => {
    vi.mocked(prisma.category.findUnique).mockResolvedValue(null)

    const mod = await import("@/app/api/categories/[id]/route")
    const req = new NextRequest("http://localhost/api/categories/nonexistent")
    await mod.GET(req, { params: Promise.resolve({ id: "nonexistent" }) })

    expect(mockErrorResponse).toHaveBeenCalledWith("Category not found", 404)
  })
})

describe("PUT /api/categories/[id]", () => {
  it("updates category successfully", async () => {
    vi.mocked(prisma.category.findUnique).mockResolvedValue(mockCategory as any)
    vi.mocked(prisma.category.update).mockResolvedValue({ ...mockCategory, name: "Updated" } as any)

    const mod = await import("@/app/api/categories/[id]/route")
    const req = new NextRequest("http://localhost/api/categories/cat-123", {
      method: "PUT",
      body: JSON.stringify({ name: "Updated" }),
    })
    await mod.PUT(req, { params: Promise.resolve({ id: "cat-123" }) })

    expect(prisma.category.update).toHaveBeenCalled()
  })
})

describe("PATCH /api/categories/[id]", () => {
  it("partially updates category", async () => {
    vi.mocked(prisma.category.findUnique).mockResolvedValue(mockCategory as any)
    vi.mocked(prisma.category.update).mockResolvedValue({ ...mockCategory, name: "Patched" } as any)

    const mod = await import("@/app/api/categories/[id]/route")
    const req = new NextRequest("http://localhost/api/categories/cat-123", {
      method: "PATCH",
      body: JSON.stringify({ name: "Patched" }),
    })
    await mod.PATCH(req, { params: Promise.resolve({ id: "cat-123" }) })

    expect(prisma.category.update).toHaveBeenCalled()
  })
})

describe("DELETE /api/categories/[id]", () => {
  it("deletes unused category", async () => {
    const unusedCategory = { ...mockCategory, blogPostCategories: [], categoryProjects: [] }
    vi.mocked(prisma.category.findUnique).mockResolvedValue(unusedCategory as any)
    vi.mocked(prisma.category.delete).mockResolvedValue(unusedCategory as any)

    const mod = await import("@/app/api/categories/[id]/route")
    const req = new NextRequest("http://localhost/api/categories/cat-123", {
      method: "DELETE",
    })
    await mod.DELETE(req, { params: Promise.resolve({ id: "cat-123" }) })

    expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: "cat-123" } })
  })

  it("prevents deletion of category used by posts or projects", async () => {
    const usedCategory = {
      ...mockCategory,
      blogPostCategories: [{ blogPostId: "post-1" }],
      categoryProjects: [],
    }
    vi.mocked(prisma.category.findUnique).mockResolvedValue(usedCategory as any)

    const mod = await import("@/app/api/categories/[id]/route")
    const req = new NextRequest("http://localhost/api/categories/cat-123", {
      method: "DELETE",
    })
    await mod.DELETE(req, { params: Promise.resolve({ id: "cat-123" }) })

    expect(prisma.category.delete).not.toHaveBeenCalled()
    expect(mockErrorResponse).toHaveBeenCalledWith(expect.stringContaining("blog posts or projects"), 409)
  })
})
