"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

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
  const [coverImage, setCoverImage] = useState(post.coverImage || "")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch(`/api/blog-posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, content, excerpt, coverImage, seoTitle, seoDescription, published, publishedAt: publishedAt || null, categoryIds, tagIds }),
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      <h1 className="text-xl font-bold text-slate-800">Edit Blog Post</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <Field label="Title" value={title} onChange={setTitle} required />
          <Field label="Slug" value={slug} onChange={setSlug} required />
          <Field label="Cover Image URL" value={coverImage} onChange={setCoverImage} type="url" />
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