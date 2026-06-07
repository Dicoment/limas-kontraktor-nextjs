import { prisma } from "@/lib/prisma"
import { PageInput, PageUpdateInput } from "@/backend-schemas/page.schema"

export async function getPages(params: {
  page: number
  limit: number
  published?: boolean
  search?: string
}) {
  const { page, limit, published, search } = params
  const skip = (page - 1) * limit
  
  const where: any = {}
  
  if (published !== undefined) {
    where.published = published
  }
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ]
  }
  
  const [data, total] = await Promise.all([
    prisma.page.findMany({
      where,
      skip,
      take: limit,
      orderBy: { title: 'asc' }
    }),
    prisma.page.count({ where })
  ])
  
  return {
    items: data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export async function getPageBySlug(slug: string, publishedOnly: boolean = true) {
  const where: any = { slug }
  if (publishedOnly) {
    where.published = true
  }
  
  return await prisma.page.findFirst({ where })
}

export async function createPage(data: PageInput) {
  const existing = await prisma.page.findUnique({
    where: { slug: data.slug }
  })
  
  if (existing) {
    throw new Error("Page with this slug already exists")
  }
  
  return await prisma.page.create({
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      published: data.published ?? false,
    }
  })
}

export async function updatePage(id: string, data: PageUpdateInput) {
  const existing = await prisma.page.findUnique({ where: { id } })
  if (!existing) throw new Error("Page not found")
  
  if (data.slug && data.slug !== existing.slug) {
    const slugExists = await prisma.page.findUnique({
      where: { slug: data.slug }
    })
    if (slugExists) throw new Error("Slug already exists")
  }
  
  return await prisma.page.update({
    where: { id },
    data
  })
}

export async function deletePage(id: string) {
  const existing = await prisma.page.findUnique({ where: { id } })
  if (!existing) throw new Error("Page not found")
  
  const protectedPages = ["home", "about", "contact"]
  if (protectedPages.includes(existing.slug)) {
    throw new Error("Cannot delete protected page")
  }
  
  return await prisma.page.delete({ where: { id } })
}