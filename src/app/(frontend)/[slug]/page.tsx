import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function StaticPagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await prisma.page.findUnique({ where: { slug } })

  if (!page) notFound()

  return (
    <div className="min-h-screen py-12 px-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">{page.title}</h1>
      <div className="prose max-w-none">
        <div className="text-slate-700 whitespace-pre-line leading-relaxed">
          {page.content}
        </div>
      </div>
    </div>
  )
} 