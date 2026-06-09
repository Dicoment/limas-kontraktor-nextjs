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
      tag: {
        findMany: vi.fn(),
        count: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      blogPostTag: {
        findMany: vi.fn(),
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

const mockTag = {
  id: "tag-123",
  name: "Technology",
  slug: "technology",
  createdAt: new Date(),
  updatedAt: new Date(),
  blogPostTags: [],
}

beforeEach(() => {
  vi.clearAllMocks()
  mockSuccessResponse.mockImplementation((data: any, status = 200) => ({ success: true, data, status }))
  mockErrorResponse.mockImplementation((msg: string, status = 400) => ({ error: msg, status }))
})

describe("GET /api/tags", () => {
  it("returns paginated tags", async () => {
    const fakeTags = [mockTag]
    const fakeTotal = 1

    vi.mocked(prisma.tag.findMany).mockResolvedValue(fakeTags as any)
    vi.mocked(prisma.tag.count).mockResolvedValue(fakeTotal)

    const mod = await import("@/app/api/tags/route")
    const req = new NextRequest("http://localhost/api/tags")
    await mod.GET(req)

    expect(prisma.tag.findMany).toHaveBeenCalled()
    expect(prisma.tag.count).toHaveBeenCalled()
  })
})

describe("POST /api/tags", () => {
  it("creates tag with valid data", async () => {
    const validPayload = { name: "Technology", slug: "technology" }

    vi.mocked(prisma.tag.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.tag.create).mockResolvedValue(mockTag as any)

    const mod = await import("@/app/api/tags/route")
    const req = new NextRequest("http://localhost/api/tags", {
      method: "POST",
      body: JSON.stringify(validPayload),
    })
    await mod.POST(req)

    expect(prisma.tag.create).toHaveBeenCalled()
  })

  it("returns 409 when slug already exists", async () => {
    vi.mocked(prisma.tag.findUnique).mockResolvedValue(mockTag)

    const mod = await import("@/app/api/tags/route")
    const req = new NextRequest("http://localhost/api/tags", {
      method: "POST",
      body: JSON.stringify({ name: "Technology", slug: "technology" }),
    })
    await mod.POST(req)

    expect(prisma.tag.create).not.toHaveBeenCalled()
    expect(mockErrorResponse).toHaveBeenCalledWith("Tag with this slug already exists", 409)
  })
})

describe("GET /api/tags/[id]", () => {
  it("returns tag by id", async () => {
    vi.mocked(prisma.tag.findUnique).mockResolvedValue(mockTag as any)

    const mod = await import("@/app/api/tags/[id]/route")
    const req = new NextRequest("http://localhost/api/tags/tag-123")
    await mod.GET(req, { params: Promise.resolve({ id: "tag-123" }) })

    expect(prisma.tag.findUnique).toHaveBeenCalled()
  })

  it("returns not found for nonexistent tag", async () => {
    vi.mocked(prisma.tag.findUnique).mockResolvedValue(null)

    const mod = await import("@/app/api/tags/[id]/route")
    const req = new NextRequest("http://localhost/api/tags/nonexistent")
    await mod.GET(req, { params: Promise.resolve({ id: "nonexistent" }) })

    expect(mockErrorResponse).toHaveBeenCalledWith(expect.any(String), 404)
  })
})

describe("PUT /api/tags/[id]", () => {
  it("updates tag successfully", async () => {
    vi.mocked(prisma.tag.findUnique).mockResolvedValue(mockTag as any)
    vi.mocked(prisma.tag.update).mockResolvedValue({ ...mockTag, name: "New Name" } as any)

    const mod = await import("@/app/api/tags/[id]/route")
    const req = new NextRequest("http://localhost/api/tags/tag-123", {
      method: "PUT",
      body: JSON.stringify({ name: "New Name" }),
    })
    await mod.PUT(req, { params: Promise.resolve({ id: "tag-123" }) })

    expect(prisma.tag.update).toHaveBeenCalled()
  })
})

describe("PATCH /api/tags/[id]", () => {
  it("partially updates tag", async () => {
    vi.mocked(prisma.tag.findUnique).mockResolvedValue(mockTag as any)
    vi.mocked(prisma.tag.update).mockResolvedValue({ ...mockTag, name: "Updated" } as any)

    const mod = await import("@/app/api/tags/[id]/route")
    const req = new NextRequest("http://localhost/api/tags/tag-123", {
      method: "PATCH",
      body: JSON.stringify({ name: "Updated" }),
    })
    await mod.PATCH(req, { params: Promise.resolve({ id: "tag-123" }) })

    expect(prisma.tag.update).toHaveBeenCalled()
  })
})

describe("DELETE /api/tags/[id]", () => {
  it("deletes unused tag", async () => {
    const unusedTag = { ...mockTag, blogPostTags: [] }
    vi.mocked(prisma.tag.findUnique).mockResolvedValue(unusedTag as any)
    vi.mocked(prisma.tag.delete).mockResolvedValue(unusedTag as any)

    const mod = await import("@/app/api/tags/[id]/route")
    const req = new NextRequest("http://localhost/api/tags/tag-123", {
      method: "DELETE",
    })
    await mod.DELETE(req, { params: Promise.resolve({ id: "tag-123" }) })

    expect(prisma.tag.delete).toHaveBeenCalledWith({ where: { id: "tag-123" } })
  })

  it("prevents deletion of tag used by blog posts", async () => {
    const usedTag = { ...mockTag, blogPostTags: [{ blogPostId: "post-1" }] }
    vi.mocked(prisma.tag.findUnique).mockResolvedValue(usedTag as any)

    const mod = await import("@/app/api/tags/[id]/route")
    const req = new NextRequest("http://localhost/api/tags/tag-123", {
      method: "DELETE",
    })
    await mod.DELETE(req, { params: Promise.resolve({ id: "tag-123" }) })

    expect(prisma.tag.delete).not.toHaveBeenCalled()
    expect(mockErrorResponse).toHaveBeenCalledWith(expect.stringContaining("blog posts"), 409)
  })
})

describe("GET /api/tags/slug/[slug]", () => {
  it("returns tag by slug with published posts", async () => {
    const tagWithPosts = {
      ...mockTag,
      blogPostTags: [
        {
          postEntry: {
            id: "post-1",
            title: "Post 1",
            slug: "post-1",
            published: true,
            publishedAt: new Date(),
          },
        },
      ],
    }
    vi.mocked(prisma.tag.findUnique).mockResolvedValue(tagWithPosts as any)

    const mod = await import("@/app/api/tags/slug/[slug]/route")
    const req = new NextRequest("http://localhost/api/tags/slug/technology")
    await mod.GET(req, { params: Promise.resolve({ slug: "technology" }) })

    expect(prisma.tag.findUnique).toHaveBeenCalled()
  })

  it("returns not found for nonexistent slug", async () => {
    vi.mocked(prisma.tag.findUnique).mockResolvedValue(null)

    const mod = await import("@/app/api/tags/slug/[slug]/route")
    const req = new NextRequest("http://localhost/api/tags/slug/nonexistent")
    await mod.GET(req, { params: Promise.resolve({ slug: "nonexistent" }) })

    expect(mockErrorResponse).toHaveBeenCalledWith(expect.any(String), 404)
  })
})
