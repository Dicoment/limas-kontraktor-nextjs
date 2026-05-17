import { getProjectById } from "@/actions/project.actions"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await getProjectById(id)
  if (!project) redirect("/admin/projects")

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-xl font-bold text-slate-800">Edit Project</h1>
      <EditForm project={project} />
    </div>
  )
}

async function EditForm({ project }: { project: any }) {
  "use server"
  return (
    <form action={`/api/projects/${project.id}`} method="PUT" className="bg-white rounded-lg shadow p-6 space-y-6">
      <Field label="Title" name="title" defaultValue={project.title} required />
      <Field label="Slug" name="slug" defaultValue={project.slug} required />
      <Field label="Location" name="location" defaultValue={project.location || ""} />
      <Field label="Client" name="client" defaultValue={project.client || ""} />
      <Field label="Limas Role" name="limasRole" defaultValue={project.limasRole || ""} />
      <Field label="Cover Image URL" name="coverImage" defaultValue={project.coverImage || ""} type="url" />
      <Field label="Status" name="status" type="select" defaultValue={project.status} options={["DRAFT", "ONGOING", "COMPLETED"]} />
      <Field label="SEO Title" name="seoTitle" defaultValue={project.seoTitle || ""} />
      <Field label="SEO Description" name="seoDescription" defaultValue={project.seoDescription || ""} />
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea name="description" defaultValue={project.description} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded" required />
        <input type="hidden" name="_method" value="PUT" />
      </div>
      <div className="flex gap-3">
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">Update</button>
        <a href="/admin/projects" className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50">Cancel</a>
      </div>
    </form>
  )
}

function Field({ label, name, defaultValue, required, type = "text", options }: { label: string; name: string; defaultValue: string; required?: boolean; type?: string; options?: string[] }) {
  if (type === "select") {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <select name={name} defaultValue={defaultValue} className="w-full px-3 py-2 border border-slate-300 rounded" required={required}>
          {options?.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    )
  }
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input name={name} defaultValue={defaultValue} type={type} className="w-full px-3 py-2 border border-slate-300 rounded" required={required} />
    </div>
  )
}