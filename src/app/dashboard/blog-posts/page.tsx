import { getBlogPosts } from "@/actions/blog-post.actions"
import { SearchForm, Pagination } from "../../../components/admin/BlogTableComponents"
import { Table } from "@/components/ui/Table"
import Button from "@/components/ui/Button"

export const dynamic = "force-dynamic"
export const revalidate = 0

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
        <Button href="/dashboard/blog-posts/new" variant="primary">
          + New Post
        </Button>
      </div>

      {/* FILTER SEARCH AREA */}
      <div className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-md">
        <SearchForm placeholder="Cari artikel blog..." />
      </div>

      <Table 
        headers={blogHeaders}
        rows={(data as any).posts || []}
        emptyMessage="No blog posts found."
        renderRow={(post: any) => (
          <tr key={post.id} className="hover:bg-slate-50/40 transition-colors">
            {/* KOLOM 1: INFO JUDUL */}
            <td className="px-5 py-3.5">
              <p className="font-semibold text-slate-900 text-sm tracking-tight hover:text-blue-600 transition-colors">
                {post.title}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{post.slug}</p>
            </td>

            {/* KOLOM 2: STATUS BADGE (FLAT MINIMALIS) */}
            <td className="px-5 py-3.5">
              <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-bold rounded-sm border ${
                post.published 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                  : "bg-zinc-100 text-zinc-600 border-zinc-200"
              }`}>
                {post.published ? "Published" : "Draft"}
              </span>
            </td>

            {/* KOLOM 3: TANGGAL */}
            <td className="px-5 py-3.5 text-xs text-slate-500 font-medium">
              {post.publishedAt 
                ? new Date(post.publishedAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) 
                : "—"
              }
            </td>

            {/* KOLOM 4: AKSI EDIT EDIT */}
            <td className="px-5 py-3.5 text-right whitespace-nowrap">
              <Button href={`/dashboard/blog-posts/${post.id}/edit`} variant="outline" size="sm">
                Edit
              </Button>
            </td>
          </tr>
        )}
      />

      {/* PAGINATION */}
      <Pagination currentPage={(data as any).page} totalPages={(data as any).totalPages} />
    </div>
  )
}