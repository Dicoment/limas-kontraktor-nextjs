import { Prisma, Page } from "@prisma/client"

export type PageWithRelations = Page

export type FormattedPage = PageWithRelations

export function formatPage(page: PageWithRelations): FormattedPage {
  return page
}

export function formatPages(pages: PageWithRelations[]): FormattedPage[] {
  return pages.map(formatPage)
}

export function buildPageWhereInput(searchParams: URLSearchParams): Prisma.PageWhereInput {
  const search = searchParams.get("search")
  const published = searchParams.get("published")
  
  const where: Prisma.PageWhereInput = {}
  
  if (published !== null) {
    where.published = published === "true"
  }
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { slug: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { seoTitle: { contains: search, mode: Prisma.QueryMode.insensitive } },
    ]
  }
  
  return where
}

export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)))
  const skip = (page - 1) * limit
  
  return { page, limit, skip }
}

export function getSortParams(searchParams: URLSearchParams): Prisma.PageOrderByWithRelationInput {
  const sortBy = searchParams.get("sortBy") || "title"
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc"
  
  const validSortFields = ["title", "slug", "published", "createdAt", "updatedAt"]
  const field = validSortFields.includes(sortBy) ? sortBy : "title"
  
  return { [field]: sortOrder }
}