"use client"

import { useState } from "react"
import MediaPicker from "@/components/ui/MediaPicker"
import { MultipleMediaPicker } from "@/components/ui/multiple-media-picker"

interface ProjectFormClientProps {
  categories: any[]
  teams: any[]
}

export default function ProjectFormClient({ categories, teams }: ProjectFormClientProps) {
  const [coverImage, setCoverImage] = useState("")
  const [gallery, setGallery] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const selectedTeamIds = Array.from(
      document.querySelectorAll('input[name="teamIds"]:checked')
    ).map((el) => (el as HTMLInputElement).value)

    const teamRoles: Record<string, string> = {}
    selectedTeamIds.forEach(id => {
      const roleInput = document.querySelector(`input[name="teamRoles"][data-team="${id}"]`) as HTMLInputElement
      if (roleInput?.value) teamRoles[id] = roleInput.value
    })

    const teamIds = selectedTeamIds.map(teamId => ({
      teamId,
      role: teamRoles[teamId] || ""
    }))

    const categoryIds = Array.from(
      document.querySelectorAll('select[name="categoryIds"] option:checked')
    ).map((el) => (el as HTMLOptionElement).value)

    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      client: formData.get("client") as string,
      limasRole: formData.get("limasRole") as string,
      coverImage,
      gallery,
      status: formData.get("status") as string,
      seoTitle: formData.get("seoTitle") as string,
      seoDescription: formData.get("seoDescription") as string,
      categoryIds,
      teamIds,
    }

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.success) {
        window.location.href = "/dashboard/projects"
      } else {
        setError(json.error || "Failed to create project")
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
      <h1 className="text-xl font-bold text-slate-800">Create Project</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <Field label="Title" description="Panjang judul antara 3 hingga 200 karakter.">
            <input name="title" className="w-full px-3 py-2 border border-slate-300 rounded" required />
          </Field>
          <Field label="Slug" description="3-100 karakter. Hanya boleh berisi huruf kecil, angka, dan strip (contoh: proyek-baru-1).">
            <input name="slug" className="w-full px-3 py-2 border border-slate-300 rounded" required />
          </Field>
          <Field label="Location" description="Maksimal 255 karakter (Opsional).">
            <input name="location" className="w-full px-3 py-2 border border-slate-300 rounded" />
          </Field>
          <Field label="Client" description="Maksimal 255 karakter (Opsional).">
            <input name="client" className="w-full px-3 py-2 border border-slate-300 rounded" />
          </Field>
          <Field label="Limas Role" description="Maksimal 255 karakter (Opsional).">
            <input name="limasRole" className="w-full px-3 py-2 border border-slate-300 rounded" />
          </Field>
          <Field label="Cover Image">
            <MediaPicker value={coverImage} onChange={setCoverImage} />
            <p className="text-xs text-slate-400 mt-1">Pilih dari FileGator atau masukkan URL langsung</p>
          </Field>
        </div>
        <div className="space-y-4">
          <Field label="Status">
            <select name="status" defaultValue="DRAFT" className="w-full px-3 py-2 border border-slate-300 rounded">
              <option value="DRAFT">Draft</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </Field>
          <Field label="SEO Title">
            <input name="seoTitle" className="w-full px-3 py-2 border border-slate-300 rounded" />
          </Field>
          <Field label="SEO Description">
            <input name="seoDescription" className="w-full px-3 py-2 border border-slate-300 rounded" />
          </Field>
          <Field label="Categories">
            <select name="categoryIds" multiple className="w-full px-3 py-2 border border-slate-300 rounded h-24">
              {(categories || []).map((c: any) => (
                <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
              ))}
            </select>
            <p className="text-xs text-slate-400">Ctrl+Click for multiple</p>
          </Field>
          <Field label="Team">
            {(teams || []).map((team: any) => (
              <div key={team.id} className="flex gap-2 items-center mb-1">
                <input type="checkbox" name="teamIds" value={team.id} className="accent-blue-600" />
                <span className="text-sm w-24">{team.name}</span>
                <input data-team={team.id} name="teamRoles" placeholder="Role" className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm" />
              </div>
            ))}
          </Field>
        </div>
      </div>

      <Field label="Description" description="Panjang deskripsi antara 10 hingga 10.000 karakter.">
        <textarea name="description" rows={4} className="w-full px-3 py-2 border border-slate-300 rounded" required />
      </Field>

      <Field label="Gallery">
        <MultipleMediaPicker value={gallery} onChange={setGallery} />
        <p className="text-xs text-slate-400 mt-1">Pilih banyak gambar dari FileGator</p>
      </Field>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
          {loading ? "Creating..." : "Create Project"}
        </button>
        <a href="/dashboard/projects" className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50">Cancel</a>
      </div>
    </form>
  )
}

function Field({ label, children, description }: { label: string; children: React.ReactNode; description?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
      {description && <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">{description}</p>}
    </div>
  )
}