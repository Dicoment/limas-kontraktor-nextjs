"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import MediaPicker from "@/components/ui/MediaPicker"

const MAX_FILE_SIZE = 5 * 1024 * 1024

export default function NewBlogPostClient({
  categories,
  tags,
}: {
  categories: { id: string; name: string; slug: string; type: string }[]
  tags: { id: string; name: string; slug: string }[]
}) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState("")
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")
  const [published, setPublished] = useState(false)
  const [publishedAt, setPublishedAt] = useState("")
  const [categoryIds, setCategoryIds] = useState<string[]>([])
  const [tagIds, setTagIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const toggleCategory = (id: string) => {
    setCategoryIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }
  const toggleTag = (id: string) => {
    setTagIds(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setCoverImageFile(file)
    setCoverImageUrl(URL.createObjectURL(file))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("title", title)
    formData.append("slug", slug)
    formData.append("content", content)
    formData.append("excerpt", excerpt || "")
    formData.append("published", published.toString())
    formData.append("publishedAt", publishedAt || "")
    formData.append("categoryIds", JSON.stringify(categoryIds))
    formData.append("tagIds", JSON.stringify(tagIds))
    
    if (coverImageFile) {
      formData.append("image", coverImageFile)
    }

    const res = await fetch("/api/blog-posts", {
      method: "POST",
      body: formData,
    })
    const json = await res.json()
    if (json.success) {
      router.push("/admin/blog-posts")
      router.refresh()
    } else {
      if (json.fieldErrors) {
        setFieldErrors(json.fieldErrors)
      }
      setError(json.error || "Failed to create post")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl" encType="multipart/form-data">
      <h1 className="text-xl font-bold text-slate-800">New Blog Post</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <Field label="Title" name="title" value={title} onChange={setTitle} required description="Minimal 3 karakter." fieldErrors={fieldErrors} />
          <Field label="Slug" name="slug" value={slug} onChange={setSlug} required description="Minimal 3 karakter. Hanya huruf kecil, angka, dan strip." fieldErrors={fieldErrors} />
          <Field label="Cover Image">
            <MediaPicker 
              value={coverImageUrl} 
              onChange={(url) => {
                setCoverImageUrl(url)
                setCoverImageFile(null)
              }} 
            />
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-slate-300 rounded mt-2" 
            />
            {coverImageUrl && (
              <img src={coverImageUrl} alt="Preview" className="mt-2 h-20 object-cover rounded" />
            )}
          </Field>
          <Field label="SEO Title" name="seoTitle" value={seoTitle} onChange={setSeoTitle} fieldErrors={fieldErrors} />
          <Field label="Excerpt" name="excerpt" value={excerpt} onChange={setExcerpt} type="textarea" fieldErrors={fieldErrors} />
        </div>
        <div className="space-y-4">
          <Field label="Published" name="published">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-blue-600" />
          </Field>
          <Field label="Publish Date" name="publishedAt">
            <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded" />
          </Field>
          <Field label="Categories" name="categoryIds">
            <div className="border border-slate-300 rounded p-2 max-h-40 overflow-y-auto space-y-1">
              {(categories || []).filter((c) => c.type === "blog").map((c) => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={categoryIds.includes(c.id)} onChange={() => toggleCategory(c.id)} className="accent-blue-600" />
                  <span className="text-sm">{c.name}</span>
                </label>
              ))}
            </div>
          </Field>
          <Field label="Tags" name="tagIds">
            <div className="border border-slate-300 rounded p-2 max-h-40 overflow-y-auto space-y-1">
              {(tags || []).map((t) => (
                <label key={t.id} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={tagIds.includes(t.id)} onChange={() => toggleTag(t.id)} className="accent-blue-600" />
                  <span className="text-sm">{t.name}</span>
                </label>
              ))}
            </div>
          </Field>
        </div>
      </div>
      <Field label="Content" name="content" value={content} onChange={setContent} type="textarea" required description="Minimal 10 karakter." fieldErrors={fieldErrors} />
      <Field label="SEO Description" name="seoDescription" value={seoDescription} onChange={setSeoDescription} type="textarea" fieldErrors={fieldErrors} />

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
          {loading ? "Saving..." : "Publish"}
        </button>
        <button type="button" onClick={() => router.push("/admin/blog-posts")} className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50 cursor-pointer">Cancel</button>
      </div>
    </form>
  )
}

function Field({ label, name, value, onChange, type = "text", required, placeholder, description, options, fieldErrors, children }:
  { label: string; name?: string; value?: string; onChange?: (v: string) => void; type?: string; required?: boolean; placeholder?: string; description?: string; options?: string[]; fieldErrors?: Record<string, string[]>; children?: React.ReactNode }) {
  const hasError = !!name && (fieldErrors?.[name]?.length ?? 0) > 0
  const errorClass = hasError ? "border-red-500" : "border-slate-300"
  
  const inputElement = children || (type === "textarea" ? (
    <textarea value={value} onChange={(e) => onChange?.(e.target.value)} rows={4} className={`w-full px-3 py-2 border rounded ${errorClass}`} required={required} placeholder={placeholder} />
  ) : type === "select" ? (
    <select value={value} onChange={(e) => onChange?.(e.target.value)} className={`w-full px-3 py-2 border rounded ${errorClass}`} required={required}>
      {(options || []).map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  ) : (
    <input type={type} value={value} onChange={(e) => onChange?.(e.target.value)} className={`w-full px-3 py-2 border rounded ${errorClass}`} required={required} placeholder={placeholder} />
  ))

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {inputElement}
      {hasError && <p className="text-red-500 text-xs mt-1">{fieldErrors?.[name]?.[0]}</p>}
      {description && <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">{description}</p>}
    </div>
  )
}