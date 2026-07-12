import { getFaqById } from "@/actions/faq.actions"
import FaqFormClient from "@/components/faq/FaqFormClient"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const faq = await getFaqById(id)
  if (!faq) redirect("/dashboard/faqs")
  return <FaqFormClient initialData={faq} />
}