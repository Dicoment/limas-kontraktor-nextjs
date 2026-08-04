import { getVirtualTourScenes } from "@/actions/virtual-tour.actions"
import { SearchForm, Pagination } from "@/components/admin/BlogTableComponents"
import { VirtualTourTable } from "./_components/VirtualTourTable"
import Link from "next/link"
import Button from "@/components/ui/Button"

export const dynamic = "force-dynamic"

export default async function AdminVirtualTourPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const params = await searchParams
  const queryPage = params.page ? parseInt(params.page) : 1

  const data = await getVirtualTourScenes({
    page: queryPage,
    limit: 20,
    search: params.search,
  })

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="w-full sm:w-auto sm:max-w-xs">
          <SearchForm placeholder="Cari scene..." />
        </div>
        <Link href="/dashboard/virtual-tour/new" className="w-full sm:w-auto">
          <Button variant="primary" size="sm" className="w-full sm:w-auto justify-center">
            + New Scene
          </Button>
        </Link>
      </div>

      <VirtualTourTable initialData={data.data} />
      <Pagination currentPage={data.page} totalPages={data.totalPages} />
    </div>
  )
}