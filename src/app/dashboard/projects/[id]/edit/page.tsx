import { getProjectById, getAllCategories, getAllTeams } from "@/actions/project.actions"
import ProjectFormClient from "@/components/project/ProjectFormClient";
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [project, categories, teams] = await Promise.all([
  getProjectById(id),
  getAllCategories("project"),
  getAllTeams(),
])
  if (!project) redirect("/dashboard/projects")

  return <ProjectFormClient categories={categories} teams={teams} initialData={project} />
}