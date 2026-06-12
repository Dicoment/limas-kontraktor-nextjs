import { prisma } from "@/lib/prisma"
import NewBlogPostClient from "./NewBlogPostClient"

export const dynamic = "force-dynamic"

export default async function AdminNewBlogPostPage() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ where: { type: "blog" }, orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ])

  return (
    <NewBlogPostClient
      categories={categories.map((c: { id: string; name: string; slug: string; type: string }) => ({ id: c.id, name: c.name, slug: c.slug, type: c.type }))}
      tags={tags.map((t: { id: string; name: string; slug: string }) => ({ id: t.id, name: t.name, slug: t.slug }))}
    />
  )
}
