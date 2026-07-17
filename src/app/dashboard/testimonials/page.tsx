import { getTestimonials } from "@/actions/misc.actions"
import { SearchForm, Pagination } from "@/components/admin/BlogTableComponents"
import { TestimonialTable } from "./_components/TestimonialTable"
import Link from "next/link"
import Button from "@/components/ui/Button"

export const dynamic = "force-dynamic"

export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const params = await searchParams
  const queryPage = params.page ? parseInt(params.page) : 1

  const data = await getTestimonials({
    page: queryPage,
    limit: 20,
    published: undefined,
    search: params.search,
  })

  return (
    <div className="space-y-6 p-4 md:p-6">
      
      {/* Header section: Menumpuk vertikal di HP, berjejer horizontal di layar sm (640px) ke atas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
                <div className="w-full sm:w-auto sm:max-w-xs">
          <SearchForm placeholder="Cari testimoni..." />
        </div>
        
        <Link href="/dashboard/testimonials/new" className="w-full sm:w-auto">
          <Button variant="primary" size="sm" className="w-full sm:w-auto justify-center">
            + New Testimonial
          </Button>
        </Link>
        
      </div>

      {/* Konten Utama Tabel Testimoni */}
      <TestimonialTable initialData={data.data} />
      
      {/* Konten Navigasi Halaman */}
      <Pagination currentPage={data.page} totalPages={data.totalPages} />
      
    </div>
  )
}