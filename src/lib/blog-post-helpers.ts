import { Prisma, BlogPost, Category, Tag } from "@/generated/client"

export type BlogPostWithRelations = BlogPost & {
  blogPostCategories: Array<{ catEntry: Category }>
  blogPostTags: Array<{ tagEntry: Tag }>
}

export type FormattedBlogPost = Omit<BlogPostWithRelations, 'blogPostCategories' | 'blogPostTags'> & {
  categories: Category[]
  tags: Tag[]
}

export function formatBlogPost(post: BlogPostWithRelations): FormattedBlogPost {
  return {
    ...post,
    categories: post.blogPostCategories.map(bpc => bpc.catEntry),
    tags: post.blogPostTags.map(bpt => bpt.tagEntry),
  }
}

export function formatBlogPosts(posts: BlogPostWithRelations[]): FormattedBlogPost[] {
  return posts.map(formatBlogPost)
}

export function validateAndParseDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null
  
  const parsedDate = new Date(dateString)
  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date format")
  }
  return parsedDate
}

export function buildBlogPostWhereInput(searchParams: URLSearchParams): Prisma.BlogPostWhereInput {
  const search = searchParams.get("search")
  const published = searchParams.get("published")
  const categoryId = searchParams.get("categoryId")
  const tagId = searchParams.get("tagId")
  
  const where: Prisma.BlogPostWhereInput = {}
  
  if (published !== null) {
    where.published = published === "true"
  }
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { excerpt: { contains: search, mode: Prisma.QueryMode.insensitive } },
    ]
  }
  
  if (categoryId) {
    where.blogPostCategories = {
      some: { categoryId: categoryId }
    }
  }
  
  if (tagId) {
    where.blogPostTags = {
      some: { tagId: tagId }
    }
  }
  
  return where
}

export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)))
  const skip = (page - 1) * limit
  
  return { page, limit, skip }
}