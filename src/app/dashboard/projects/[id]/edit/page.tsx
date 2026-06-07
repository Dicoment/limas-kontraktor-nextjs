import { getProjectById, getAllCategories, getAllTeams } from "@/actions/project.actions"
import { redirect } from "next/navigation"
import EditProjectClient from "./EditProjectClient"

export const dynamic = "force-dynamic"

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [project, categories, teams] = await Promise.all([
    getProjectById(id),
    getAllCategories(),
    getAllTeams(),
  ])
  
  if (!project) redirect("/dashboard/projects")

  const initialCategoryIds = (project as any).categories?.map((c: any) => c.id) || []
  const initialTeamIds = (project as any).teams?.map((t: any) => t.id) || []

  return (
    <EditProjectClient
      project={project}
      categories={categories}
      teams={teams}
      initialCategoryIds={initialCategoryIds}
      initialTeamIds={initialTeamIds}
    />
  )
}