import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import EditTestimonialClient from "./EditTestimonialClient"

export const dynamic = "force-dynamic"

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [testimonial, projects] = await Promise.all([
    prisma.testimonial.findUnique({ where: { id } }),
    prisma.project.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } }),
  ])

  if (!testimonial) redirect("/dashboard/testimonials")

  return <EditTestimonialClient testimonial={testimonial} projects={projects} />
}