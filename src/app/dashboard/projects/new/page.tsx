import { getAllCategories, getAllTeams } from "@/actions/project.actions"
import ProjectFormClient from "@/components/project/ProjectFormClient";

export const dynamic = "force-dynamic"

export default async function NewProjectPage() {
  const [categories, teams] = await Promise.all([getAllCategories(), getAllTeams()])

  return <ProjectFormClient categories={categories} teams={teams} />
}