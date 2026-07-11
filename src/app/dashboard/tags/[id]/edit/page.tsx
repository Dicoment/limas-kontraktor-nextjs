import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { TagForm } from "@/app/dashboard/tags/_components/TagForm"

export default async function EditTagPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tag = await prisma.tag.findUnique({ where: { id } })
  if (!tag) redirect("/dashboard/tags")
  return (
    <div className="p-6 mx-auto max-w-2xl mt-6">
        <TagForm tag={tag} />
    </div>
  )
}