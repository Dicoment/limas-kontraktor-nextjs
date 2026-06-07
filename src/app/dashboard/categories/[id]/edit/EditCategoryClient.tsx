"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function EditCategoryClient({ category }: { category: any }) {
  const router = useRouter()
  const [name, setName] = useState(category.name)
  const [slug, setSlug] = useState(category.slug)
  const [type, setType] = useState(category.type)
  const [description, setDescription] = useState(category.description || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch(`/api/categories/${category.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, type, description }),
    })
    const json = await res.json()
    if (json.success) {
      router.push("/admin/categories")
      router.refresh()
    } else {
      setError(json.error || "Failed to update category")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold text-slate-800">Edit Category</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
      
      <div className="space-y-4">
        <Field label="Name" value={name} onChange={setName} required />
        <Field label="Slug" value={slug} onChange={setSlug} required />
        <Field label="Type">
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded">
            <option value="blog">Blog</option>
            <option value="project">Project</option>
          </select>
        </Field>
        <Field label="Description" value={description} onChange={setDescription} type="textarea" />
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
          {loading ? "Saving..." : "Update"}
        </button>
        <Link href="/admin/categories" className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50 cursor-pointer">Cancel</Link>
      </div>
    </form>
  )
}

function Field({ label, value, onChange, type = "text", required, children }: 
  { label: string; value?: string; onChange?: (v: string) => void; type?: string; required?: boolean; children?: React.ReactNode }) {
  const inputElement = children || (type === "textarea" ? (
    <textarea value={value} onChange={(e) => onChange?.(e.target.value)} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded" required={required} />
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