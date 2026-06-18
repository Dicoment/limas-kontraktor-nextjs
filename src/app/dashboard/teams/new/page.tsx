"use client"

import { useState } from "react"
import MediaPicker from "@/components/ui/MediaPicker"

const MAX_FILE_SIZE = 5 * 1024 * 1024

export default function NewTeamPage() {
  const [name, setName] = useState("")
  const [position, setPosition] = useState("")
  const [bio, setBio] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarUrl, setAvatarUrl] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [displayOrder, setDisplayOrder] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("name", name)
    formData.append("position", position)
    formData.append("bio", bio)
    formData.append("email", email)
    formData.append("phone", phone)
    formData.append("displayOrder", displayOrder.toString())
    
    if (avatarFile) {
      formData.append("avatar", avatarFile)
    } else if (avatarUrl) {
      formData.append("avatarUrl", avatarUrl)
    }

    const res = await fetch("/api/teams", {
      method: "POST",
      body: formData,
    })
    const json = await res.json()
    if (json.success) {
      window.location.href = "/dashboard/teams"
    } else {
      setError(json.error || "Failed to create team member")
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold text-slate-800">New Team Member</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4" encType="multipart/form-data">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input name="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded" required />
          <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">Minimal 2 karakter, maksimal 100 karakter.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
          <input name="position" value={position} onChange={(e) => setPosition(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded" />
          <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">Maksimal 100 karakter (Opsional).</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
          <textarea name="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded" />
          <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">Maksimal 5.000 karakter (Opsional).</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Avatar</label>
          <MediaPicker 
            value={avatarUrl} 
            onChange={(url) => {
              setAvatarUrl(url)
              setAvatarFile(null)
            }} 
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => {
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
              setAvatarUrl(URL.createObjectURL(file))
              setError("")
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded mt-2" 
          />
          {avatarUrl && (
            <img src={avatarUrl} alt="Preview" className="mt-2 h-20 object-cover rounded" />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full px-3 py-2 border border-slate-300 rounded" />
          <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">Format email tidak valid (Opsional).</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded" />
          <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">8-20 digit. Hanya angka, plus (+), strip (-), dan spasi yang diizinkan (Opsional).</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
          <input name="displayOrder" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-300 rounded" />
          <p className="text-[0.8rem] text-muted-foreground text-gray-500 mt-1">Bilangan bulat. Minimal 0, maksimal 999. Default: 0.</p>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">{loading ? "Creating..." : "Create"}</button>
          <a href="/dashboard/teams" className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50">Cancel</a>
        </div>
      </form>
    </div>
  )
}