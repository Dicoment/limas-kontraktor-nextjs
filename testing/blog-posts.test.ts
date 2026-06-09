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
      blogPost: {
        findMany: vi.fn(),
        count: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      blogPostCategory: {
        deleteMany: vi.fn(),
        createMany: vi.fn(),
      },
      blogPostTag: {
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

const mockBlogPost = {
  id: "post-123",
  title: "First Post",
  slug: "first-post",
  content: "Content here",
  excerpt: "Excerpt",
  coverImage: "https://example.com/cover.jpg",
  seoTitle: "SEO Title",
  seoDescription: "SEO Description",
  published: true,
  publishedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  blogPostCategories: [{ catEntry: { id: "cat-1", name: "Tech", slug: "tech" } }],
  blogPostTags: [{ tagEntry: { id: "tag-1", name: "Tag", slug: "tag" } }],
}

beforeEach(() => {
  vi.clearAllMocks()
  mockSuccessResponse.mockImplementation((data: any, status = 200) => ({ success: true, data, status }))
  mockErrorResponse.mockImplementation((msg: string, status = 400) => ({ error: msg, status }))
})

describe("GET /api/blog-posts", () => {
  it("returns paginated blog posts", async () => {
    const fakePosts = [mockBlogPost]
    const fakeTotal = 1

    vi.mocked(prisma.blogPost.findMany).mockResolvedValue(fakePosts as any)
    vi.mocked(prisma.blogPost.count).mockResolvedValue(fakeTotal)

    const mod = await import("@/app/api/blog-posts/route")
    const req = new NextRequest("http://localhost/api/blog-posts?page=1&limit=10")
    await mod.GET(req)

    expect(prisma.blogPost.findMany).toHaveBeenCalled()
    expect(prisma.blogPost.count).toHaveBeenCalled()
  })

  it("filters published posts", async () => {
    vi.mocked(prisma.blogPost.findMany).mockResolvedValue([mockBlogPost])
    vi.mocked(prisma.blogPost.count).mockResolvedValue(1)

    const mod = await import("@/app/api/blog-posts/route")
    const req = new NextRequest("http://localhost/api/blog-posts?published=true")
    await mod.GET(req)

    expect(prisma.blogPost.findMany).toHaveBeenCalled()
  })
})

describe("POST /api/blog-posts", () => {
  it("creates blog post with valid data", async () => {
    const validPayload = {
      title: "First Post",
      slug: "first-post",
      content: "Content here",
      excerpt: "Excerpt",
      coverImage: "https://example.com/cover.jpg",
      seoTitle: "SEO Title",
      seoDescription: "SEO Description",
      published: true,
      publishedAt: new Date().toISOString(),
    }

    vi.mocked(prisma.blogPost.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.blogPost.create).mockResolvedValue(mockBlogPost as any)

    const mod = await import("@/app/api/blog-posts/route")
    const req = new NextRequest("http://localhost/api/blog-posts", {
      method: "POST",
      body: JSON.stringify(validPayload),
    })
    await mod.POST(req)

    expect(prisma.blogPost.create).toHaveBeenCalled()
  })

  it("returns 409 when slug already exists", async () => {
    const validPayload = {
      title: "Post",
      slug: "first-post",
      content: "Content here",
    }
    vi.mocked(prisma.blogPost.findUnique).mockResolvedValue(mockBlogPost)

    const mod = await import("@/app/api/blog-posts/route")
    const req = new NextRequest("http://localhost/api/blog-posts", {
      method: "POST",
      body: JSON.stringify(validPayload),
    })
    await mod.POST(req)

    expect(prisma.blogPost.create).not.toHaveBeenCalled()
    expect(mockErrorResponse).toHaveBeenCalledWith("Blog post with this slug already exists", 409)
  })
})

describe("GET /api/blog-posts/[slug]", () => {
  it("returns blog post by slug", async () => {
    vi.mocked(prisma.blogPost.findUnique).mockResolvedValue(mockBlogPost as any)

    const mod = await import("@/app/api/blog-posts/[id]/route")
    const req = new NextRequest("http://localhost/api/blog-posts/first-post")
    await mod.GET(req, { params: Promise.resolve({ slug: "first-post" }) })

    expect(prisma.blogPost.findUnique).toHaveBeenCalled()
  })

  it("returns not found for nonexistent slug", async () => {
    vi.mocked(prisma.blogPost.findUnique).mockResolvedValue(null)

    const mod = await import("@/app/api/blog-posts/[id]/route")
    const req = new NextRequest("http://localhost/api/blog-posts/nonexistent")
    await mod.GET(req, { params: Promise.resolve({ slug: "nonexistent" }) })

    expect(mockErrorResponse).toHaveBeenCalledWith(expect.any(String), 404)
  })
})

describe("PUT /api/blog-posts/[slug]", () => {
  it("updates blog post successfully", async () => {
    vi.mocked(prisma.blogPost.findUnique).mockResolvedValue(mockBlogPost as any)
    vi.mocked(prisma.$transaction).mockImplementation(async (fn: any) => fn({
      blogPostCategory: { deleteMany: vi.fn(), createMany: vi.fn() },
      blogPostTag: { deleteMany: vi.fn(), createMany: vi.fn() },
      blogPost: { update: vi.fn().mockResolvedValue({ ...mockBlogPost, title: "Updated" }) },
    }))

    const mod = await import("@/app/api/blog-posts/[id]/route")
    const req = new NextRequest("http://localhost/api/blog-posts/first-post", {
      method: "PUT",
      body: JSON.stringify({ title: "Updated Post" }),
    })
    await mod.PUT(req, { params: Promise.resolve({ slug: "first-post" }) })

    expect(prisma.$transaction).toHaveBeenCalled()
  })
})

describe("PATCH /api/blog-posts/[slug]", () => {
  it("partially updates blog post", async () => {
    vi.mocked(prisma.blogPost.findUnique).mockResolvedValue(mockBlogPost as any)
    vi.mocked(prisma.$transaction).mockImplementation(async (fn: any) => fn({
      blogPostCategory: { deleteMany: vi.fn(), createMany: vi.fn() },
      blogPostTag: { deleteMany: vi.fn(), createMany: vi.fn() },
      blogPost: { update: vi.fn().mockResolvedValue({ ...mockBlogPost, published: false }) },
    }))

    const mod = await import("@/app/api/blog-posts/[id]/route")
    const req = new NextRequest("http://localhost/api/blog-posts/first-post", {
      method: "PATCH",
      body: JSON.stringify({ published: false }),
    })
    await mod.PATCH(req, { params: Promise.resolve({ slug: "first-post" }) })

    expect(prisma.$transaction).toHaveBeenCalled()
  })
})

describe("DELETE /api/blog-posts/[slug]", () => {
  it("deletes blog post", async () => {
    vi.mocked(prisma.blogPost.findUnique).mockResolvedValue(mockBlogPost as any)
    vi.mocked(prisma.blogPost.delete).mockResolvedValue(mockBlogPost as any)

    const mod = await import("@/app/api/blog-posts/[id]/route")
    const req = new NextRequest("http://localhost/api/blog-posts/first-post", {
      method: "DELETE",
    })
    await mod.DELETE(req, { params: Promise.resolve({ slug: "first-post" }) })

    expect(prisma.blogPost.delete).toHaveBeenCalledWith({ where: { slug: "first-post" } })
  })
})
