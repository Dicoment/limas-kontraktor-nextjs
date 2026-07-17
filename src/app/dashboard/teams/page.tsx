import { getTeams } from "@/actions/misc.actions"
import { SearchForm, Pagination } from "@/components/admin/BlogTableComponents"
import { TeamTable } from "./_components/TeamTable"
import Link from "next/link"
import Button from "@/components/ui/Button"

export const dynamic = "force-dynamic"

export default async function AdminTeamsPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const params = await searchParams
  const data = await getTeams({
    page: params.page ? parseInt(params.page) : 1,
    limit: 10,
    search: params.search,
  })

  return (
    <div className="space-y-6 p-4 md:p-6">
      
      {/* Header section: Menumpuk vertikal di HP, berjejer horizontal di layar sm (640px) ke atas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Wrapper SearchForm agar ukurannya proporsional di desktop */}
        <div className="w-full sm:w-auto sm:max-w-xs">
          <SearchForm placeholder="Cari tim..." />
        </div>
        
        {/* Link dan Button melebar penuh di mobile untuk kemudahan tap */}
        <Link href="/dashboard/teams/new" className="w-full sm:w-auto">
          <Button variant="primary" size="sm" className="w-full sm:w-auto justify-center">
            + New Team
          </Button>
        </Link>
        
      </div>

      {/* Konten Utama Tabel Tim */}
      <TeamTable initialData={data.data} />
      
      {/* Konten Navigasi Halaman */}
      <Pagination currentPage={data.page} totalPages={data.totalPages} />
      
    </div>
  )
}