import { Prisma, Tag } from "@prisma/client"

export type TagWithRelations = Tag & {
  blogPostTags?: Array<{ blogPostId: string }>
}

export type FormattedTag = TagWithRelations & {
  usageCount: number
}

export function formatTag(tag: TagWithRelations): FormattedTag {
  return {
    ...tag,
    usageCount: tag.blogPostTags?.length || 0,
  }
}

export function formatTags(tags: TagWithRelations[]): FormattedTag[] {
  return tags.map(formatTag)
}

export function buildTagWhereInput(searchParams: URLSearchParams): Prisma.TagWhereInput {
  const search = searchParams.get("search")
  
  const where: Prisma.TagWhereInput = {}
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { slug: { contains: search, mode: Prisma.QueryMode.insensitive } },
    ]
  }
  
  return where
}

export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)))
  const skip = (page - 1) * limit
  
  return { page, limit, skip }
}

export function getSortParams(searchParams: URLSearchParams): Prisma.TagOrderByWithRelationInput {
  const sortBy = searchParams.get("sortBy") || "name"
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc"
  
  const validSortFields = ["name", "slug", "createdAt", "updatedAt"]
  const field = validSortFields.includes(sortBy) ? sortBy : "name"
  
  return { [field]: sortOrder }
}