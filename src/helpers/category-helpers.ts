import { Prisma,Category } from "@/generated/client"

export type CategoryWithRelations = Category & {
  blogPostCategories?: Array<{ blogPostId: string }>
  categoryProjects?: Array<{ projectId: string }>
}

export type FormattedCategory = Omit<CategoryWithRelations, 'blogPostCategories' | 'categoryProjects'> & {
  blogPostCount?: number
  projectCount?: number
}

export function formatCategory(category: CategoryWithRelations): FormattedCategory {
  return {
    ...category,
    blogPostCount: category.blogPostCategories?.length || 0,
    projectCount: category.categoryProjects?.length || 0,
  }
}

export function formatCategories(categories: CategoryWithRelations[]): FormattedCategory[] {
  return categories.map(formatCategory)
}

export function buildCategoryWhereInput(searchParams: URLSearchParams): Prisma.CategoryWhereInput {
  const search = searchParams.get("search")
  const type = searchParams.get("type")
  
  const where: Prisma.CategoryWhereInput = {}
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { slug: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
    ]
  }
  
  if (type && (type === "blog" || type === "project")) {
    where.type = type
  }
  
  return where
}

export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)))
  const skip = (page - 1) * limit
  
  return { page, limit, skip }
}