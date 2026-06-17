"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import MediaPicker from "@/components/ui/MediaPicker"

const MAX_FILE_SIZE = 5 * 1024 * 1024

type Testimonial = { id: string; clientName: string; content: string; rating: number | null; platform: string; sourceUrl: string | null; avatar: string | null; published: boolean; projectId: string | null }
type Project = { id: string; title: string }

export default function TestimonialForm({ testimonial, projects, isEdit = false }: { testimonial?: Testimonial; projects: Project[]; isEdit?: boolean }) {
  const router = useRouter()
  const [clientName, setClientName] = useState(testimonial?.clientName || "")
  const [content, setContent] = useState(testimonial?.content || "")
  const [rating, setRating] = useState(testimonial?.rating || "")
  const [platform, setPlatform] = useState(testimonial?.platform || "MANUAL")
  const [sourceUrl, setSourceUrl] = useState(testimonial?.sourceUrl || "")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarUrl, setAvatarUrl] = useState(testimonial?.avatar || "")
  const [projectId, setProjectId] = useState(testimonial?.projectId || "")
  const [published, setPublished] = useState(testimonial?.published || false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("clientName", clientName)
    formData.append("content", content)
    formData.append("rating", String(rating || ""))
    formData.append("platform", platform)
    formData.append("sourceUrl", sourceUrl || "")
    formData.append("projectId", projectId || "")
    formData.append("published", published.toString())
    
    if (avatarFile) {
      formData.append("avatar", avatarFile)
    } else if (avatarUrl) {
      formData.append("avatarUrl", avatarUrl)
    }

    const url = isEdit ? `/api/testimonials/${testimonial!.id}` : "/api/testimonials"
    const method = isEdit ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      body: formData,
    })
    const json = await res.json()
    if (json.success) {
      router.push("/dashboard/testimonials")
      router.refresh()
    } else {
      setError(json.error || "Failed to save testimonial")
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">{isEdit ? "Edit" : "New"} Testimonial</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Client Name</label><input name="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded" required /></div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
          <textarea name="content" value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded" required />
        </div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Rating (1-5)</label><input name="rating" type="number" min={1} max={5} value={rating} onChange={(e) => setRating(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded" /></div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
          <select name="platform" value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded">
            <option value="MANUAL">Manual</option>
            <option value="SOCIAL_MEDIA">Social Media</option>
          </select>
        </div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Source URL</label><input name="sourceUrl" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} type="url" className="w-full px-3 py-2 border border-slate-300 rounded" /></div>
        <p className="text-sm text-gray-500 mt-1">Masukkan tautan ulasan asli (contoh: Link ulasan Google Review, Facebook, dsb).</p>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Avatar</label>
          <MediaPicker 
            value={avatarUrl} 
            onChange={(url) => {
              setAvatarUrl(url)
              setAvatarFile(null)
            }} 
            placeholder="Select an avatar"
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              if (file.size > MAX_FILE_SIZE) {
                setError(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`)
                return
              }
              if (!file.type.startsWith("image/")) {
                setError("Only image files are allowed")
                return
              }
              setAvatarFile(file)
              setAvatarUrl(URL.createObjectURL(file))
              setError("")
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded mt-2" 
          />
          {avatarUrl && (
            <img src={avatarUrl} alt="Preview" className="mt-2 h-20 object-cover rounded" />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Related Project</label>
          <select name="projectId" value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded">
            <option value="">— None —</option>
            {(projects || []).map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="published" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-blue-600" />
          <label className="text-sm font-medium text-slate-700">Published</label>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">{loading ? "Saving..." : isEdit ? "Update" : "Create"}</button>
          <a href="/dashboard/testimonials" className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50">Cancel</a>
        </div>
      </form>
    </div>
  )
}