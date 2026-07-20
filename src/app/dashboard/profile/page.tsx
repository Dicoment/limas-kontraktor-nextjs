"use client"

import { useState, useEffect } from "react"
import { FaFloppyDisk, FaLock, FaEnvelope, FaUser } from "react-icons/fa6"
import MediaPicker from "@/components/ui/MediaPicker"

// ── SUB-KOMPONEN DI LUAR UTK MENCEGAH LOSING FOCUS ──
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <div className="bg-[#0F2340] px-6 py-4 border-b border-slate-700/50">
      <h2 className="font-bold text-white text-xs uppercase tracking-wider">{title}</h2>
    </div>
    <div className="p-6 space-y-5">{children}</div>
  </div>
)

const InputField = ({
  label,
  value,
  onChange,
  placeholder = "",
  required,
  type = "text",
  icon: Icon,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  type?: string
  icon?: React.ComponentType<{ className?: string }>
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-[#0F2340] uppercase tracking-wide">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Icon className="text-sm" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full ${
          Icon ? "pl-10" : "px-3.5"
        } pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 text-slate-800 transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#E87722]/10 focus:border-[#E87722]`}
      />
    </div>
  </div>
)

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [adminName, setAdminName] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [avatar, setAvatar] = useState("")
  
  // FIX: nambah `id` — dibutuhkan buat UsersSection (biar tau user mana yang
  // "kamu", dan gak nampilin tombol hapus buat akun sendiri).
  const [currentData, setCurrentData] = useState({ id: "", name: "", email: "", avatar: "" })
  
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
        const profileSource = json.data ? json.data : json
        
        const idVal = profileSource.id || ""
        const nameVal = profileSource.name || ""
        const emailVal = profileSource.email || ""
        const avatarVal = profileSource.avatar || ""
        
        setCurrentData({ id: idVal, name: nameVal, email: emailVal, avatar: avatarVal })
        setAdminName(nameVal)
        setAdminEmail(emailVal)
        setAvatar(avatarVal)
      } else {
        setError("Gagal memuat profil dari server.")
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err)
      setError("Gagal terhubung ke layanan API internal.")
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
        body: JSON.stringify({ name: adminName, email: adminEmail, avatar: avatar || null }),
      })

      const json = await res.json()
      if (json.success) {
        setSuccess(true)
        setCurrentData({ ...currentData, name: adminName, email: adminEmail, avatar: avatar })
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-9 h-9 border-2 border-slate-200 border-t-[#E87722] rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500 font-medium font-jakarta">Memuat data profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6 font-jakarta max-w-5xl mx-auto">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-[#0F2340] tracking-tight">Pengaturan Profil</h1>
        <p className="text-xs text-slate-500 mt-1">Kelola data informasi akun administratif dan kredensial keamanan.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs font-medium">{error}</div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-xs font-medium">Perubahan profil berhasil disimpan!</div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-sm">
        <div className="shrink-0">
          <MediaPicker 
            value={avatar} 
            onChange={(val) => {
              setAvatar(val)
              setSuccess(false)
            }} 
            placeholder="Avatar"
            shape="circle"
          />
        </div>
        <div className="flex-1 space-y-1 text-center sm:text-left self-center">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#E87722] bg-orange-50 px-2 py-0.5 rounded border border-orange-200/50">
            Data Saat Ini
          </span>
          <h2 className="text-lg font-bold text-[#0F2340] tracking-tight mt-1.5">
            {currentData.name || "ADMIN LIMAS"}
          </h2>
          <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
            <FaEnvelope className="text-slate-400 text-[11px]" />
            {currentData.email || "admin@limaskontraktor.com"}
          </p>
        </div>
      </div>

      <form onSubmit={handleProfileSubmit}>
        <Section title="Informasi Akun">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Email Baru"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="Masukkan alamat email baru"
              required
              type="email"
              icon={FaEnvelope}
            />
            <InputField
              label="Nama Baru"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="Masukkan nama lengkap baru"
              required
              icon={FaUser}
            />
          </div>
          
          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E87722] hover:bg-[#d0661c] text-white text-xs font-bold rounded-lg transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider"
            >
              <FaFloppyDisk className="text-sm" />
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </Section>
      </form>

      <form onSubmit={handlePasswordSubmit}>
        <Section title="Keamanan / Ganti Password">
          {passwordError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs font-medium">{passwordError}</div>
          )}
          {passwordSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-xs font-medium">Password berhasil diperbarui!</div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Password Saat Ini"
              value={passwordData.currentPassword}
              onChange={(e) => {
                setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))
                setPasswordError("")
              }}
              placeholder="Masukkan sandi saat ini"
              required
              type="password"
            />
            <InputField
              label="Password Baru"
              value={passwordData.newPassword}
              onChange={(e) => {
                setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))
                setPasswordError("")
              }}
              placeholder="Minimal 6 karakter"
              required
              type="password"
            />
            <div className="md:col-span-2">
              <InputField
                label="Konfirmasi Password Baru"
                value={passwordData.confirmPassword}
                onChange={(e) => {
                  setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))
                  setPasswordError("")
                }}
                placeholder="Ulangi kombinasi password baru"
                required
                type="password"
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={changingPassword}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0F2340] hover:bg-[#152e54] text-white text-xs font-bold rounded-lg transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider"
            >
              <FaLock className="text-sm" />
              {changingPassword ? "Memproses..." : "Update Password"}
            </button>
          </div>
        </Section>
      </form>

      {/* Kelola user admin sekarang halaman terpisah: /dashboard/users */}
      <a href="/dashboard/users" className="block bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:border-[#E87722] transition-colors">
        <p className="text-sm font-bold text-[#0F2340]">Kelola User Admin →</p>
        <p className="text-xs text-slate-500 mt-0.5">Lihat semua user, tambah, atau hapus akses admin.</p>
      </a>
    </div>
  )
}