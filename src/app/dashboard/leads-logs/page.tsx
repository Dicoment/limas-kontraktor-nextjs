import { getLeadsLogs } from "@/actions/misc.actions"
import { Pagination } from "@/components/admin/BlogTableComponents"
import { LeadsLogTable } from "./_components/LeadsLogTable"

export const dynamic = "force-dynamic"

export default async function AdminLeadsLogsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams
  const data = await getLeadsLogs({ page: params.page ? parseInt(params.page) : 1, limit: 20 })

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-slate-900">Leads Log</h1>
        <p className="text-sm text-slate-600">Daftar calon klien yang mengisi form konsultasi di website.</p>
      </div>

      <LeadsLogTable initialData={data.data} />
      <Pagination currentPage={data.page} totalPages={data.totalPages} />
    </div>
  )
}