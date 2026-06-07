"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewPageClient() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, content, seoTitle, seoDescription, published }),
    })
    const json = await res.json()
    if (json.success) {
      router.push("/dashboard/pages")
      router.refresh()
    } else {
      setError(json.error || "Failed to create page")
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-xl font-bold text-slate-800">New Page</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input 
            name="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full px-3 py-2 border border-slate-300 rounded" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
          <input 
            name="slug" 
            value={slug} 
            onChange={(e) => setSlug(e.target.value)} 
            className="w-full px-3 py-2 border border-slate-300 rounded" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
          <textarea 
            name="content" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            rows={6} 
            className="w-full px-3 py-2 border border-slate-300 rounded" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">SEO Title</label>
          <input 
            name="seoTitle" 
            value={seoTitle} 
            onChange={(e) => setSeoTitle(e.target.value)} 
            className="w-full px-3 py-2 border border-slate-300 rounded" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">SEO Description</label>
          <textarea 
            name="seoDescription" 
            value={seoDescription} 
            onChange={(e) => setSeoDescription(e.target.value)} 
            rows={2} 
            className="w-full px-3 py-2 border border-slate-300 rounded" 
          />
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={published} 
            onChange={(e) => setPublished(e.target.checked)} 
            className="accent-blue-600" 
          />
          <label className="text-sm font-medium text-slate-700">Published</label>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
            {loading ? "Creating..." : "Create"}
          </button>
          <a href="/dashboard/pages" className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50">Cancel</a>
        </div>
      </form>
    </div>
  )
}