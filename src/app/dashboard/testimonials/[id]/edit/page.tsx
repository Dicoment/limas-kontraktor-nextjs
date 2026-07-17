import { notFound } from "next/navigation"
import { getTestimonialById, getAllProjects, createTestimonial, updateTestimonial } from "@/actions/misc.actions"
import TestimonialFormClient from "@/components/testimonial/TestimonialFormClient"

export const dynamic = "force-dynamic"

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [testimonial, projects] = await Promise.all([getTestimonialById(id), getAllProjects()])

  if (!testimonial) notFound()

  return (
    <div className="p-6">
      <TestimonialFormClient
        testimonial={testimonial}
        projects={projects}
        createTestimonial={createTestimonial}
        updateTestimonial={updateTestimonial}
      />
    </div>
  )
}