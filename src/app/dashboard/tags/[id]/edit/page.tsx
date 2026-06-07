"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EditTagClient({ tagId }: { tagId: string }) {
  const router = useRouter()
  const [tag, setTag] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchTag()
  }, [tagId])

  async function fetchTag() {
    try {
      const res = await fetch(`/api/tags/${tagId}`)
      const json = await res.json()
      if (json.success) {
        setTag(json.data)
      } else {
        setError(json.error || "Tag not found")
      }
    } catch (err) {
      setError("Failed to fetch tag")
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
      name: formData.get("name"),
      slug: formData.get("slug"),
    }

    const res = await fetch(`/api/tags/${tagId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    if (json.success) {
      router.push("/dashboard/tags")
      router.refresh()
    } else {
      setError(json.error || "Failed to update tag")
    }
    setSubmitting(false)
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (error && !tag) return <div className="p-6 text-red-500">{error}</div>

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold text-slate-800">Edit Tag</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input 
            name="name" 
            defaultValue={tag?.name || ""} 
            className="w-full px-3 py-2 border border-slate-300 rounded" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
          <input 
            name="slug" 
            defaultValue={tag?.slug || ""} 
            className="w-full px-3 py-2 border border-slate-300 rounded" 
            required 
          />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
            {submitting ? "Updating..." : "Update"}
          </button>
          <a href="/dashboard/tags" className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50">Cancel</a>
        </div>
      </form>
    </div>
  )
}