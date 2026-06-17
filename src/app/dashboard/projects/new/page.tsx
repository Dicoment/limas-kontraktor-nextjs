import { getAllCategories, getAllTeams } from "@/actions/project.actions"
import ProjectFormClient from "./project-form-client"

export const dynamic = "force-dynamic"

export default async function NewProjectPage() {
  const [categories, teams] = await Promise.all([getAllCategories(), getAllTeams()])

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-xl font-bold text-slate-800">New Project</h1>
      <ProjectFormClient categories={categories} teams={teams} />
    </div>
  )
}