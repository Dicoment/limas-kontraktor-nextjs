import { getAllProjects, createTestimonial, updateTestimonial } from "@/actions/misc.actions"
import TestimonialFormClient from "@/components/testimonial/TestimonialFormClient"

export const dynamic = "force-dynamic"

export default async function NewTestimonialPage() {
  const projects = await getAllProjects()

  return (
    <div className="p-6">
      <TestimonialFormClient
        projects={projects}
        createTestimonial={createTestimonial}
        updateTestimonial={updateTestimonial}
      />
    </div>
  )
}