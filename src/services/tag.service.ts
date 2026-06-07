import { prisma } from "@/lib/prisma"
import { TagInput, TagUpdateInput } from "@/backend-schemas/tag.schema"

export async function getTags(params: {
  page: number
  limit: number
  search?: string
  includeUsageCount?: boolean
}) {
  const { page, limit, search, includeUsageCount = true } = params
  const skip = (page - 1) * limit
  
  const where: any = {}
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
    ]
  }
  
  const [data, total] = await Promise.all([
    prisma.tag.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
    }),
    prisma.tag.count({ where })
  ])
  
  let items = data
  if (includeUsageCount) {
    const counts = await Promise.all(
      data.map(tag => prisma.blogPostTag.count({ where: { tagId: tag.id } }))
    )
    items = data.map((tag, i) => ({
      ...tag,
      usageCount: counts[i]
    })) as any
  }
  
  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export async function getTagBySlug(slug: string) {
  return await prisma.tag.findUnique({
    where: { slug },
    include: {
      blogPostTags: {
        select: { blogPostId: true }
      }
    }
  })
}

export async function createTag(data: TagInput) {
  const existing = await prisma.tag.findUnique({
    where: { slug: data.slug }
  })
  
  if (existing) {
    throw new Error("Tag with this slug already exists")
  }
  
  return await prisma.tag.create({
    data: {
      name: data.name,
      slug: data.slug,
    }
  })
}

export async function updateTag(id: string, data: TagUpdateInput) {
  const existing = await prisma.tag.findUnique({ where: { id } })
  if (!existing) throw new Error("Tag not found")
  
  if (data.slug && data.slug !== existing.slug) {
    const slugExists = await prisma.tag.findUnique({
      where: { slug: data.slug }
    })
    if (slugExists) throw new Error("Slug already exists")
  }
  
  return await prisma.tag.update({
    where: { id },
    data
  })
}

export async function deleteTag(id: string) {
  const existing = await prisma.tag.findUnique({ 
    where: { id },
    include: {
      blogPostTags: {
        select: { blogPostId: true }
      }
    }
  })
  
  if (!existing) throw new Error("Tag not found")
  
  if (existing.blogPostTags.length > 0) {
    throw new Error("Cannot delete tag that is being used by blog posts")
  }
  
  return await prisma.tag.delete({ where: { id } })
}

export async function getPopularTags(limit: number = 10) {
  const tags = await prisma.tag.findMany({
    include: {
      blogPostTags: {
        select: { blogPostId: true }
      }
    }
  })
  
  return tags
    .map(tag => ({
      ...tag,
      usageCount: tag.blogPostTags?.length || 0
    }))
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, limit)
}