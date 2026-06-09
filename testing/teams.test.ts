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
      team: {
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

beforeEach(() => {
  vi.clearAllMocks()
  mockSuccessResponse.mockImplementation((data: any, status = 200) => ({ success: true, data, status }))
  mockErrorResponse.mockReset().mockImplementation((msg: string, status = 400) => ({ error: msg, status }))
})

describe("GET /api/teams", () => {
  it("returns paginated teams successfully", async () => {
    vi.mocked(prisma.team.findMany).mockResolvedValue([])
    vi.mocked(prisma.team.count).mockResolvedValue(0)

    const mod = await import("@/app/api/teams/route")
    const req = new NextRequest("http://localhost/api/teams")
    await mod.GET(req)

    expect(prisma.team.findMany).toHaveBeenCalled()
    expect(prisma.team.count).toHaveBeenCalled()
  })

  it("handles database errors gracefully", async () => {
    vi.mocked(prisma.team.findMany).mockRejectedValue(new Error("DB error"))

    const mod = await import("@/app/api/teams/route")
    const req = new NextRequest("http://localhost/api/teams")
    await mod.GET(req)

    expect(mockErrorResponse).toHaveBeenCalledWith("Failed to fetch teams", 500)
  })
})

describe("POST /api/teams", () => {
  it("creates team with valid data", async () => {
    vi.mocked(prisma.team.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.team.create).mockResolvedValue({ id: "team-1", name: "New" })

    const mod = await import("@/app/api/teams/route")
    const req = new NextRequest("http://localhost/api/teams", {
      method: "POST",
      body: JSON.stringify({ name: "New Member", position: "Engineer", email: "new@example.com", phone: "0823-2072-1150" }),
    })
    await mod.POST(req)

    expect(prisma.team.create).toHaveBeenCalled()
  })

  it("validates required fields", async () => {
    const mod = await import("@/app/api/teams/route")
    const req = new NextRequest("http://localhost/api/teams", {
      method: "POST",
      body: JSON.stringify({}),
    })
    await mod.POST(req)

    expect(mockErrorResponse).toHaveBeenCalled()
  })
})

describe("GET /api/teams/[id]", () => {
  it("returns team by id", async () => {
    vi.mocked(prisma.team.findUnique).mockResolvedValue({ id: "team-123", projectTeams: [] })

    const mod = await import("@/app/api/teams/[id]/route")
    const req = new NextRequest("http://localhost/api/teams/team-123")
    await mod.GET(req, { params: Promise.resolve({ id: "team-123" }) })

    expect(prisma.team.findUnique).toHaveBeenCalled()
  })

  it("returns not found when team does not exist", async () => {
    vi.mocked(prisma.team.findUnique).mockResolvedValue(null)

    const mod = await import("@/app/api/teams/[id]/route")
    const req = new NextRequest("http://localhost/api/teams/nonexistent")
    await mod.GET(req, { params: Promise.resolve({ id: "nonexistent" }) })

    expect(mockErrorResponse).toHaveBeenCalled()
  })
})

describe("PUT /api/teams/[id]", () => {
  it("updates team successfully", async () => {
    vi.mocked(prisma.team.findUnique).mockResolvedValue({ id: "team-123" })
    vi.mocked(prisma.team.update).mockResolvedValue({ id: "team-123", name: "Updated" })

    const mod = await import("@/app/api/teams/[id]/route")
    const req = new NextRequest("http://localhost/api/teams/team-123", {
      method: "PUT",
      body: JSON.stringify({ name: "Updated Name" }),
    })
    await mod.PUT(req, { params: Promise.resolve({ id: "team-123" }) })

    expect(prisma.team.update).toHaveBeenCalled()
  })

  it("returns not found when team does not exist", async () => {
    vi.mocked(prisma.team.findUnique).mockResolvedValue(null)

    const mod = await import("@/app/api/teams/[id]/route")
    const req = new NextRequest("http://localhost/api/teams/nonexistent", {
      method: "PUT",
      body: JSON.stringify({ name: "Updated" }),
    })
    await mod.PUT(req, { params: Promise.resolve({ id: "nonexistent" }) })

    expect(mockErrorResponse).toHaveBeenCalled()
  })
})

describe("PATCH /api/teams/[id]", () => {
  it("partially updates team", async () => {
    vi.mocked(prisma.team.findUnique).mockResolvedValue({ id: "team-123" })
    vi.mocked(prisma.team.update).mockResolvedValue({ id: "team-123", position: "Manager" })

    const mod = await import("@/app/api/teams/[id]/route")
    const req = new NextRequest("http://localhost/api/teams/team-123", {
      method: "PATCH",
      body: JSON.stringify({ position: "Manager" }),
    })
    await mod.PATCH(req, { params: Promise.resolve({ id: "team-123" }) })

    expect(prisma.team.update).toHaveBeenCalled()
  })
})

describe("DELETE /api/teams/[id]", () => {
  it("deletes team successfully", async () => {
    vi.mocked(prisma.team.findUnique).mockResolvedValue({ id: "team-123", projectTeams: [] })
    vi.mocked(prisma.team.delete).mockResolvedValue({ id: "team-123" })

    const mod = await import("@/app/api/teams/[id]/route")
    const req = new NextRequest("http://localhost/api/teams/team-123", {
      method: "DELETE",
    })
    await mod.DELETE(req, { params: Promise.resolve({ id: "team-123" }) })

    expect(prisma.team.delete).toHaveBeenCalledWith({ where: { id: "team-123" } })
  })

  it("prevents deletion when team is assigned to projects", async () => {
    vi.mocked(prisma.team.findUnique).mockResolvedValue({ id: "team-123", projectTeams: [{ projectId: "proj-1" }] })

    const mod = await import("@/app/api/teams/[id]/route")
    const req = new NextRequest("http://localhost/api/teams/team-123", {
      method: "DELETE",
    })
    await mod.DELETE(req, { params: Promise.resolve({ id: "team-123" }) })

    expect(prisma.team.delete).not.toHaveBeenCalled()
    expect(mockErrorResponse).toHaveBeenCalled()
  })
})

describe("PATCH /api/teams/reorder", () => {
  it("updates display order successfully", async () => {
    vi.mocked(prisma.team.update).mockResolvedValue({ id: "team-1" })

    const mod = await import("@/app/api/teams/reorder/route")
    const req = new NextRequest("http://localhost/api/teams/reorder", {
      method: "PATCH",
      body: JSON.stringify({ teams: [{ id: "team-1", displayOrder: 0 }, { id: "team-2", displayOrder: 1 }] }),
    })
    await mod.PATCH(req)

    expect(prisma.team.update).toHaveBeenCalledTimes(2)
  })
})
