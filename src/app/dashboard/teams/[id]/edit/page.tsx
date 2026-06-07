import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import EditTeamClient from "./EditTeamClient"

export const dynamic = "force-dynamic"

export default async function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const team = await prisma.team.findUnique({ where: { id } })
  
  if (!team) redirect("/dashboard/teams")

  return <EditTeamClient team={team} />
}