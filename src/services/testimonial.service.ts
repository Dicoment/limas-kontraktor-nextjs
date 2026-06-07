import { prisma } from "@/lib/prisma"
import { TestimonialInput, TestimonialUpdateInput } from "@/backend-schemas/testimonial.schema"
import { formatTestimonial, formatTestimonials, validateRating } from "@/helpers/testimonial-helpers"

export async function getTestimonials(params: {
  page: number
  limit: number
  published?: boolean
  platform?: string
  projectId?: string
  minRating?: number
  maxRating?: number
  search?: string
}) {
  const { page, limit, published, platform, projectId, minRating, maxRating, search } = params
  const skip = (page - 1) * limit
  
  const where: any = {}
  
  if (published !== undefined) where.published = published
  if (platform) where.platform = platform
  if (projectId) where.projectId = projectId
  
  if (minRating !== undefined || maxRating !== undefined) {
    where.rating = {}
    if (minRating !== undefined) where.rating.gte = minRating
    if (maxRating !== undefined) where.rating.lte = maxRating
  }
  
  if (search) {
    where.OR = [
      { clientName: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ]
  }
  
  const [data, total] = await Promise.all([
    prisma.testimonial.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true
          }
        }
      }
    }),
    prisma.testimonial.count({ where })
  ])
  
  const ratings = data.filter(t => t.rating !== null).map(t => t.rating as number)
  const averageRating = ratings.length > 0 
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
    : null
  
  return {
    items: formatTestimonials(data),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    summary: {
      averageRating: averageRating ? Number(averageRating.toFixed(1)) : null,
      totalWithRating: ratings.length,
      totalPublished: data.filter(t => t.published).length,
    }
  }
}

export async function getTestimonialById(id: string) {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true
        }
      }
    }
  })
  
  return testimonial ? formatTestimonial(testimonial) : null
}

export async function getTestimonialsByProject(projectId: string, onlyPublished: boolean = true) {
  const testimonials = await prisma.testimonial.findMany({
    where: {
      projectId,
      ...(onlyPublished && { published: true })
    },
include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true
          }
        }
      },
    orderBy: { createdAt: "desc" }
  })
  
  const ratings = testimonials.filter(t => t.rating !== null).map(t => t.rating as number)
  const averageRating = ratings.length > 0 
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
    : null
  
  return {
    testimonials: formatTestimonials(testimonials),
    summary: {
      total: testimonials.length,
      averageRating: averageRating ? Number(averageRating.toFixed(1)) : null,
      totalWithRating: ratings.length,
    }
  }
}

export async function createTestimonial(data: TestimonialInput) {
  // Validate rating
  let validatedRating: number | null = null
  if (data.rating !== null && data.rating !== undefined) {
    validatedRating = validateRating(data.rating)
  }
  
  // Check if project exists if projectId is provided
  if (data.projectId) {
    const project = await prisma.project.findUnique({
      where: { id: data.projectId }
    })
    if (!project) throw new Error("Project not found")
  }
  
  const testimonial = await prisma.testimonial.create({
    data: {
      clientName: data.clientName,
      content: data.content,
      rating: validatedRating,
      platform: data.platform || "MANUAL",
      sourceUrl: data.sourceUrl || null,
      avatar: data.avatar || null,
      published: data.published ?? false,
      projectId: data.projectId || null,
    },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true
        }
      }
    }
  })
  
  return formatTestimonial(testimonial)
}

export async function updateTestimonial(id: string, data: TestimonialUpdateInput) {
  const existing = await prisma.testimonial.findUnique({ where: { id } })
  if (!existing) throw new Error("Testimonial not found")
  
  // Validate rating if provided
  let validatedRating = existing.rating
  if (data.rating !== undefined) {
    validatedRating = validateRating(data.rating)
  }
  
  // Check if project exists if projectId is provided and changed
  if (data.projectId && data.projectId !== existing.projectId) {
    const project = await prisma.project.findUnique({
      where: { id: data.projectId }
    })
    if (!project) throw new Error("Project not found")
  }
  
  const { rating, ...restData } = data
  
  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: {
      ...restData,
      ...(rating !== undefined && { rating: validatedRating }),
    },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true
        }
      }
    }
  })
  
  return formatTestimonial(testimonial)
}

export async function deleteTestimonial(id: string) {
  const existing = await prisma.testimonial.findUnique({ where: { id } })
  if (!existing) throw new Error("Testimonial not found")
  
  return await prisma.testimonial.delete({ where: { id } })
}

export async function getPublishedTestimonials(limit: number = 10) {
  const testimonials = await prisma.testimonial.findMany({
    where: { published: true },
include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true
          }
        }
      },
    orderBy: { createdAt: "desc" },
    take: limit
  })
  
  return formatTestimonials(testimonials)
}