import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import EditCategoryClient from "./EditCategoryClient"

export const dynamic = "force-dynamic"

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await prisma.category.findUnique({ where: { id } })
  
  if (!category) redirect("/dashboard/categories")

  return <EditCategoryClient category={category} />
}