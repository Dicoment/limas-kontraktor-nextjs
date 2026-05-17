import { getBlogPosts } from "@/actions/blog-post.actions"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminBlogPostsPage({ searchParams }: { searchParams: { page?: string; search?: string } }) {
  const data = await getBlogPosts({
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: 10,
    search: searchParams.search,
  }) as Awaited<ReturnType<typeof getBlogPosts>>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Blog Posts</h1>
        <Link href="/admin/blog-posts/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">+ New Post</Link>
      </div>

      <form method="GET" className="flex gap-2">
        <input name="search" defaultValue={searchParams.search || ""} placeholder="Cari artikel..." className="px-3 py-2 border border-slate-300 rounded-md text-sm w-64" />
        <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm">Search</button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Published</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Date</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data as any).posts?.map((post: any) => (
              <tr key={post.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">{post.title}</p>
                  <p className="text-xs text-slate-400">{post.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${post.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("id-ID") : "—"}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link href={`/admin/blog-posts/${post.id}/edit`} className="text-blue-600 hover:text-blue-800 text-sm">Edit</Link>
                </td>
              </tr>
            ))}
            {!(data as any).posts?.length && <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">No blog posts found.</td></tr>}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={(data as any).page} totalPages={(data as any).totalPages} />
    </div>
  )
}

function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className="flex items-center gap-2 justify-center">
      {pages.map((p) => (
        <a key={p} href={`?page=${p}`} className={`px-3 py-1 rounded text-sm ${p === currentPage ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}>{p}</a>
      ))}
    </div>
  )
}