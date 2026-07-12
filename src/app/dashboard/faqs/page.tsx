import { getFaqs } from "@/actions/faq.actions"
import { Pagination } from "@/components/admin/BlogTableComponents"
import { FaqTable } from "./_components/FaqTable"
import Link from "next/link"
import Button from "@/components/ui/Button"

export const dynamic = "force-dynamic"

export default async function AdminFaqsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams
  const data = await getFaqs({ page: params.page ? parseInt(params.page) : 1, limit: 10 })

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
  {/* Container untuk Title & Desc */}
  <div className="flex flex-col">
    <h1 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h1>
    <p className="text-sm text-slate-600">Kelola pertanyaan umum yang ditampilkan di Section FAQ.</p>
  </div>
  
  {/* Tombol */}
  <div className="w-full md:w-auto">
    <Link href="/dashboard/faqs/new">
      <Button variant="primary" size="sm" className="w-full md:w-auto">+ New FAQ</Button>
    </Link>
  </div>
</div>
      <FaqTable initialData={data.faqs} />
      <Pagination currentPage={data.page} totalPages={data.totalPages} />
    </div>
  )
}