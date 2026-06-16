"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const MAX_FILE_SIZE = 5 * 1024 * 1024

export default function EditTeamClient({ team }: { team: any }) {
  const router = useRouter()
  const [name, setName] = useState(team.name)
  const [position, setPosition] = useState(team.position || "")
  const [bio, setBio] = useState(team.bio || "")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState(team.avatar || "")
  const [email, setEmail] = useState(team.email || "")
  const [phone, setPhone] = useState(team.phone || "")
  const [displayOrder, setDisplayOrder] = useState(team.displayOrder ?? 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (avatarFile && avatarFile.size > MAX_FILE_SIZE) {
      setError(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`)
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("position", position || "")
    formData.append("bio", bio || "")
    formData.append("email", email || "")
    formData.append("phone", phone || "")
    formData.append("displayOrder", displayOrder?.toString() || "0")
    
    if (avatarFile) {
      formData.append("avatar", avatarFile)
    } else if (avatarPreview) {
      formData.append("avatarUrl", avatarPreview)
    }

    const res = await fetch(`/api/teams/${team.id}`, {
      method: "POST",
      body: formData,
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl" encType="multipart/form-data">
      <h1 className="text-xl font-bold text-slate-800">Edit Team Member</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
      
      <div className="space-y-4">
        <Field label="Name" value={name} onChange={setName} required />
        <Field label="Position" value={position} onChange={setPosition} />
        <Field label="Bio" value={bio} onChange={setBio} type="textarea" />
        <Field label="Avatar">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleAvatarChange}
            className="w-full px-3 py-2 border border-slate-300 rounded" 
          />
          {avatarPreview && (
            <img src={avatarPreview} alt="Preview" className="mt-2 h-20 object-cover rounded" />
          )}
        </Field>
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