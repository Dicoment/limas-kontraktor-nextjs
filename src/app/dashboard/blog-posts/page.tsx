import { getBlogPosts, getCategories } from "@/actions/blog-post.actions"
import { SearchForm, Pagination } from "../../../components/admin/BlogTableComponents"
import Link from "next/link"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }> | { page?: string; search?: string }
}

export default async function AdminBlogPostsPage(props: PageProps) {
  const resolvedParams = await props.searchParams
  const querySearch = resolvedParams.search || undefined
  const queryPage = resolvedParams.page ? parseInt(resolvedParams.page) : 1

  const data = await getBlogPosts({
    page: queryPage,
    limit: 10,
    search: querySearch,
  }) as Awaited<ReturnType<typeof getBlogPosts>>

  const blogHeaders = [
    { key: "title", label: "Title", className: "w-[55%]" },
    { key: "status", label: "Status", className: "w-[15%]" },
    { key: "date", label: "Date", className: "w-[15%]" },
    { key: "actions", label: "Actions", align: "right" as const, className: "w-[15%]" },
  ]

  return (
    <div className="space-y-5 font-jakarta">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Blog Posts</h1>
          <p className="text-xs text-slate-400 mt-0.5">Kelola artikel, berita, dan edukasi publik Limas Kontraktor.</p>
        </div>
        <Link href="/dashboard/blog-posts/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">+ New Post</Link>
      </div>

      <div className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-md">
        <SearchForm placeholder="Cari artikel blog..." />
      </div>

      <Table
        headers={blogHeaders}
        rows={(data as any).posts || []}
        emptyMessage="No blog posts found."
        renderRow={(post: any) => (
          <tr key={post.id} className="hover:bg-slate-50/40 transition-colors">
            <td className="px-5 py-3.5">
              <p className="font-semibold text-slate-900 text-sm tracking-tight hover:text-blue-600 transition-colors">
                {post.title}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{post.slug}</p>
            </td>
            <td className="px-5 py-3.5">
              <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-bold rounded-sm border ${
                post.published
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-zinc-100 text-zinc-600 border-zinc-200"
              }`}>
                {post.published ? "Published" : "Draft"}
              </span>
            </td>
            <td className="px-5 py-3.5 text-xs text-slate-500 font-medium">
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })
                : "—"
              }
            </td>
            <td className="px-5 py-3.5 text-right whitespace-nowrap">
              <Link href={`/dashboard/blog-posts/${post.id}/edit`} className="px-3 py-1 text-xs bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors">Edit</Link>
            </td>
          </tr>
        )}
      />

      <Pagination currentPage={(data as any).page} totalPages={(data as any).totalPages} />
    </div>
  )
}

function Table({ headers, rows, emptyMessage, renderRow }: any) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-slate-50 border-b">
          <tr>
            {headers.map((h: any) => (
              <th key={h.key} className={`px-5 py-3 text-xs font-semibold text-slate-600 ${h.align === "right" ? "text-right" : "text-left"}`}>
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? rows.map((row: any) => renderRow(row)) : (
            <tr><td colSpan={headers.length} className="px-4 py-8 text-center text-slate-400">{emptyMessage}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}