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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

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
      if (json.fieldErrors) {
        setFieldErrors(json.fieldErrors)
      }
      setError(json.error || "Failed to save testimonial")
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">{isEdit ? "Edit" : "New"} Testimonial</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Client Name</label><input name="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} className={`w-full px-3 py-2 border rounded ${fieldErrors?.clientName?.length ? 'border-red-500' : 'border-slate-300'}`} required />
          {fieldErrors?.clientName?.[0] && <p className="text-red-500 text-xs mt-1">{fieldErrors.clientName[0]}</p>}
          <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">Minimal 2 karakter, maksimal 100 karakter.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
          <textarea name="content" value={content} onChange={(e) => setContent(e.target.value)} rows={4} className={`w-full px-3 py-2 border rounded ${fieldErrors?.content?.length ? 'border-red-500' : 'border-slate-300'}`} required />
          {fieldErrors?.content?.[0] && <p className="text-red-500 text-xs mt-1">{fieldErrors.content[0]}</p>}
          <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">Minimal 10 karakter, maksimal 5.000 karakter.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Rating (1-5)</label>
          <input name="rating" type="number" min={1} max={5} value={rating} onChange={(e) => setRating(e.target.value)} className={`w-full px-3 py-2 border rounded ${fieldErrors?.rating?.length ? 'border-red-500' : 'border-slate-300'}`} />
          {fieldErrors?.rating?.[0] && <p className="text-red-500 text-xs mt-1">{fieldErrors.rating[0]}</p>}
          <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">Bilangan bulat. Minimal 1, maksimal 5 (Opsional).</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Source URL</label>
          <input name="sourceUrl" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} type="url" className={`w-full px-3 py-2 border rounded ${fieldErrors?.sourceUrl?.length ? 'border-red-500' : 'border-slate-300'}`} />
          {fieldErrors?.sourceUrl?.[0] && <p className="text-red-500 text-xs mt-1">{fieldErrors.sourceUrl[0]}</p>}
          <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">URL tidak valid jika diisi, maksimal 500 karakter (Opsional).</p>
        </div>
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
          <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">URL avatar tidak valid, maksimal 500 karakter (Opsional).</p>
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
          <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
          <select name="platform" value={platform} onChange={(e) => setPlatform(e.target.value)} className={`w-full px-3 py-2 border rounded ${fieldErrors?.platform?.length ? 'border-red-500' : 'border-slate-300'}`}>
            <option value="MANUAL">Manual</option>
            <option value="SOCIAL_MEDIA">Social Media</option>
          </select>
          {fieldErrors?.platform?.[0] && <p className="text-red-500 text-xs mt-1">{fieldErrors.platform[0]}</p>}
          <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">Pilihan: Manual atau Social Media. Default: Manual.</p>
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