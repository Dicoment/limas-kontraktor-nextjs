import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

const mockAuth = vi.fn()
const mockSuccessResponse = vi.fn()
const mockErrorResponse = vi.fn()
const mockUnauthorizedResponse = vi.fn()

const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
}

vi.mock("@/lib/prisma", () => ({
  get prisma() { return mockPrisma },
}))

vi.mock("bcryptjs", () => {
  const hash = vi.fn().mockResolvedValue("hashed_new_password")
  const compare = vi.fn()
  return { default: { compare, hash } }
})

vi.mock("@/lib/api-response", () => ({
  successResponse: (...args: any[]) => mockSuccessResponse(...args),
  errorResponse: (...args: any[]) => mockErrorResponse(...args),
  unauthorizedResponse: () => mockUnauthorizedResponse(),
}))

vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}))

const bcrypt = (await import("bcryptjs")).default

const mockProfileUser = {
  id: "user-123",
  email: "admin@limaskontraktor.com",
  password: "hashed_password",
  name: "Admin Lama",
  role: "admin",
  createdAt: new Date(),
}

beforeEach(() => {
  vi.clearAllMocks()
  mockAuth.mockReset()
  mockSuccessResponse.mockImplementation((data: any) => ({ success: true, ...data }))
  mockErrorResponse.mockImplementation((msg: string, status = 400) => ({ error: msg, status }))
  mockUnauthorizedResponse.mockImplementation(() => ({ error: "Unauthorized", status: 401 }))
})

describe("GET /api/profile", () => {
  it("returns 401 if not authenticated", async () => {
    mockAuth.mockResolvedValue(null)

    const mod = await import("@/app/api/profile/route")
    const req = new NextRequest("http://localhost/api/profile")
    const res = await mod.GET(req)

    expect(mockUnauthorizedResponse).toHaveBeenCalled()
  })

  it("returns user data when authenticated", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } })
    mockPrisma.user.findUnique.mockResolvedValue(mockProfileUser)

    expect(mockUnauthorizedResponse).toHaveBeenCalled()
  })

  it("returns user data when authenticated", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } })
    mockPrisma.user.findUnique.mockResolvedValue(mockProfileUser)

    const mod = await import("@/app/api/profile/route")
    const req = new NextRequest("http://localhost/api/profile")
    await mod.GET()

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-123" },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    })
  })

  it("returns 404 if user is not found in database", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-999" } })
    mockPrisma.user.findUnique.mockResolvedValue(null)

    const mod = await import("@/app/api/profile/route")
    const req = new NextRequest("http://localhost/api/profile")
    await mod.GET()

    expect(mockErrorResponse).toHaveBeenCalledWith("User not found", 404)
  })
})

describe("PUT /api/profile", () => {
  it("returns 401 if not authenticated", async () => {
    mockAuth.mockResolvedValue(null)

    const mod = await import("@/app/api/profile/route")
    const req = new NextRequest("http://localhost/api/profile", {
      method: "PUT",
      body: JSON.stringify({ name: "New Name" }),
    })
    await mod.PUT(req)

    expect(mockUnauthorizedResponse).toHaveBeenCalled()
  })

  it("updates name when authenticated with valid payload", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } })
    mockPrisma.user.update.mockResolvedValue({ ...mockProfileUser, name: "New Name" })

    const mod = await import("@/app/api/profile/route")
    const req = new NextRequest("http://localhost/api/profile", {
      method: "PUT",
      body: JSON.stringify({ name: "New Name" }),
    })
    await mod.PUT(req)

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-123" },
      data: { name: "New Name" },
      select: { id: true, email: true, name: true, role: true },
    })
  })

  it("does not pass email in update data (email is read-only)", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } })
    mockPrisma.user.update.mockResolvedValue(mockProfileUser)

    const mod = await import("@/app/api/profile/route")
    const req = new NextRequest("http://localhost/api/profile", {
      method: "PUT",
      body: JSON.stringify({ name: "Test", email: "new@example.com" }),
    })
    await mod.PUT(req)

    expect(mockPrisma.user.update).toHaveBeenCalled()
    const updateCall = mockPrisma.user.update.mock.calls[0][0]
    expect(updateCall.data.email).toBeUndefined()
  })
})

describe("PUT /api/profile/password", () => {
  it("returns 401 if not authenticated", async () => {
    mockAuth.mockResolvedValue(null)

    const mod = await import("@/app/api/profile/password/route")
    const req = new NextRequest("http://localhost/api/profile/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword: "old", newPassword: "new" }),
    })
    await mod.PUT(req)

    expect(mockUnauthorizedResponse).toHaveBeenCalled()
  })

  it("returns error if currentPassword is missing", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } })

    const mod = await import("@/app/api/profile/password/route")
    const req = new NextRequest("http://localhost/api/profile/password", {
      method: "PUT",
      body: JSON.stringify({ newPassword: "new123" }),
    })
    await mod.PUT(req)

    expect(mockErrorResponse).toHaveBeenCalled()
    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled()
  })

  it("returns error if newPassword is missing (empty object)", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } })

    const mod = await import("@/app/api/profile/password/route")
    const req = new NextRequest("http://localhost/api/profile/password", {
      method: "PUT",
      body: JSON.stringify({}),
    })
    await mod.PUT(req)

    expect(mockErrorResponse).toHaveBeenCalled()
    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled()
  })

  it("rejects password shorter than 6 characters", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } })

    const mod = await import("@/app/api/profile/password/route")
    const req = new NextRequest("http://localhost/api/profile/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword: "old", newPassword: "123" }),
    })
    await mod.PUT(req)

    expect(mockErrorResponse).toHaveBeenCalledWith("Password baru minimal 6 karakter")
    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled()
  })

  it("returns 404 if user is not found in database", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-999" } })
    mockPrisma.user.findUnique.mockResolvedValue(null)

    const mod = await import("@/app/api/profile/password/route")
    const req = new NextRequest("http://localhost/api/profile/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword: "old", newPassword: "newpass123" }),
    })
    await mod.PUT(req)

    expect(mockErrorResponse).toHaveBeenCalledWith("User tidak ditemukan", 404)
  })

  it("returns error when current password does not match", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } })
    mockPrisma.user.findUnique.mockResolvedValue(mockProfileUser)
    bcrypt.compare.mockResolvedValue(false)

    const mod = await import("@/app/api/profile/password/route")
    const req = new NextRequest("http://localhost/api/profile/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword: "wrong", newPassword: "newpass123" }),
    })
    await mod.PUT(req)

    expect(mockErrorResponse).toHaveBeenCalledWith("Password saat ini salah", 400)
    expect(mockPrisma.user.update).not.toHaveBeenCalled()
    expect(bcrypt.hash).not.toHaveBeenCalled()
  })

  it("successfully changes password with correct credentials", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } })
    mockPrisma.user.findUnique.mockResolvedValue(mockProfileUser)
    bcrypt.compare.mockResolvedValue(true)
    bcrypt.hash.mockResolvedValue("hashed_new_pass")
    mockPrisma.user.update.mockResolvedValue({ ...mockProfileUser, password: "hashed_new_pass" })

    const mod = await import("@/app/api/profile/password/route")
    const req = new NextRequest("http://localhost/api/profile/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword: "correct", newPassword: "newpass123" }),
    })
    await mod.PUT(req)

    expect(bcrypt.compare).toHaveBeenCalledWith("correct", "hashed_password")
    expect(bcrypt.hash).toHaveBeenCalledWith("newpass123", 10)
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-123" },
      data: { password: "hashed_new_pass" },
    })
  })

  it("catches and returns 500 on unexpected error", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } })
    mockPrisma.user.findUnique.mockRejectedValue(new Error("DB down"))
    mockSuccessResponse.mockReset().mockImplementation((d: any) => d)

    const mod = await import("@/app/api/profile/password/route")
    const req = new NextRequest("http://localhost/api/profile/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword: "old", newPassword: "newpass123" }),
    })
    await mod.PUT(req)

    expect(mockErrorResponse).toHaveBeenCalledWith("Failed to change password", 500)
  })
})
