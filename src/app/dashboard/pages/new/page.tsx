"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RiErrorWarningLine, RiCloseLine } from "react-icons/ri"

export default function NewPageClient({ pages }: { pages: { id: string; title: string; slug: string }[] }) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")
  const [published, setPublished] = useState(false)
  const [parentId, setParentId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, content, seoTitle, seoDescription, published, parentId: parentId || null }),
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
    <div className="flex flex-col h-screen" style={{ height: "calc(100vh - 64px)" }}>
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 flex-shrink-0 bg-white z-10">
        <h1 className="text-lg font-bold text-slate-800">New Page</h1>
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
            disabled={loading}
            className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Menyimpan..." : "Simpan"}
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
          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            <Field label="Title" value={title} onChange={setTitle} required description="Minimal 3 karakter." />
            <Field label="Slug" value={slug} onChange={setSlug} required description="Minimal 2 karakter." />
            <Field label="Content" value={content} onChange={setContent} type="textarea" required description="Minimal 10 karakter." />
            <Field label="SEO Title" value={seoTitle} onChange={setSeoTitle} description="Maksimal 60 karakter (Opsional)." />
            <Field label="SEO Description" value={seoDescription} onChange={setSeoDescription} type="textarea" description="Maksimal 160 karakter (Opsional)." />
          </form>
        </div>

        <div className="w-80 border-l border-slate-200 bg-white overflow-y-auto">
          <div className="p-4 space-y-4">
            <Field label="Published">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-blue-600" />
            </Field>
            <Field label="Parent Page" value={parentId} onChange={setParentId}>
              <select value={parentId} onChange={(e) => setParentId(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded">
                <option value="">— No Parent —</option>
                {(pages || []).map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = "text", required, description, children }:
  { label: string; value?: string; onChange?: (v: string) => void; type?: string; required?: boolean; description?: string; children?: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children || (type === "textarea" ? (
        <textarea value={value} onChange={(e) => onChange?.(e.target.value)} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded" required={required} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange?.(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded" required={required} />
      ))}
      {description && <p className="text-[0.8rem] text-gray-500 mt-1">{description}</p>}
    </div>
  )
}