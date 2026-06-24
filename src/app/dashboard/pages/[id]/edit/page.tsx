"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RiErrorWarningLine, RiCloseLine } from "react-icons/ri"

export default function EditPageClient({ pageId, pages }: { pageId: string; pages: { id: string; title: string; slug: string }[] }) {
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
      parentId: formData.get("parentId") || null,
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
    <div className="flex flex-col h-screen" style={{ height: "calc(100vh - 64px)" }}>
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 flex-shrink-0 bg-white z-10">
        <h1 className="text-lg font-bold text-slate-800">Edit Page</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/dashboard/pages")}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            form="page-form"
            className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Memperbarui..." : "Perbarui"}
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
          <form id="page-form" onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input 
                name="title" 
                defaultValue={page?.title || ""} 
                className="w-full px-3 py-2 border border-slate-300 rounded" 
                required 
              />
              <p className="text-[0.8rem] text-gray-500 mt-1">Minimal 3 karakter.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
              <input 
                name="slug" 
                defaultValue={page?.slug || ""} 
                className="w-full px-3 py-2 border border-slate-300 rounded" 
                required 
              />
              <p className="text-[0.8rem] text-gray-500 mt-1">Minimal 2 karakter.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
              <textarea 
                name="content" 
                defaultValue={page?.content || ""} 
                rows={6} 
                className="w-full px-3 py-2 border border-slate-300 rounded" 
              />
              <p className="text-[0.8rem] text-gray-500 mt-1">Minimal 10 karakter.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SEO Title</label>
              <input 
                name="seoTitle" 
                defaultValue={page?.seoTitle || ""} 
                className="w-full px-3 py-2 border border-slate-300 rounded" 
              />
              <p className="text-[0.8rem] text-gray-500 mt-1">Maksimal 60 karakter (Opsional).</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SEO Description</label>
              <textarea 
                name="seoDescription" 
                defaultValue={page?.seoDescription || ""} 
                rows={2} 
                className="w-full px-3 py-2 border border-slate-300 rounded" 
              />
              <p className="text-[0.8rem] text-gray-500 mt-1">Maksimal 160 karakter (Opsional).</p>
            </div>
          </form>
        </div>

        <div className="w-80 border-l border-slate-200 bg-white overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                name="published" 
                defaultChecked={page?.published || false} 
                className="accent-blue-600" 
              />
              <label className="text-sm font-medium text-slate-700">Published</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Parent Page</label>
              <select name="parentId" defaultValue={page?.parentId || ""} className="w-full px-3 py-2 border border-slate-300 rounded">
                <option value="">— No Parent —</option>
                {(pages || []).filter((p) => p.id !== pageId).map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}