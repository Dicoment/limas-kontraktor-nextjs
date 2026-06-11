import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function NewTestimonialPage() {
  const projects = await prisma.project.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } })
  return <TestimonialForm projects={projects} />
}

export async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [testimonial, projects] = await Promise.all([
    prisma.testimonial.findUnique({ where: { id } }),
    prisma.project.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } }),
  ])
  if (!testimonial) return <div className="text-slate-500">Testimonial not found.</div>
  return <TestimonialForm testimonial={testimonial} projects={projects} isEdit />
}

type Testimonial = { id: string; clientName: string; content: string; rating: number | null; platform: string; sourceUrl: string | null; avatar: string | null; published: boolean; projectId: string | null }
type Project = { id: string; title: string }

function TestimonialForm({ testimonial, projects, isEdit = false }: { testimonial?: Testimonial; projects: Project[]; isEdit?: boolean }) {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">{isEdit ? "Edit" : "New"} Testimonial</h1>
      <form action={isEdit ? `/api/testimonials/${testimonial!.id}` : "/api/testimonials"} method={isEdit ? "PUT" : "POST"} className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Client Name</label><input name="clientName" defaultValue={testimonial?.clientName || ""} className="w-full px-3 py-2 border border-slate-300 rounded" required /></div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
          <textarea name="content" defaultValue={testimonial?.content || ""} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded" required />
        </div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Rating (1-5)</label><input name="rating" type="number" min={1} max={5} defaultValue={testimonial?.rating || ""} className="w-full px-3 py-2 border border-slate-300 rounded" /></div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
          <select name="platform" defaultValue={testimonial?.platform || "MANUAL"} className="w-full px-3 py-2 border border-slate-300 rounded">
            <option value="MANUAL">Manual</option>
            <option value="SOCIAL_MEDIA">Social Media</option>
          </select>
        </div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Source URL</label><input name="sourceUrl" defaultValue={testimonial?.sourceUrl || ""} type="url" className="w-full px-3 py-2 border border-slate-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Avatar URL</label><input name="avatar" defaultValue={testimonial?.avatar || ""} type="url" className="w-full px-3 py-2 border border-slate-300 rounded" /></div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Related Project</label>
          <select name="projectId" defaultValue={testimonial?.projectId || ""} className="w-full px-3 py-2 border border-slate-300 rounded">
            <option value="">— None —</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="published" defaultChecked={testimonial?.published} className="accent-blue-600" />
          <label className="text-sm font-medium text-slate-700">Published</label>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">{isEdit ? "Update" : "Create"}</button>
          <a href="/dashboard/testimonials" className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50">Cancel</a>
        </div>
      </form>
    </div>
  )
}