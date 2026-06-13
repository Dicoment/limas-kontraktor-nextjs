"use client"

import { useState, useEffect } from "react"
import { Save, Camera, Share2, Video } from "lucide-react"

const DEFAULT_SETTINGS = {
  company_name: "LIMAS KONTRAKTOR",
  company_description: "LIMAS KONTRAKTOR merupakan brand dari CV Listiya Mandiri Jaya Steel, perusahaan yang bergerak di bidang jasa desain dan konstruksi pembangunan.",
  company_address: "Jl. Mawar IV No.70A, RT.001/RW.007, Kali Baru, Kecamatan Medan Satria, Kota Bekasi, Jawa Barat 17183.",
  contact_phone1: "0823-2072-1150",
  contact_phone2: "0812-8767-2654",
  contact_email: "cvlistiyamandirijayasteel70a@gmail.com",
  social_instagram: "limas.kontraktor",
  social_facebook: "Limas Kontraktor",
  social_tiktok: "LIMAS KONTRAKTOR",
  social_youtube: "Limas Kontraktor",
}

type SettingsFormData = typeof DEFAULT_SETTINGS

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-slate-900 px-5 py-3">
        <h2 className="font-bold text-white text-sm uppercase tracking-wider">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

function InputField({
  label,
  value,
  onChange,
  placeholder = "",
  required,
  textarea,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder?: string
  required?: boolean
  textarea?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={3}
          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-y"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        />
      )}
    </div>
  )
}

function SocialInputField({
  label,
  value,
  onChange,
  placeholder = "",
  icon: Icon,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}) {
  const getUrl = (val: string) => {
    if (!val) return "#"
    return val.startsWith("http") ? val : `https://${val}`
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 pr-12 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        />
        {value ? (
          <a
            href={getUrl(value)}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
          >
            <Icon size={18} className="text-blue-600" />
          </a>
        ) : (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gray-50 rounded-md">
            <Icon size={18} className="text-gray-300" />
          </div>
        )}
      </div>
    </div>
  )
}

const TikTokIcon = (props: { size?: number; className?: string }) => (
  <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
  </svg>
)

export default function SettingsPage() {
  const [formData, setFormData] = useState<SettingsFormData>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings")
      if (res.ok) {
        const json = await res.json()
        if (json.data && json.data.data) {
          setFormData(prev => ({
            ...prev,
            ...json.data.data,
          }))
        }
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (key: keyof SettingsFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [key]: e.target.value }))
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess(false)

    try {
      const settingsArray = Object.entries(formData).map(([key, value]) => ({ key, value }))

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsArray }),
      })

      const json = await res.json()
      
      if (res.ok && json.success !== false) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        let errorMsg = json.error || json.message || "Gagal menyimpan pengaturan"
        if (json.errors) {
          const fieldErrors = Object.entries(json.errors)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
            .join(" | ")
          errorMsg = `${errorMsg} - ${fieldErrors}`
        }
        setError(errorMsg)
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menyimpan")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-500 font-medium">Memuat pengaturan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Pengaturan</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">Pengaturan berhasil disimpan</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Section title="Informasi Perusahaan">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Nama Perusahaan"
              value={formData.company_name}
              onChange={handleInputChange("company_name")}
              required
            />
          </div>
          <InputField
            label="Deskripsi"
            value={formData.company_description}
            onChange={handleInputChange("company_description")}
            textarea
            required
          />
          <InputField
            label="Alamat"
            value={formData.company_address}
            onChange={handleInputChange("company_address")}
            textarea
            required
          />
        </Section>

        <Section title="Kontak">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Nomor Telepon 1"
              value={formData.contact_phone1}
              onChange={handleInputChange("contact_phone1")}
              placeholder="0821-xxxx-xxxx"
              required
            />
            <InputField
              label="Nomor Telepon 2"
              value={formData.contact_phone2}
              onChange={handleInputChange("contact_phone2")}
              placeholder="0812-xxxx-xxxx"
            />
            <InputField
              label="Email"
              value={formData.contact_email}
              onChange={handleInputChange("contact_email")}
              placeholder="email@perusahaan.com"
              required
            />
          </div>
        </Section>

        <Section title="Media Sosial">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SocialInputField
              label="Instagram"
              value={formData.social_instagram}
              onChange={handleInputChange("social_instagram")}
              placeholder="@username"
              icon={Camera}
            />
            <SocialInputField
              label="Facebook"
              value={formData.social_facebook}
              onChange={handleInputChange("social_facebook")}
              placeholder="Page name"
              icon={Share2}
            />
            <SocialInputField
              label="TikTok"
              value={formData.social_tiktok}
              onChange={handleInputChange("social_tiktok")}
              placeholder="@username"
              icon={TikTokIcon}
            />
            <SocialInputField
              label="YouTube"
              value={formData.social_youtube}
              onChange={handleInputChange("social_youtube")}
              placeholder="channel name"
              icon={Video}
            />
          </div>
        </Section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 active:bg-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <Save size={16} />
            {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </form>
    </div>
  )
}