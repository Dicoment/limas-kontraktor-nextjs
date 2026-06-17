"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import MediaPicker from "@/components/ui/MediaPicker"

export default function EditTestimonialClient({ testimonial, projects }: any) {
  const router = useRouter()
  const [clientName, setClientName] = useState(testimonial.clientName)
  const [content, setContent] = useState(testimonial.content)
  const [rating, setRating] = useState(testimonial.rating || "")
  const [platform, setPlatform] = useState(testimonial.platform)
  const [sourceUrl, setSourceUrl] = useState(testimonial.sourceUrl || "")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarUrl, setAvatarUrl] = useState(testimonial.avatar || "")
  const [projectId, setProjectId] = useState(testimonial.projectId || "")
  const [published, setPublished] = useState(testimonial.published)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("clientName", clientName)
    formData.append("content", content)
    formData.append("rating", rating || "")
    formData.append("platform", platform)
    formData.append("sourceUrl", sourceUrl || "")
    formData.append("projectId", projectId || "")
    formData.append("published", published.toString())
    
    if (avatarFile) {
      formData.append("avatar", avatarFile)
    } else if (avatarUrl) {
      formData.append("avatarUrl", avatarUrl)
    }

    const res = await fetch(`/api/testimonials/${testimonial.id}`, {
      method: "POST",
      body: formData,
    })
    const json = await res.json()
    if (json.success) {
      router.push("/dashboard/testimonials")
      router.refresh()
    } else {
      setError(json.error || "Failed to update testimonial")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl" encType="multipart/form-data">
      <h1 className="text-xl font-bold text-slate-800">Edit Testimonial</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
      
      <div className="space-y-4">
        <Field label="Client Name" value={clientName} onChange={setClientName} required />
        <Field label="Content" value={content} onChange={setContent} type="textarea" required />
        <Field label="Rating (1-5)" value={rating} onChange={setRating} type="number" min={1} max={5} />
        <Field label="Platform" value={platform} onChange={setPlatform} type="select" 
          options={[{ value: "MANUAL", label: "Manual" }, { value: "SOCIAL_MEDIA", label: "Social Media" }]} />
        <Field label="Source URL" value={sourceUrl} onChange={setSourceUrl} type="url" />
        <Field label="Avatar">
          <MediaPicker 
            value={avatarUrl} 
            onChange={(url) => {
              setAvatarUrl(url)
              setAvatarFile(null)
            }} 
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              if (file.size > 5 * 1024 * 1024) {
                setError("File size exceeds 5MB")
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
        </Field>
        <Field label="Related Project" value={projectId} onChange={setProjectId} type="select" 
          options={[{ value: "", label: "— None —" }, ...(projects || []).map((p: any) => ({ value: p.id, label: p.title }))]} />
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-blue-600" />
          <label className="text-sm font-medium text-slate-700">Published</label>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
          {loading ? "Saving..." : "Update"}
        </button>
        <a href="/dashboard/testimonials" className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50">Cancel</a>
      </div>
    </form>
  )
}

function Field({ label, value, onChange, type = "text", required, min, max, options, children }: 
  { label: string; value?: string | number; onChange?: (v: string) => void; type?: string; required?: boolean; min?: number; max?: number; options?: any[]; children?: React.ReactNode }) {
  let inputElement: React.ReactNode
  
  if (children) {
    inputElement = children
  } else if (type === "textarea") {
    inputElement = <textarea value={value} onChange={(e) => onChange?.(e.target.value)} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded" required={required} />
  } else if (type === "select") {
    inputElement = (
      <select value={value} onChange={(e) => onChange?.(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded">
        {options?.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  } else {
    inputElement = <input type={type} value={value} onChange={(e) => onChange?.(e.target.value)} min={min} max={max} className="w-full px-3 py-2 border border-slate-300 rounded" required={required} />
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {inputElement}
    </div>
  )
}