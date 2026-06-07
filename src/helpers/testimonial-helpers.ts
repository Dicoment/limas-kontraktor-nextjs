import { Prisma, Testimonial } from "@/generated/client"

export type ProjectSummary = {
  id: string
  title: string
  slug: string
  coverImage: string | null
}

export type TestimonialWithRelations = Testimonial & {
  project?: ProjectSummary | null
}

export type FormattedTestimonial = TestimonialWithRelations

export function formatTestimonial(testimonial: TestimonialWithRelations): FormattedTestimonial {
  return testimonial
}

export function formatTestimonials(testimonials: TestimonialWithRelations[]): FormattedTestimonial[] {
  return testimonials.map(formatTestimonial)
}

export function buildTestimonialWhereInput(searchParams: URLSearchParams): Prisma.TestimonialWhereInput {
  const search = searchParams.get("search")
  const published = searchParams.get("published")
  const platform = searchParams.get("platform")
  const projectId = searchParams.get("projectId")
  const minRating = searchParams.get("minRating")
  const maxRating = searchParams.get("maxRating")
  
  const where: Prisma.TestimonialWhereInput = {}
  
  if (published !== null) {
    where.published = published === "true"
  }
  
  if (platform && ["MANUAL", "SOCIAL_MEDIA"].includes(platform)) {
    where.platform = platform as any
  }
  
  if (projectId) {
    where.projectId = projectId
  }
  
  if (minRating || maxRating) {
    where.rating = {}
    if (minRating) {
      where.rating.gte = parseInt(minRating)
    }
    if (maxRating) {
      where.rating.lte = parseInt(maxRating)
    }
  }
  
  if (search) {
    where.OR = [
      { clientName: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
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

export function getSortParams(searchParams: URLSearchParams): Prisma.TestimonialOrderByWithRelationInput {
  const sortBy = searchParams.get("sortBy") || "createdAt"
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc"
  
  const validSortFields = ["clientName", "rating", "createdAt", "updatedAt", "published"]
  const field = validSortFields.includes(sortBy) ? sortBy : "createdAt"
  
  return { [field]: sortOrder }
}

export function validateRating(rating: number | null | undefined): number | null {
  if (rating === null || rating === undefined) return null
  if (rating >= 1 && rating <= 5) return rating
  throw new Error("Rating must be between 1 and 5")
}