"use client"

import { useState, useEffect } from "react"
import { Save, Lock } from "lucide-react"

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [adminName, setAdminName] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile")
      if (res.ok) {
        const json = await res.json()
        if (json.data) {
          setAdminName(json.data.name || "")
          setAdminEmail(json.data.email || "")
        }
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess(false)

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: adminName }),
      })

      const json = await res.json()
      if (json.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(json.error || "Gagal menyimpan profil")
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menyimpan")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminName(e.target.value)
    setSuccess(false)
  }

  const handlePasswordChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({ ...prev, [key]: e.target.value }))
    setPasswordSuccess(false)
    setPasswordError("")
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess(false)

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError("Semua field password harus diisi")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password baru minimal 6 karakter")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Konfirmasi password tidak cocok")
      return
    }

    setChangingPassword(true)

    try {
      const res = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const json = await res.json()
      if (json.success) {
        setPasswordSuccess(true)
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
        setTimeout(() => setPasswordSuccess(false), 3000)
      } else {
        setPasswordError(json.error || "Gagal mengganti password")
      }
    } catch (err) {
      setPasswordError("Terjadi kesalahan saat mengganti password")
      console.error(err)
    } finally {
      setChangingPassword(false)
    }
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-slate-900 px-5 py-3">
        <h2 className="font-bold text-white text-sm uppercase tracking-wider">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )

  const InputField = ({
    label,
    value,
    onChange,
    placeholder = "",
    required,
    type = "text",
  }: {
    label: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    required?: boolean
    type?: string
  }) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
      />
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-500 font-medium">Memuat profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Profil</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">Profil berhasil diperbarui</div>
      )}

      <form onSubmit={handleProfileSubmit} className="space-y-5">
        <Section title="Informasi Akun">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={adminEmail}
                disabled
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">Email tidak dapat diubah</p>
            </div>
            <InputField
              label="Nama"
              value={adminName}
              onChange={handleNameChange}
              placeholder="Nama lengkap"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 active:bg-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <Save size={16} />
              {saving ? "Menyimpan..." : "Simpan Profil"}
            </button>
          </div>
        </Section>
      </form>

      <form onSubmit={handlePasswordSubmit} className="space-y-5">
        <Section title="Ganti Password">
          {passwordError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{passwordError}</div>
          )}
          {passwordSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">Password berhasil diganti</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Password Saat Ini"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange("currentPassword")}
              placeholder="Masukkan password saat ini"
              required
              type="password"
            />
            <InputField
              label="Password Baru"
              value={passwordData.newPassword}
              onChange={handlePasswordChange("newPassword")}
              placeholder="Masukkan password baru"
              required
              type="password"
            />
            <div className="md:col-span-2">
              <InputField
                label="Konfirmasi Password Baru"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange("confirmPassword")}
                placeholder="Ulangi password baru"
                required
                type="password"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={changingPassword}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 active:bg-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <Lock size={16} />
              {changingPassword ? "Mengganti..." : "Ganti Password"}
            </button>
          </div>
        </Section>
      </form>
    </div>
  )
}
