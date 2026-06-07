"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function EditTeamClient({ team }: { team: any }) {
  const router = useRouter()
  const [name, setName] = useState(team.name)
  const [position, setPosition] = useState(team.position || "")
  const [bio, setBio] = useState(team.bio || "")
  const [avatar, setAvatar] = useState(team.avatar || "")
  const [email, setEmail] = useState(team.email || "")
  const [phone, setPhone] = useState(team.phone || "")
  const [displayOrder, setDisplayOrder] = useState(team.displayOrder ?? 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch(`/api/teams/${team.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, position, bio, avatar, email, phone, displayOrder }),
    })
    const json = await res.json()
    if (json.success) {
      router.push("/admin/teams")
      router.refresh()
    } else {
      setError(json.error || "Failed to update team member")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold text-slate-800">Edit Team Member</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
      
      <div className="space-y-4">
        <Field label="Name" value={name} onChange={setName} required />
        <Field label="Position" value={position} onChange={setPosition} />
        <Field label="Bio" value={bio} onChange={setBio} type="textarea" />
        <Field label="Avatar URL" value={avatar} onChange={setAvatar} type="url" />
        <Field label="Email" value={email} onChange={setEmail} type="email" />
        <Field label="Phone" value={phone} onChange={setPhone} />
        <Field label="Display Order" value={displayOrder?.toString()} onChange={(v) => setDisplayOrder(parseInt(v) || 0)} type="number" />
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
          {loading ? "Saving..." : "Update"}
        </button>
        <Link href="/admin/teams" className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50 cursor-pointer">Cancel</Link>
      </div>
    </form>
  )
}

function Field({ label, value, onChange, type = "text", required }: 
  { label: string; value?: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  const inputElement = type === "textarea" ? (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded" required={required} />
  ) : (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded" required={required} />
  )

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {inputElement}
    </div>
  )
}