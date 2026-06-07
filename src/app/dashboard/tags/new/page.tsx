"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NewTagClient() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    })
    const json = await res.json()
    if (json.success) {
      router.push("/dashboard/tags")
      router.refresh()
    } else {
      setError(json.error || "Failed to create tag")
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold text-slate-800">New Tag</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input 
            name="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
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
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
            {loading ? "Creating..." : "Create"}
          </button>
          <Link href="/dashboard/tags" className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50">Cancel</Link>
        </div>
      </form>
    </div>
  )
}