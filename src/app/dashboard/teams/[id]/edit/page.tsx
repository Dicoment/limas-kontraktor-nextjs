import { getTeamById } from "@/actions/misc.actions"
import TeamFormClient from "@/components/team/TeamFormClient"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const team = await getTeamById(id)
  if (!team) redirect("/dashboard/teams")
  return <TeamFormClient initialData={team} />
}