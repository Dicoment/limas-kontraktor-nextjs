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
      $transaction: vi.fn(),
      project: {
        findMany: vi.fn(),
        count: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      categoryProject: {
        deleteMany: vi.fn(),
        createMany: vi.fn(),
      },
      projectTeam: {
        deleteMany: vi.fn(),
        createMany: vi.fn(),
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

const mockProject = {
  id: "proj-123",
  title: "New Project",
  slug: "new-project",
  description: "A new construction project",
  location: "Jakarta",
  client: "PT ABC",
  limasRole: "EPC",
  coverImage: "https://example.com/cover.jpg",
  gallery: [],
  status: "DRAFT",
  seoTitle: "SEO Title",
  seoDescription: "SEO Description",
  createdAt: new Date(),
  updatedAt: new Date(),
  categoryProjects: [],
  projectTeams: [],
  testimonials: [],
}

beforeEach(() => {
  vi.clearAllMocks()
  mockSuccessResponse.mockImplementation((data: any, status = 200) => ({ success: true, data, status }))
  mockErrorResponse.mockImplementation((msg: string, status = 400) => ({ error: msg, status }))
})

describe("GET /api/projects", () => {
  it("returns paginated projects with filters", async () => {
    const fakeProjects = [mockProject]
    const fakeTotal = 1

    vi.mocked(prisma.project.findMany).mockResolvedValue(fakeProjects as any)
    vi.mocked(prisma.project.count).mockResolvedValue(fakeTotal)

    const mod = await import("@/app/api/projects/route")
    const req = new NextRequest("http://localhost/api/projects?page=1&limit=10")
    await mod.GET(req)

    expect(prisma.project.findMany).toHaveBeenCalled()
    expect(prisma.project.count).toHaveBeenCalled()
  })

  it("filters projects by status", async () => {
    vi.mocked(prisma.project.findMany).mockResolvedValue([])
    vi.mocked(prisma.project.count).mockResolvedValue(0)

    const mod = await import("@/app/api/projects/route")
    const req = new NextRequest("http://localhost/api/projects?status=ONGOING")
    await mod.GET(req)

    expect(prisma.project.findMany).toHaveBeenCalled()
  })

  it("handles database errors", async () => {
    vi.mocked(prisma.project.findMany).mockRejectedValue(new Error("DB error"))

    const mod = await import("@/app/api/projects/route")
    const req = new NextRequest("http://localhost/api/projects")
    await mod.GET(req)

    expect(mockErrorResponse).toHaveBeenCalledWith("Failed to fetch projects", 500)
  })
})

describe("POST /api/projects", () => {
  it("creates project with valid data", async () => {
    const validPayload = {
      title: "New Project",
      slug: "new-project",
      description: "Description",
      status: "ONGOING",
    }

    vi.mocked(prisma.project.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.project.create).mockResolvedValue(mockProject as any)

    const mod = await import("@/app/api/projects/route")
    const req = new NextRequest("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify(validPayload),
    })
    await mod.POST(req)

    expect(prisma.project.create).toHaveBeenCalled()
  })

  it("returns 409 when slug already exists", async () => {
    const validPayload = {
      title: "Project",
      slug: "existing-slug",
      description: "A valid description for testing",
    }
    vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject)

    const mod = await import("@/app/api/projects/route")
    const req = new NextRequest("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify(validPayload),
    })
    await mod.POST(req)

    expect(prisma.project.create).not.toHaveBeenCalled()
    expect(mockErrorResponse).toHaveBeenCalledWith("Project with this slug already exists", 409)
  })
})

describe("GET /api/projects/[id]", () => {
  it("returns project by id", async () => {
    vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject as any)

    const mod = await import("@/app/api/projects/[id]/route")
    const req = new NextRequest("http://localhost/api/projects/proj-123")
    await mod.GET(req, { params: Promise.resolve({ id: "proj-123" }) })

    expect(prisma.project.findUnique).toHaveBeenCalled()
  })

  it("returns not found for nonexistent project", async () => {
    vi.mocked(prisma.project.findUnique).mockResolvedValue(null)

    const mod = await import("@/app/api/projects/[id]/route")
    const req = new NextRequest("http://localhost/api/projects/nonexistent")
    await mod.GET(req, { params: Promise.resolve({ id: "nonexistent" }) })

    expect(mockErrorResponse).toHaveBeenCalledWith(expect.any(String), 404)
  })
})

describe("PUT /api/projects/[id]", () => {
  it("updates project successfully", async () => {
    vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject as any)
    vi.mocked(prisma.$transaction).mockImplementation(async (fn: any) => fn({
      categoryProject: { deleteMany: vi.fn(), createMany: vi.fn() },
      projectTeam: { deleteMany: vi.fn(), createMany: vi.fn() },
      project: { update: vi.fn().mockResolvedValue({ ...mockProject, title: "Updated" }) },
    }))

    const mod = await import("@/app/api/projects/[id]/route")
    const req = new NextRequest("http://localhost/api/projects/proj-123", {
      method: "PUT",
      body: JSON.stringify({ title: "Updated Project" }),
    })
    await mod.PUT(req, { params: Promise.resolve({ id: "proj-123" }) })

    expect(prisma.$transaction).toHaveBeenCalled()
  })
})

describe("PATCH /api/projects/[id]", () => {
  it("partially updates project", async () => {
    vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject as any)
    vi.mocked(prisma.$transaction).mockImplementation(async (fn: any) => fn({
      categoryProject: { deleteMany: vi.fn(), createMany: vi.fn() },
      projectTeam: { deleteMany: vi.fn(), createMany: vi.fn() },
      project: { update: vi.fn().mockResolvedValue({ ...mockProject, title: "Updated" }) },
    }))

    const mod = await import("@/app/api/projects/[id]/route")
    const req = new NextRequest("http://localhost/api/projects/proj-123", {
      method: "PATCH",
      body: JSON.stringify({ status: "ONGOING" }),
    })
    await mod.PATCH(req, { params: Promise.resolve({ id: "proj-123" }) })

    expect(prisma.$transaction).toHaveBeenCalled()
  })
})

describe("DELETE /api/projects/[id]", () => {
  it("deletes project without testimonials", async () => {
    vi.mocked(prisma.project.findUnique).mockResolvedValue({ ...mockProject, testimonials: [] } as any)
    vi.mocked(prisma.project.delete).mockResolvedValue(mockProject as any)

    const mod = await import("@/app/api/projects/[id]/route")
    const req = new NextRequest("http://localhost/api/projects/proj-123", {
      method: "DELETE",
    })
    await mod.DELETE(req, { params: Promise.resolve({ id: "proj-123" }) })

    expect(prisma.project.delete).toHaveBeenCalledWith({ where: { id: "proj-123" } })
  })

  it("prevents deletion when project has testimonials", async () => {
    vi.mocked(prisma.project.findUnique).mockResolvedValue({
      ...mockProject,
      testimonials: [{ id: "test-1" }],
    } as any)

    const mod = await import("@/app/api/projects/[id]/route")
    const req = new NextRequest("http://localhost/api/projects/proj-123", {
      method: "DELETE",
    })
    await mod.DELETE(req, { params: Promise.resolve({ id: "proj-123" }) })

    expect(prisma.project.delete).not.toHaveBeenCalled()
    expect(mockErrorResponse).toHaveBeenCalledWith(expect.stringContaining("testimonials"), 409)
  })
})

describe("GET /api/projects/slug/[slug]", () => {
  it("returns project by slug", async () => {
    vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject as any)

    const mod = await import("@/app/api/projects/slug/[slug]/route")
    const req = new NextRequest("http://localhost/api/projects/slug/new-project")
    await mod.GET(req, { params: Promise.resolve({ slug: "new-project" }) })

    expect(prisma.project.findUnique).toHaveBeenCalled()
  })

  it("returns not found for nonexistent slug", async () => {
    vi.mocked(prisma.project.findUnique).mockResolvedValue(null)

    const mod = await import("@/app/api/projects/slug/[slug]/route")
    const req = new NextRequest("http://localhost/api/projects/slug/nonexistent")
    await mod.GET(req, { params: Promise.resolve({ slug: "nonexistent" }) })

    expect(mockErrorResponse).toHaveBeenCalledWith(expect.any(String), 404)
  })
})
