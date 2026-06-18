"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import MediaPicker from "@/components/ui/MediaPicker"

export default function EditProjectClient({
  project,
  categories,
  teams,
  initialCategoryIds,
  initialTeamIds,
}: {
  project: any
  categories: any[]
  teams: any[]
  initialCategoryIds: string[]
  initialTeamIds: string[]
}) {
  const router = useRouter()
  const [title, setTitle] = useState(project.title)
  const [slug, setSlug] = useState(project.slug)
  const [description, setDescription] = useState(project.description)
  const [location, setLocation] = useState(project.location || "")
  const [client, setClient] = useState(project.client || "")
  const [limasRole, setLimasRole] = useState(project.limasRole || "")
  const [coverImage, setCoverImage] = useState(project.coverImage || "")
  const [status, setStatus] = useState(project.status)
  const [seoTitle, setSeoTitle] = useState(project.seoTitle || "")
  const [seoDescription, setSeoDescription] = useState(project.seoDescription || "")
  const [gallery, setGallery] = useState(project.gallery ? JSON.stringify(project.gallery) : "")
  const [categoryIds, setCategoryIds] = useState<string[]>(initialCategoryIds)
  const [teamRoles, setTeamRoles] = useState<Record<string, string>>(
    (teams || []).reduce((acc: Record<string, string>, t: any) => {
      const existing = (project as any).teams?.find((pt: any) => pt.id === t.id)
      acc[t.id] = existing?.role || ""
      return acc
    }, {})
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const toggleCategory = (id: string) => {
    setCategoryIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  const handleTeamRoleChange = (id: string, role: string) => {
    setTeamRoles(prev => ({ ...prev, [id]: role }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    let parsedGallery: string[] = []
    try {
      if (gallery) parsedGallery = JSON.parse(gallery)
    } catch (err) {
      setError("Gallery must be valid JSON array")
      setLoading(false)
      return
    }

    const teamIds = Object.entries(teamRoles)
      .filter(([, role]) => role)
      .map(([id, role]) => ({ teamId: id, role }))

    const res = await fetch(`/api/projects/${project.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        title, slug, description, location, client, limasRole, coverImage, 
        status, seoTitle, seoDescription, gallery: parsedGallery, categoryIds, teamIds 
      }),
    })
    const json = await res.json()
    if (json.success) {
      router.push("/dashboard/projects")
      router.refresh()
    } else {
      setError(json.error || "Failed to update project")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      <h1 className="text-xl font-bold text-slate-800">Edit Project</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <Field label="Title" value={title} onChange={setTitle} required description="Panjang judul antara 3 hingga 200 karakter." />
          <Field label="Slug" value={slug} onChange={setSlug} required description="Panjang slug antara 3 hingga 100 karakter. Hanya huruf kecil, angka, dan strip." />
          <Field label="Location" value={location} onChange={setLocation} description="Maksimal 255 karakter (Opsional)." />
          <Field label="Client" value={client} onChange={setClient} description="Maksimal 255 karakter (Opsional)." />
          <Field label="Limas Role" value={limasRole} onChange={setLimasRole} description="Maksimal 255 karakter (Opsional)." />
          <Field label="Cover Image">
            <MediaPicker value={coverImage} onChange={setCoverImage} />
            <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">URL gambar tidak valid jika diisi (Opsional).</p>
          </Field>
        </div>
        <div className="space-y-4">
          <Field label="Status" type="select" value={status} onChange={setStatus} options={["DRAFT", "ONGOING", "COMPLETED"]} />
          <Field label="SEO Title" value={seoTitle} onChange={setSeoTitle} />
          <Field label="SEO Description" value={seoDescription} onChange={setSeoDescription} />
          <Field label="Categories">
            <select 
              multiple 
              value={categoryIds} 
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(o => o.value)
                setCategoryIds(selected)
              }} 
              className="w-full px-3 py-2 border border-slate-300 rounded h-24"
            >
              {(categories || []).map((c: any) => (
                <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
              ))}
            </select>
            <p className="text-xs text-slate-400">Ctrl+Click for multiple</p>
          </Field>
          <Field label="Team">
            <div className="border border-slate-300 rounded p-2 max-h-40 overflow-y-auto space-y-1">
              {(teams || []).map((t: any) => (
                <label key={t.id} className="flex items-center gap-2 mb-1 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={initialTeamIds.includes(t.id) || Object.keys(teamRoles).some(k => k === t.id && teamRoles[k])} 
                    onChange={(e) => {
                      if (!e.target.checked) {
                        setTeamRoles(prev => {
                          const newRoles = { ...prev }
                          delete newRoles[t.id]
                          return newRoles
                        })
                      }
                    }} 
                    className="accent-blue-600" 
                  />
                  <span className="text-sm w-24">{t.name}</span>
                  <input 
                    value={teamRoles[t.id] || ""} 
                    onChange={(e) => handleTeamRoleChange(t.id, e.target.value)} 
                    placeholder="Role" 
                    className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm" 
                  />
                </label>
              ))}
            </div>
          </Field>
        </div>
      </div>

      <Field label="Description" value={description} onChange={setDescription} type="textarea" required description="Panjang deskripsi antara 10 hingga 10.000 karakter." />
      <Field label="Gallery URLs (JSON array)" value={gallery} onChange={setGallery} type="textarea" placeholder='["url1", "url2"]' description="Maksimal 50 gambar, URL harus valid." />

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
          {loading ? "Saving..." : "Update"}
        </button>
        <Link href="/dashboard/projects" className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50 cursor-pointer">Cancel</Link>
      </div>
    </form>
  )
}

function Field({ label, value, onChange, type = "text", required, placeholder, options, description, children }: 
  { label: string; value?: string; onChange?: (v: string) => void; type?: string; required?: boolean; placeholder?: string; options?: string[]; description?: string; children?: React.ReactNode }) {
  const inputElement = children || (type === "textarea" ? (
    <textarea value={value} onChange={(e) => onChange?.(e.target.value)} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded" required={required} placeholder={placeholder} />
  ) : type === "select" ? (
    <select value={value} onChange={(e) => onChange?.(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded" required={required}>
      {(options || []).map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  ) : (
    <input type={type} value={value} onChange={(e) => onChange?.(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded" required={required} placeholder={placeholder} />
  ))

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {inputElement}
      {description && <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">{description}</p>}
    </div>
  )
}