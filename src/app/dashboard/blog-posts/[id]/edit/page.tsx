import { getBlogPostById, getCategories } from "@/actions/blog-post.actions"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [post, allCategories, tags] = await Promise.all([
    getBlogPostById(id),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ])

  if (!post) return <div className="text-slate-500">Post not found.</div>
  
  const initialCategoryIds = (post as any).categories?.map((c: any) => c.id) || []
  const initialTagIds = (post as any).tags?.map((t: any) => t.id) || []

  return (
    <EditBlogPostClient
      post={post}
      categories={allCategories.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug, type: c.type }))}
      tags={tags}
      initialCategoryIds={initialCategoryIds}
      initialTagIds={initialTagIds}
    />
  )
}

import EditBlogPostClient from "./EditBlogPostClient"