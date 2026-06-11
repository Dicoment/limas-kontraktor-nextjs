import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function PublicBlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { blogPostCategories: { include: { catEntry: true } }, blogPostTags: { include: { tagEntry: true } } },
  })
  if (!post) {
    return <div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl">404</h1></div>
  }
  return (
    <div className="min-h-screen max-w-4xl mx-auto py-12 px-8">
      <p className="text-slate-400 text-sm mb-4">Post: <strong>{post.title}</strong></p>
      <p className="text-slate-600">Categories: {(post.blogPostCategories || []).map((c: any) => c.catEntry.name).join(", ") || "—"}</p>
      <p className="text-slate-600">Tags: {(post.blogPostTags || []).map((t: any) => t.tagEntry.name).join(", ") || "—"}</p>
      <p className="text-slate-500 mt-4">Content: {(post.content || "").slice(0, 200)}...</p>
    </div>
  )
}