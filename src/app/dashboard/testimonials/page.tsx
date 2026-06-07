import { getTestimonials } from "@/actions/misc.actions"
import { SearchForm, Pagination } from "../../../components/admin/BlogTableComponents"
import { Table } from "@/components/ui/Table"
import Button from "@/components/ui/Button"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }> | { page?: string; search?: string }
}

export default async function AdminTestimonialsPage(props: PageProps) {
  const resolvedParams = await props.searchParams
  const querySearch = resolvedParams.search || undefined
  const queryPage = resolvedParams.page ? parseInt(resolvedParams.page) : 1

  const data = await getTestimonials({
    page: queryPage,
    limit: 20,
    published: undefined,
  }) as Awaited<ReturnType<typeof getTestimonials>>

  const testimonialHeaders = [
    { key: "clientName", label: "Client", className: "w-[25%]" },
    { key: "content", label: "Content", className: "w-[40%]" },
    { key: "rating", label: "Rating", className: "w-[10%]" },
    { key: "platform", label: "Platform", className: "w-[15%]" },
    { key: "actions", label: "Actions", align: "right" as const, className: "w-[10%]" },
  ]

  return (
    <div className="space-y-5 font-jakarta">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Testimonials</h1>
          <p className="text-xs text-slate-400 mt-0.5">Kelola testimoni dari klien dan client.</p>
        </div>
        <Button href="/dashboard/testimonials/new" variant="primary">
          + New Testimonial
        </Button>
      </div>

      <div className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-md">
        <SearchForm placeholder="Cari testimoni..." />
      </div>

      <Table
        headers={testimonialHeaders}
        rows={(data as any).data || []}
        emptyMessage="No testimonials found."
        renderRow={(testimonial: any) => (
          <tr key={testimonial.id} className="hover:bg-slate-50/40 transition-colors">
            <td className="px-5 py-3.5">
              <p className="font-semibold text-slate-900 text-sm">{testimonial.clientName}</p>
              {testimonial.avatar && (
                <img src={testimonial.avatar} alt={testimonial.clientName} className="w-8 h-8 rounded-full mt-1" />
              )}
            </td>
            <td className="px-5 py-3.5 max-w-xs truncate text-slate-600">
              {testimonial.content?.substring(0, 60)}...
            </td>
            <td className="px-5 py-3.5">
              <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-bold rounded-sm border bg-amber-50 text-amber-700 border-amber-100">
                {testimonial.rating || "—"} / 5
              </span>
            </td>
            <td className="px-5 py-3.5">
              <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-bold rounded-sm border ${
                testimonial.platform === "SOCIAL_MEDIA" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-zinc-100 text-zinc-600 border-zinc-200"
              }`}>
                {testimonial.platform === "SOCIAL_MEDIA" ? "Social Media" : "Manual"}
              </span>
            </td>
            <td className="px-5 py-3.5 text-right whitespace-nowrap">
              <Button href={`/dashboard/testimonials/${testimonial.id}/edit`} variant="outline" size="sm">
                Edit
              </Button>
            </td>
          </tr>
        )}
      />

      <Pagination currentPage={(data as any).page} totalPages={(data as any).totalPages} />
    </div>
  )
}