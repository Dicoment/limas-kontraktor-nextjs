"use client"

import { useState, useEffect } from "react"
import { 
  Save, 
  Camera, 
  Share2, 
  Video, 
  Building2, 
  PhoneCall, 
  Share, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from "lucide-react"

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
  google_analytics_id: "",
  google_search_console_code: "",
}

type SettingsFormData = typeof DEFAULT_SETTINGS

function Section({ title, icon: Icon, children }: { title: string; icon?: React.ComponentType<{ size?: number; className?: string }>; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="bg-slate-900 px-6 py-4 flex items-center gap-3">
        {Icon && <Icon size={18} className="text-indigo-400" />}
        <h2 className="font-semibold text-white text-sm uppercase tracking-wider">{title}</h2>
      </div>
      <div className="p-6 space-y-5">{children}</div>
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
  description,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder?: string
  required?: boolean
  textarea?: boolean
  description?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={3}
          className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      )}
      {description && <p className="text-xs text-slate-500 leading-relaxed">{description}</p>}
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
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">{label}</label>
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-3.5 py-2.5 pr-11 bg-slate-50/50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
        {value ? (
          <a
            href={getUrl(value)}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-2 p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-md transition-colors"
            title="Buka Tautan"
          >
            <Icon size={16} />
          </a>
        ) : (
          <div className="absolute right-2 p-1.5 bg-slate-100 rounded-md">
            <Icon size={16} className="text-slate-400" />
          </div>
        )}
      </div>
    </div>
  )
}

const TikTokIcon = (props: { size?: number; className?: string }) => (
  <svg width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="currentColor" className={props.className}>
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
      const settingsArray = Object.entries(formData)
        .filter(([, value]) => value.trim() !== "")
        .map(([key, value]) => ({ key, value }))

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
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm font-medium text-slate-500">Memuat pengaturan...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans py-4">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pengaturan Website</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola informasi perusahaan, kontak, serta konfigurasi SEO.</p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3.5 rounded-xl text-sm shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">{error}</div>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3.5 rounded-xl text-sm shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Pengaturan berhasil diperbarui dan disimpan.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Section title="Informasi Perusahaan" icon={Building2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Nama Perusahaan"
              value={formData.company_name}
              onChange={handleInputChange("company_name")}
              required
              description="Tidak boleh kosong (minimal 1 karakter)."
            />
          </div>
          <InputField
            label="Deskripsi"
            value={formData.company_description}
            onChange={handleInputChange("company_description")}
            textarea
            required
            description="Tidak boleh kosong (minimal 1 karakter)."
          />
          <InputField
            label="Alamat"
            value={formData.company_address}
            onChange={handleInputChange("company_address")}
            textarea
            required
            description="Opsional."
          />
        </Section>

        <Section title="Kontak & Komunikasi" icon={PhoneCall}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <InputField
              label="Nomor Telepon 1 (WhatsApp)"
              value={formData.contact_phone1}
              onChange={handleInputChange("contact_phone1")}
              placeholder="0821-xxxx-xxxx"
              required
              description="Format nomor bebas, maks. 255 karakter."
            />
            <InputField
              label="Nomor Telepon 2"
              value={formData.contact_phone2}
              onChange={handleInputChange("contact_phone2")}
              placeholder="0812-xxxx-xxxx"
              description="Opsional."
            />
            <InputField
              label="Email Perusahaan"
              value={formData.contact_email}
              onChange={handleInputChange("contact_email")}
              placeholder="email@perusahaan.com"
              required
              description="Format email harus valid jika diisi."
            />
          </div>
        </Section>

        <Section title="Media Sosial" icon={Share}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

        <Section title="SEO & Analytics" icon={BarChart3}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Google Analytics ID (GA4)"
              value={formData.google_analytics_id}
              onChange={handleInputChange("google_analytics_id")}
              placeholder="G-XXXXXXXXXX"
              description="Measurement ID dari GA4. Kosongkan jika belum dipasang."
            />
            <InputField
              label="Google Search Console Verification Code"
              value={formData.google_search_console_code}
              onChange={handleInputChange("google_search_console_code")}
              placeholder="Kode verifikasi HTML tag"
              description="Isi hanya string kodenya (bukan tag <meta> lengkap)."
            />
          </div>
        </Section>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 active:bg-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow duration-150"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Simpan Pengaturan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}