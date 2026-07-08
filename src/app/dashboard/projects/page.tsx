import { getProjects } from "@/actions/project.actions"
import { SearchForm, Pagination } from "@/components/admin/BlogTableComponents"
import { ProjectTable } from "./_components/ProjectTable"

import Link from "next/link"
import Button from "@/components/ui/Button"

export const dynamic = "force-dynamic"

export default async function AdminProjectsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string; search?: string }> 
}) {
  const params = await searchParams
  const projectsData = await getProjects({
    page: params.page ? parseInt(params.page) : 1,
    limit: 10,
    search: params.search,
  })

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <SearchForm placeholder="Cari project..." />
        <Link href="/dashboard/projects/new">
            <Button variant="primary" size="sm">+ New Project</Button>
        </Link>
      </div>

      <ProjectTable initialData={projectsData.projects} />

      <Pagination currentPage={projectsData.page} totalPages={projectsData.totalPages} />
    </div>
  )
}