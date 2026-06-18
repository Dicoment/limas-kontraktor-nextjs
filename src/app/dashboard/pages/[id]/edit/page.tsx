"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EditPageClient({ pageId }: { pageId: string }) {
  const router = useRouter()
  const [page, setPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPage()
  }, [pageId])

  async function fetchPage() {
    setLoading(true)
    try {
      const res = await fetch(`/api/pages/${pageId}`)
      const json = await res.json()
      if (json.success) {
        setPage(json.data)
      } else {
        setError(json.error || "Page not found")
      }
    } catch (err) {
      setError("Failed to fetch page")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const body: any = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      content: formData.get("content"),
      seoTitle: formData.get("seoTitle") || null,
      seoDescription: formData.get("seoDescription") || null,
      published: formData.get("published") === "on",
    }

    const res = await fetch(`/api/pages/${pageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    if (json.success) {
      router.push("/dashboard/pages")
      router.refresh()
    } else {
      setError(json.error || "Failed to update page")
    }
    setSubmitting(false)
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (error && !page) return <div className="p-6 text-red-500">{error}</div>

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-xl font-bold text-slate-800">Edit Page</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input 
            name="title" 
            defaultValue={page?.title || ""} 
            className="w-full px-3 py-2 border border-slate-300 rounded" 
            required 
          />
          <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">Minimal 3 karakter, maksimal 200 karakter.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
          <input 
            name="slug" 
            defaultValue={page?.slug || ""} 
            className="w-full px-3 py-2 border border-slate-300 rounded" 
            required 
          />
          <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">Minimal 2 karakter, maksimal 100 karakter. Hanya huruf kecil, angka, dan strip.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
          <textarea 
            name="content" 
            defaultValue={page?.content || ""} 
            rows={6} 
            className="w-full px-3 py-2 border border-slate-300 rounded" 
          />
          <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">Minimal 10 karakter, maksimal 100.000 karakter.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">SEO Title</label>
          <input 
            name="seoTitle" 
            defaultValue={page?.seoTitle || ""} 
            className="w-full px-3 py-2 border border-slate-300 rounded" 
          />
          <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">Maksimal 60 karakter (Opsional).</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">SEO Description</label>
          <textarea 
            name="seoDescription" 
            defaultValue={page?.seoDescription || ""} 
            rows={2} 
            className="w-full px-3 py-2 border border-slate-300 rounded" 
          />
          <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">Maksimal 160 karakter (Opsional).</p>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            name="published" 
            defaultChecked={page?.published || false} 
            className="accent-blue-600" 
          />
          <label className="text-sm font-medium text-slate-700">Published</label>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
            {submitting ? "Updating..." : "Update"}
          </button>
          <a href="/dashboard/pages" className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50">Cancel</a>
        </div>
      </form>
    </div>
  )
}