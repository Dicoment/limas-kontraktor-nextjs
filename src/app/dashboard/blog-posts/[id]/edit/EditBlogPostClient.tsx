"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import MediaPicker from "@/components/ui/MediaPicker"
import { RiErrorWarningLine, RiCloseLine } from "react-icons/ri"

const MAX_FILE_SIZE = 5 * 1024 * 1024

export default function EditBlogPostClient({
  post,
  categories,
  tags,
  initialCategoryIds,
  initialTagIds,
}: {
  post: any
  categories: { id: string; name: string; slug: string; type: string }[]
  tags: { id: string; name: string; slug: string }[]
  initialCategoryIds: string[]
  initialTagIds: string[]
}) {
  const router = useRouter()
  const [title, setTitle] = useState(post.title)
  const [slug, setSlug] = useState(post.slug)
  const [content, setContent] = useState(post.content)
  const [excerpt, setExcerpt] = useState(post.excerpt || "")
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState(post.coverImage || "")
  const [seoTitle, setSeoTitle] = useState(post.seoTitle || "")
  const [seoDescription, setSeoDescription] = useState(post.seoDescription || "")
  const [published, setPublished] = useState(post.published)
  const [publishedAt, setPublishedAt] = useState(post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : "")
  const [categoryIds, setCategoryIds] = useState<string[]>(initialCategoryIds)
  const [tagIds, setTagIds] = useState<string[]>(initialTagIds)
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

    if (coverImageFile && coverImageFile.size > MAX_FILE_SIZE) {
      setError(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`)
      setLoading(false)
      return
    }

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
    } else if (coverImageUrl) {
      formData.append("coverImage", coverImageUrl)
    }

    const res = await fetch(`/api/blog-posts/${post.id}`, {
      method: "PUT",
      body: formData,
    })
    const json = await res.json()
    if (json.success) {
      router.push("/dashboard/blog-posts")
      router.refresh()
    } else {
      if (json.fieldErrors) {
        setFieldErrors(json.fieldErrors)
      }
      setError(json.error || "Failed to update post")
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-screen" style={{ height: "calc(100vh - 64px)" }}>
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 flex-shrink-0 bg-white z-10">
        <h1 className="text-lg font-bold text-slate-800">Edit Blog Post</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/dashboard/blog-posts")}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Menyimpan..." : "Perbarui"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-2 flex items-center gap-2 text-red-700 text-xs font-medium flex-shrink-0 z-20">
          <RiErrorWarningLine size={14} /> {error}
          <button
            type="button"
            onClick={() => setError("")}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <RiCloseLine size={14} />
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden min-h-0">
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 p-6">
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6 max-w-3xl">
            <Field label="Title" value={title} onChange={setTitle} required description="Minimal 3 karakter." fieldName="title" fieldErrors={fieldErrors} />
            <Field label="Slug" value={slug} onChange={setSlug} required description="Minimal 3 karakter." fieldName="slug" fieldErrors={fieldErrors} />
            <Field label="Content" value={content} onChange={setContent} type="textarea" required description="Minimal 10 karakter." fieldName="content" fieldErrors={fieldErrors} />
            <Field label="Excerpt" value={excerpt} onChange={setExcerpt} type="textarea" description="Opsional." fieldName="excerpt" fieldErrors={fieldErrors} />
            <Field label="SEO Description" value={seoDescription} onChange={setSeoDescription} type="textarea" description="Maksimal 160 karakter (Opsional)." fieldName="seoDescription" fieldErrors={fieldErrors} />
          </form>
        </div>

        <div className="w-80 border-l border-slate-200 bg-white overflow-y-auto">
          <div className="p-4 space-y-4">
            <Field label="Published" name="published">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-blue-600" />
            </Field>
            <Field label="Publish Date" name="publishedAt">
              <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded" />
            </Field>
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
      </div>
    </div>
  )
}

function Field({ label, name, value, onChange, type = "text", required, description, fieldName, fieldErrors, children }:
  { label: string; name?: string; value?: string; onChange?: (v: string) => void; type?: string; required?: boolean; description?: string; fieldName?: string; fieldErrors?: Record<string, string[]>; children?: React.ReactNode }) {
  const hasError = !!fieldName && (fieldErrors?.[fieldName]?.length ?? 0) > 0
  const errorClass = hasError ? "border-red-500" : "border-slate-300"
  
  const inputElement = children || (type === "textarea" ? (
    <textarea value={value} onChange={(e) => onChange?.(e.target.value)} rows={4} className={`w-full px-3 py-2 border rounded ${errorClass}`} required={required} />
  ) : type === "select" ? (
    <select value={value} onChange={(e) => onChange?.(e.target.value)} className={`w-full px-3 py-2 border rounded ${errorClass}`} required={required}>
      {Array.isArray(children) ? children.map((opt: string) => <option key={opt} value={opt}>{opt}</option>) : null}
    </select>
  ) : (
    <input type={type} value={value} onChange={(e) => onChange?.(e.target.value)} className={`w-full px-3 py-2 border rounded ${errorClass}`} required={required} />
  ))

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {inputElement}
      {hasError && <p className="text-red-500 text-xs mt-1">{fieldErrors?.[fieldName]?.[0]}</p>}
      {description && <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">{description}</p>}
    </div>
  )
}