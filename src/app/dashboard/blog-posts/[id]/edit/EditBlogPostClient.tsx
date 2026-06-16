"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

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
  const [imagePreview, setImagePreview] = useState(post.coverImage || "")
  const [seoTitle, setSeoTitle] = useState(post.seoTitle || "")
  const [seoDescription, setSeoDescription] = useState(post.seoDescription || "")
  const [published, setPublished] = useState(post.published)
  const [publishedAt, setPublishedAt] = useState(post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : "")
  const [categoryIds, setCategoryIds] = useState<string[]>(initialCategoryIds)
  const [tagIds, setTagIds] = useState<string[]>(initialTagIds)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
    setImagePreview(URL.createObjectURL(file))
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
    } else if (imagePreview) {
      formData.append("coverImage", imagePreview)
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
      setError(json.error || "Failed to update post")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl" encType="multipart/form-data">
      <h1 className="text-xl font-bold text-slate-800">Edit Blog Post</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <Field label="Title" value={title} onChange={setTitle} required />
          <Field label="Slug" value={slug} onChange={setSlug} required />
          <Field label="Cover Image">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-slate-300 rounded" 
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 h-20 object-cover rounded" />
            )}
          </Field>
          <Field label="SEO Title" value={seoTitle} onChange={setSeoTitle} />
          <Field label="Excerpt" value={excerpt} onChange={setExcerpt} type="textarea" />
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
              {categories.filter((c) => c.type === "blog").map((c) => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={categoryIds.includes(c.id)} onChange={() => toggleCategory(c.id)} className="accent-blue-600" />
                  <span className="text-sm">{c.name}</span>
                </label>
              ))}
            </div>
          </Field>
          <Field label="Tags" name="tagIds">
            <div className="border border-slate-300 rounded p-2 max-h-40 overflow-y-auto space-y-1">
              {tags.map((t) => (
                <label key={t.id} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={tagIds.includes(t.id)} onChange={() => toggleTag(t.id)} className="accent-blue-600" />
                  <span className="text-sm">{t.name}</span>
                </label>
              ))}
            </div>
          </Field>
        </div>
      </div>
      <Field label="Content" value={content} onChange={setContent} type="textarea" required />
      <Field label="SEO Description" value={seoDescription} onChange={setSeoDescription} type="textarea" />

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
          {loading ? "Saving..." : "Update"}
        </button>
        <a href="/dashboard/blog-posts" className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50 cursor-pointer">Cancel</a>
      </div>
    </form>
  )
}

function Field({ label, name, value, onChange, type = "text", required, children }: 
  { label: string; name?: string; value?: string; onChange?: (v: string) => void; type?: string; required?: boolean; children?: React.ReactNode }) {
  const inputElement = children || (type === "textarea" ? (
    <textarea value={value} onChange={(e) => onChange?.(e.target.value)} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded" required={required} />
  ) : (
    <input type={type} value={value} onChange={(e) => onChange?.(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded" required={required} />
  ))

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {inputElement}
    </div>
  )
}