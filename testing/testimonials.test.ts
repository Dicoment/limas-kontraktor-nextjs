import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

const mockSuccessResponse = vi.fn()
mockSuccessResponse.mockImplementation((data: any) => ({ success: true, ...data }))

const mockErrorResponse = vi.fn()
mockErrorResponse.mockImplementation((msg: string, status = 400) => ({ error: msg, status }))

const mockPrisma = {
  testimonial: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  project: {
    findUnique: vi.fn(),
  },
}

vi.mock("@/lib/prisma", () => ({
  get prisma() { return mockPrisma },
}))

vi.mock("@/lib/api-response", () => ({
  successResponse: (...args: any[]) => mockSuccessResponse(...args),
  errorResponse: (...args: any[]) => mockErrorResponse(...args),
  notFoundResponse: (entity: string) => mockErrorResponse(`${entity} not found`, 404),
}))

const mockTestimonial = {
  id: "test-123",
  clientName: "John Doe",
  content: "Great service!",
  rating: 5,
  platform: "MANUAL",
  sourceUrl: "https://example.com",
  avatar: "https://example.com/avatar.jpg",
  published: true,
  projectId: "proj-1",
  createdAt: new Date(),
  updatedAt: new Date(),
  project: {
    id: "proj-1",
    title: "Project Alpha",
    slug: "project-alpha",
    coverImage: "https://example.com/cover.jpg",
  },
}

const mockProject = {
  id: "proj-1",
  title: "Project Alpha",
  slug: "project-alpha",
  coverImage: "https://example.com/cover.jpg",
}

beforeEach(() => {
  vi.clearAllMocks()
  mockSuccessResponse.mockReset().mockImplementation((data: any) => ({ success: true, ...data }))
  mockErrorResponse.mockReset().mockImplementation((msg: string, status = 400) => ({ error: msg, status }))
})

describe("GET /api/testimonials", () => {
  it("returns paginated testimonials with summary", async () => {
    const fakeTestimonials = [mockTestimonial]
    mockPrisma.testimonial.findMany.mockResolvedValue(fakeTestimonials)
    mockPrisma.testimonial.count.mockResolvedValue(1)

    const mod = await import("@/app/api/testimonials/route")
    const req = new NextRequest("http://localhost/api/testimonials?page=1&limit=10")
    await mod.GET(req)

    expect(mockPrisma.testimonial.findMany).toHaveBeenCalled()
    expect(mockPrisma.testimonial.count).toHaveBeenCalled()
  })

  it("returns empty array when no testimonials", async () => {
    mockPrisma.testimonial.findMany.mockResolvedValue([])
    mockPrisma.testimonial.count.mockResolvedValue(0)

    const mod = await import("@/app/api/testimonials/route")
    const req = new NextRequest("http://localhost/api/testimonials")
    await mod.GET(req)

    expect(mockPrisma.testimonial.findMany).toHaveBeenCalled()
  })

  it("calculates average rating correctly", async () => {
    const ratedTestimonials = [
      { ...mockTestimonial, rating: 5 },
      { ...mockTestimonial, id: "test-2", rating: 3 },
    ]
    mockPrisma.testimonial.findMany.mockResolvedValue(ratedTestimonials)
    mockPrisma.testimonial.count.mockResolvedValue(2)

    const mod = await import("@/app/api/testimonials/route")
    const req = new NextRequest("http://localhost/api/testimonials")
    await mod.GET(req)

    expect(mockPrisma.testimonial.findMany).toHaveBeenCalled()
    expect(mockSuccessResponse).toHaveBeenCalled()
  })
})

describe("POST /api/testimonials", () => {
  it("creates testimonial with valid data", async () => {
    const validPayload = {
      clientName: "John Doe",
      content: "Great service!",
      rating: 5,
    }

    mockPrisma.project.findUnique.mockResolvedValue(null)
    mockPrisma.testimonial.create.mockResolvedValue(mockTestimonial)

    const mod = await import("@/app/api/testimonials/route")
    const req = new NextRequest("http://localhost/api/testimonials", {
      method: "POST",
      body: JSON.stringify(validPayload),
    })
    await mod.POST(req)

    expect(mockPrisma.testimonial.create).toHaveBeenCalled()
  })

  it("validates rating range", async () => {
    mockPrisma.project.findUnique.mockResolvedValue(null)

    const mod = await import("@/app/api/testimonials/route")
    const req = new NextRequest("http://localhost/api/testimonials", {
      method: "POST",
      body: JSON.stringify({ clientName: "John", content: "Test", rating: 6 }),
    })
    await mod.POST(req)

    expect(mockErrorResponse).toHaveBeenCalled()
    expect(mockPrisma.testimonial.create).not.toHaveBeenCalled()
  })

  it("returns 404 when project does not exist", async () => {
    const validPayload = {
      clientName: "John",
      content: "Test content here",
      projectId: "cjk123456789",
    }
    mockPrisma.project.findUnique.mockResolvedValue(null)

    const mod = await import("@/app/api/testimonials/route")
    const req = new NextRequest("http://localhost/api/testimonials", {
      method: "POST",
      body: JSON.stringify(validPayload),
    })
    await mod.POST(req)

    expect(mockErrorResponse).toHaveBeenCalledWith("Project not found", 404)
    expect(mockPrisma.testimonial.create).not.toHaveBeenCalled()
  })
})

describe("GET /api/testimonials/[id]", () => {
  it("returns testimonial by id", async () => {
    mockPrisma.testimonial.findUnique.mockResolvedValue(mockTestimonial)

    const mod = await import("@/app/api/testimonials/[id]/route")
    const req = new NextRequest("http://localhost/api/testimonials/test-123")
    await mod.GET(req, { params: Promise.resolve({ id: "test-123" }) })

    expect(mockPrisma.testimonial.findUnique).toHaveBeenCalled()
  })

  it("returns not found for nonexistent id", async () => {
    mockPrisma.testimonial.findUnique.mockResolvedValue(null)

    const mod = await import("@/app/api/testimonials/[id]/route")
    const req = new NextRequest("http://localhost/api/testimonials/nonexistent")
    await mod.GET(req, { params: Promise.resolve({ id: "nonexistent" }) })

    expect(mockErrorResponse).toHaveBeenCalledWith(expect.any(String), 404)
  })
})

describe("PUT /api/testimonials/[id]", () => {
  it("updates testimonial successfully", async () => {
    mockPrisma.testimonial.findUnique.mockResolvedValue(mockTestimonial)
    mockPrisma.testimonial.update.mockResolvedValue({ ...mockTestimonial, content: "Updated" })

    const mod = await import("@/app/api/testimonials/[id]/route")
    const req = new NextRequest("http://localhost/api/testimonials/test-123", {
      method: "PUT",
      body: JSON.stringify({ content: "Updated content for testimonial" }),
    })
    await mod.PUT(req, { params: Promise.resolve({ id: "test-123" }) })

    expect(mockPrisma.testimonial.update).toHaveBeenCalled()
  })

  it("validates rating on update", async () => {
    mockPrisma.testimonial.findUnique.mockResolvedValue(mockTestimonial)

    const mod = await import("@/app/api/testimonials/[id]/route")
    const req = new NextRequest("http://localhost/api/testimonials/test-123", {
      method: "PUT",
      body: JSON.stringify({ rating: 10 }),
    })
    await mod.PUT(req, { params: Promise.resolve({ id: "test-123" }) })

    expect(mockPrisma.testimonial.update).not.toHaveBeenCalled()
  })
})

describe("PATCH /api/testimonials/[id]", () => {
  it("partially updates testimonial", async () => {
    mockPrisma.testimonial.findUnique.mockResolvedValue(mockTestimonial)
    mockPrisma.testimonial.update.mockResolvedValue({ ...mockTestimonial, published: false })

    const mod = await import("@/app/api/testimonials/[id]/route")
    const req = new NextRequest("http://localhost/api/testimonials/test-123", {
      method: "PATCH",
      body: JSON.stringify({ published: false }),
    })
    await mod.PATCH(req, { params: Promise.resolve({ id: "test-123" }) })

    expect(mockPrisma.testimonial.update).toHaveBeenCalled()
  })
})

describe("DELETE /api/testimonials/[id]", () => {
  it("deletes testimonial", async () => {
    mockPrisma.testimonial.findUnique.mockResolvedValue(mockTestimonial)
    mockPrisma.testimonial.delete.mockResolvedValue(null)

    const mod = await import("@/app/api/testimonials/[id]/route")
    const req = new NextRequest("http://localhost/api/testimonials/test-123", {
      method: "DELETE",
    })
    await mod.DELETE(req, { params: Promise.resolve({ id: "test-123" }) })

    expect(mockPrisma.testimonial.delete).toHaveBeenCalledWith({ where: { id: "test-123" } })
  })

  it("returns not found for nonexistent id", async () => {
    mockPrisma.testimonial.findUnique.mockResolvedValue(null)

    const mod = await import("@/app/api/testimonials/[id]/route")
    const req = new NextRequest("http://localhost/api/testimonials/nonexistent", {
      method: "DELETE",
    })
    await mod.DELETE(req, { params: Promise.resolve({ id: "nonexistent" }) })

    expect(mockErrorResponse).toHaveBeenCalledWith(expect.any(String), 404)
  })
})

describe("GET /api/testimonials/project/[projectId]", () => {
  it("returns testimonials for a project", async () => {
    const projectTestimonials = {
      ...mockProject,
      testimonials: [mockTestimonial],
      summary: {
        total: 1,
        averageRating: 5,
        totalWithRating: 1,
      },
    }
    mockPrisma.project.findUnique.mockResolvedValue(mockProject)
    mockPrisma.testimonial.findMany.mockResolvedValue([mockTestimonial])
    mockPrisma.testimonial.count.mockResolvedValue(1)

    const mod = await import("@/app/api/testimonials/project/[projectId]/route")
    const req = new NextRequest("http://localhost/api/testimonials/project/proj-1")
    await mod.GET(req, { params: Promise.resolve({ projectId: "proj-1" }) })

    expect(mockPrisma.testimonial.findMany).toHaveBeenCalledWith({
      where: { projectId: "proj-1", published: true },
      include: expect.any(Object),
      orderBy: { createdAt: "desc" },
    })
  })

  it("returns only published when published=false is not set", async () => {
    mockPrisma.project.findUnique.mockResolvedValue(mockProject)
    mockPrisma.testimonial.findMany.mockResolvedValue([mockTestimonial])

    const mod = await import("@/app/api/testimonials/project/[projectId]/route")
    const req = new NextRequest("http://localhost/api/testimonials/project/proj-1")
    await mod.GET(req, { params: Promise.resolve({ projectId: "proj-1" }) })

    expect(mockPrisma.testimonial.findMany).toHaveBeenCalled()
  })

  it("returns all testimonials when published=false", async () => {
    const unpublishedTestimonial = { ...mockTestimonial, published: false }
    mockPrisma.project.findUnique.mockResolvedValue(mockProject)
    mockPrisma.testimonial.findMany.mockResolvedValue([unpublishedTestimonial])

    const mod = await import("@/app/api/testimonials/project/[projectId]/route")
    const req = new NextRequest("http://localhost/api/testimonials/project/proj-1?published=false")
    await mod.GET(req, { params: Promise.resolve({ projectId: "proj-1" }) })

    expect(mockPrisma.testimonial.findMany).toHaveBeenCalled()
  })

  it("returns 404 when project does not exist", async () => {
    mockPrisma.project.findUnique.mockResolvedValue(null)

    const mod = await import("@/app/api/testimonials/project/[projectId]/route")
    const req = new NextRequest("http://localhost/api/testimonials/project/nonexistent")
    await mod.GET(req, { params: Promise.resolve({ projectId: "nonexistent" }) })

    expect(mockErrorResponse).toHaveBeenCalledWith(expect.any(String), 404)
    expect(mockPrisma.testimonial.findMany).not.toHaveBeenCalled()
  })
})
