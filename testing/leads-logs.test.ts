import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

const mockSuccessResponse = vi.fn()
mockSuccessResponse.mockImplementation((data: any) => ({ success: true, ...data }))

const mockErrorResponse = vi.fn()
mockErrorResponse.mockImplementation((msg: string, status = 400) => ({ error: msg, status }))

const mockPrisma = {
  leadsLog: {
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

const mockLead = {
  id: "lead-123",
  name: "John Doe",
  phone: "0823-2072-1150",
  message: "Interested in project",
  projectId: "proj-1",
  pageUrl: "/projects/alpha",
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0",
  createdAt: new Date(),
  updatedAt: new Date(),
  project: {
    id: "proj-1",
    title: "Project Alpha",
    slug: "project-alpha",
  },
}

const mockProject = {
  id: "proj-1",
  title: "Project Alpha",
  slug: "project-alpha",
}

beforeEach(() => {
  vi.clearAllMocks()
  mockSuccessResponse.mockReset().mockImplementation((data: any) => ({ success: true, ...data }))
  mockErrorResponse.mockReset().mockImplementation((msg: string, status = 400) => ({ error: msg, status }))
})

describe("GET /api/leads-logs", () => {
  it("returns paginated leads with summary", async () => {
    const fakeLeads = [mockLead]
    mockPrisma.leadsLog.findMany.mockResolvedValue(fakeLeads)
    mockPrisma.leadsLog.count.mockResolvedValue(1)

    const mod = await import("@/app/api/leads-logs/route")
    const req = new NextRequest("http://localhost/api/leads-logs?page=1&limit=10")
    await mod.GET(req)

    expect(mockPrisma.leadsLog.findMany).toHaveBeenCalled()
    expect(mockPrisma.leadsLog.count).toHaveBeenCalled()
  })

  it("filters leads by project", async () => {
    mockPrisma.leadsLog.findMany.mockResolvedValue([mockLead])
    mockPrisma.leadsLog.count.mockResolvedValue(1)

    const mod = await import("@/app/api/leads-logs/route")
    const req = new NextRequest("http://localhost/api/leads-logs?projectId=proj-1")
    await mod.GET(req)

    expect(mockPrisma.leadsLog.findMany).toHaveBeenCalled()
  })

  it("returns leads with phone", async () => {
    const leadsWithPhone = [mockLead]
    mockPrisma.leadsLog.findMany.mockResolvedValue(leadsWithPhone)
    mockPrisma.leadsLog.count.mockResolvedValue(1)

    const mod = await import("@/app/api/leads-logs/route")
    const req = new NextRequest("http://localhost/api/leads-logs?hasPhone=true")
    await mod.GET(req)

    expect(mockPrisma.leadsLog.findMany).toHaveBeenCalled()
  })
})

describe("POST /api/leads-logs", () => {
  it("creates lead with valid data", async () => {
    const validPayload = {
      name: "John Doe",
      phone: "082320721150",
      message: "Interested in project",
      projectId: "cltestproject12345",
      pageUrl: "https://example.com/projects/alpha",
    }

    mockPrisma.project.findUnique.mockResolvedValue(mockProject)
    mockPrisma.leadsLog.create.mockResolvedValue(mockLead)

    const mod = await import("@/app/api/leads-logs/route")
    const req = new NextRequest("http://localhost/api/leads-logs", {
      method: "POST",
      body: JSON.stringify(validPayload),
      headers: new Headers({
        "x-forwarded-for": "192.168.1.1",
        "user-agent": "Mozilla/5.0",
      }),
    })
    await mod.POST(req)

    expect(mockPrisma.leadsLog.create).toHaveBeenCalled()
  })

  it("auto-captures IP and user agent", async () => {
    mockPrisma.project.findUnique.mockResolvedValue(null)
    mockPrisma.leadsLog.create.mockResolvedValue(mockLead)

    const mod = await import("@/app/api/leads-logs/route")
    const req = new NextRequest("http://localhost/api/leads-logs", {
      method: "POST",
      body: JSON.stringify({ name: "John" }),
      headers: new Headers({
        "x-forwarded-for": "10.0.0.1",
        "user-agent": "Test Agent",
      }),
    })
    await mod.POST(req)

    expect(mockPrisma.leadsLog.create).toHaveBeenCalled()
  })

  it("returns 404 when project does not exist", async () => {
    mockPrisma.project.findUnique.mockResolvedValue(null)

    const mod = await import("@/app/api/leads-logs/route")
    const req = new NextRequest("http://localhost/api/leads-logs", {
      method: "POST",
      body: JSON.stringify({ name: "John", projectId: "clnonexistentproject" }),
    })
    await mod.POST(req)

    expect(mockErrorResponse).toHaveBeenCalledWith("Project not found", 404)
    expect(mockPrisma.leadsLog.create).not.toHaveBeenCalled()
  })
})

describe("GET /api/leads-logs/[id]", () => {
  it("returns lead by id", async () => {
    mockPrisma.leadsLog.findUnique.mockResolvedValue(mockLead)

    const mod = await import("@/app/api/leads-logs/[id]/route")
    const req = new NextRequest("http://localhost/api/leads-logs/lead-123")
    await mod.GET(req, { params: Promise.resolve({ id: "lead-123" }) })

    expect(mockPrisma.leadsLog.findUnique).toHaveBeenCalled()
  })

  it("returns not found for nonexistent id", async () => {
    mockPrisma.leadsLog.findUnique.mockResolvedValue(null)

    const mod = await import("@/app/api/leads-logs/[id]/route")
    const req = new NextRequest("http://localhost/api/leads-logs/nonexistent")
    await mod.GET(req, { params: Promise.resolve({ id: "nonexistent" }) })

    expect(mockErrorResponse).toHaveBeenCalledWith("LeadsLog not found", 404)
  })
})

describe("PUT /api/leads-logs/[id]", () => {
  it("updates lead successfully", async () => {
    mockPrisma.leadsLog.findUnique.mockResolvedValue(mockLead)
    mockPrisma.leadsLog.update.mockResolvedValue({ ...mockLead, name: "Jane Doe" })

    const mod = await import("@/app/api/leads-logs/[id]/route")
    const req = new NextRequest("http://localhost/api/leads-logs/lead-123", {
      method: "PUT",
      body: JSON.stringify({ name: "Jane Doe" }),
    })
    await mod.PUT(req, { params: Promise.resolve({ id: "lead-123" }) })

    expect(mockPrisma.leadsLog.update).toHaveBeenCalled()
  })
})

describe("PATCH /api/leads-logs/[id]", () => {
  it("partially updates lead", async () => {
    mockPrisma.leadsLog.findUnique.mockResolvedValue(mockLead)
    mockPrisma.leadsLog.update.mockResolvedValue({ ...mockLead, name: "Patched" })

    const mod = await import("@/app/api/leads-logs/[id]/route")
    const req = new NextRequest("http://localhost/api/leads-logs/lead-123", {
      method: "PATCH",
      body: JSON.stringify({ name: "Patched" }),
    })
    await mod.PATCH(req, { params: Promise.resolve({ id: "lead-123" }) })

    expect(mockPrisma.leadsLog.update).toHaveBeenCalled()
  })
})

describe("DELETE /api/leads-logs/[id]", () => {
  it("deletes lead", async () => {
    mockPrisma.leadsLog.findUnique.mockResolvedValue(mockLead)
    mockPrisma.leadsLog.delete.mockResolvedValue(null)

    const mod = await import("@/app/api/leads-logs/[id]/route")
    const req = new NextRequest("http://localhost/api/leads-logs/lead-123", {
      method: "DELETE",
    })
    await mod.DELETE(req, { params: Promise.resolve({ id: "lead-123" }) })

    expect(mockPrisma.leadsLog.delete).toHaveBeenCalledWith({ where: { id: "lead-123" } })
  })

  it("returns not found for nonexistent id", async () => {
    mockPrisma.leadsLog.findUnique.mockResolvedValue(null)

    const mod = await import("@/app/api/leads-logs/[id]/route")
    const req = new NextRequest("http://localhost/api/leads-logs/nonexistent", {
      method: "DELETE",
    })
    await mod.DELETE(req, { params: Promise.resolve({ id: "nonexistent" }) })

    expect(mockErrorResponse).toHaveBeenCalledWith("LeadsLog not found", 404)
    expect(mockPrisma.leadsLog.delete).not.toHaveBeenCalled()
  })
})
