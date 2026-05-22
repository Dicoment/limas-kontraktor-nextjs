import { getBlogPostById, getCategories } from "@/actions/blog-post.actions"
import Link from "next/link"

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getBlogPostById(id)
  if (!post) return <div className="text-slate-500">Post not found.</div>

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-xl font-bold text-slate-800">Edit Blog Post</h1>
      <pre className="bg-slate-100 p-4 rounded text-sm">{(post as any).content}</pre>
      <Link href="/admin/blog-posts" className="text-blue-600 text-sm">← Back to list</Link>
    </div>
  )
}