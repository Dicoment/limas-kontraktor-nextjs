"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import MediaPicker from "@/components/ui/MediaPicker"
import Button from "@/components/ui/Button"
import { FaRegTrashCan, FaStar, FaYoutube, FaLink, FaCircleCheck } from "react-icons/fa6"

type Testimonial = {
  id: string
  clientName: string
  content: string
  rating: number
  platform: "MANUAL" | "SOCIAL_MEDIA"
  sourceUrl: string | null
  avatar: string | null
  projectId: string | null
  published: boolean
}

type Project = { id: string; title: string }

export default function TestimonialFormClient({
  testimonial,
  projects,
  createTestimonial,
  updateTestimonial,
}: {
  testimonial?: Testimonial
  projects: Project[]
  createTestimonial: (data: any) => Promise<any>
  updateTestimonial: (id: string, data: any) => Promise<any>
}) {
  const router = useRouter()
  const isEdit = !!testimonial

  const [avatar, setAvatar] = useState(testimonial?.avatar || "")
  const [clientName, setClientName] = useState(testimonial?.clientName || "")
  const [rating, setRating] = useState(testimonial?.rating ?? 5)
  const [content, setContent] = useState(testimonial?.content || "")
  const [platform, setPlatform] = useState<"MANUAL" | "SOCIAL_MEDIA">(testimonial?.platform || "MANUAL")
  const [sourceUrl, setSourceUrl] = useState(testimonial?.sourceUrl || "")
  const [projectId, setProjectId] = useState(testimonial?.projectId || "")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [showConfirm, setShowConfirm] = useState(false)
  const [successState, setSuccessState] = useState<null | "published" | "draft">(null)

  const saveTestimonial = async (published: boolean) => {
    setLoading(true)
    setError("")

    const payload = {
      clientName,
      content,
      rating: Number(rating),
      platform,
      sourceUrl: sourceUrl || null,
      avatar: avatar || null,
      projectId: projectId || null,
      published,
    }

    try {
      if (isEdit) {
        await updateTestimonial(testimonial!.id, payload)
      } else {
        await createTestimonial(payload)
      }
      setSuccessState(published ? "published" : "draft")
    } catch (err) {
      console.error("Gagal menyimpan testimonial:", err)
      setError(isEdit ? "Gagal memperbarui testimoni." : "Gagal membuat testimoni.")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = () => saveTestimonial(false)
  const handlePublishClick = () => setShowConfirm(true)
  const confirmPublish = () => {
    setShowConfirm(false)
    saveTestimonial(true)
  }

  // ── LAYAR SUKSES ──
  if (successState) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 font-jakarta">
        <div className="max-w-md w-full text-center space-y-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="flex justify-center">
            <FaCircleCheck size={52} className="text-emerald-500" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-slate-900">
              {successState === "published" ? "Testimoni berhasil dipublikasikan!" : "Draft berhasil disimpan!"}
            </h2>
            <p className="text-sm text-slate-500">
              {successState === "published"
                ? "Testimoni ini sekarang sudah tampil di halaman website."
                : "Testimoni disimpan sebagai draft dan belum tampil di website."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            
              <a href="/dashboard/testimonials"
              className="flex-1 px-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 text-center"
            >
              Kembali ke Daftar
            </a>
            
              <a href="/dashboard/testimonials/new"
              className="flex-1 px-4 py-2.5 text-sm font-semibold bg-[#E87722] hover:bg-[#d66a1a] text-white rounded-md text-center"
            >
              + Tambah Testimonial Baru
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 font-jakarta relative">
      <h1 className="text-lg font-bold text-slate-900 tracking-tight">{isEdit ? "Edit" : "New"} Testimonial</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 items-start">
        {/* KOLOM KIRI: form data */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 space-y-5">
          {/* Avatar + Nama Klien + Rating — stack di mobile, sejajar di layar lebih lebar */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="shrink-0 self-center sm:self-start">
              <MediaPicker value={avatar} onChange={setAvatar} placeholder="Avatar" />
            </div>
            <div className="flex-1 w-full min-w-0 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Nama Klien</label>
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
                  placeholder="cth. PT Inovasi Digital"
                  required
                  minLength={2}
                  maxLength={100}
                />
                <p className="text-[11px] text-slate-400 mt-1">Nama orang/perusahaan pemberi testimoni.</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Rating</label>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i)}
                        className="cursor-pointer"
                        aria-label={`${i} bintang`}
                      >
                        <FaStar
                          size={20}
                          className={i <= rating ? "text-[#F2C230] fill-[#F2C230]" : "text-slate-200"}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">{rating} / 5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Konten */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Konten Testimoni</label>
            <div className="relative bg-slate-50 border-l-[3px] border-[#E87722] rounded-r-md pl-9 pr-4 py-3">
              <span className="absolute left-2 top-0 text-3xl text-[#e2c9b8] font-serif leading-none select-none">
                &ldquo;
              </span>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full bg-transparent border-none outline-none resize-y text-sm text-slate-800"
                placeholder="Limas memberikan solusi desain interior yang luar biasa untuk kantor kami."
                required
                minLength={10}
                maxLength={5000}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Minimal 10 karakter, maksimal 5.000 karakter.</p>
          </div>

          {/* Platform */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Platform</label>
            <div className="flex border border-slate-200 rounded-md overflow-hidden text-sm">
              <button
                type="button"
                onClick={() => setPlatform("MANUAL")}
                className={`flex-1 py-2 px-2 cursor-pointer text-center ${
                  platform === "MANUAL" ? "bg-[#0F172A] text-white" : "bg-white text-slate-500"
                }`}
              >
                Manual
              </button>
              <button
                type="button"
                onClick={() => setPlatform("SOCIAL_MEDIA")}
                className={`flex-1 py-2 px-2 cursor-pointer text-center ${
                  platform === "SOCIAL_MEDIA" ? "bg-[#0F172A] text-white" : "bg-white text-slate-500"
                }`}
              >
                Social Media / Video
              </button>
            </div>
          </div>

          {/* URL Video/Sumber */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">URL Video / Sumber</label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
              placeholder="https://youtube.com/watch?v=..."
              maxLength={500}
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Opsional. Lihat panduan di kanan untuk cara ambil link yang benar.
            </p>
          </div>

          {/* Proyek yang Dikerjakan */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Proyek yang Dikerjakan</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
            >
              <option value="">— Tidak ada —</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Opsional. Kaitkan testimoni ini dengan proyek Limas yang sudah selesai.
            </p>
          </div>

          {/* Tombol aksi — stack di mobile, sejajar di layar lebih lebar */}
          <div className="flex flex-col sm:flex-row gap-3 border-t border-slate-100 pt-5">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={handleSaveDraft}
              className="w-full sm:w-auto justify-center"
            >
              {loading ? "Menyimpan..." : "Simpan Draft"}
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={loading}
              onClick={handlePublishClick}
              className="w-full sm:w-auto justify-center"
            >
              {loading ? "Menyimpan..." : "Publikasikan"}
            </Button>
            
             <a href="/dashboard/testimonials"
              className="px-4 py-2 text-sm border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600 text-center w-full sm:w-auto"
            >
              Batal
            </a>
          </div>
        </div>

        {/* KOLOM KANAN: panduan pengisian link */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 sm:p-5 space-y-4">
          <p className="text-[11px] font-bold text-[#E87722] uppercase tracking-wider">Cara Ambil Link Video</p>

          <div className="flex gap-3">
            <FaYoutube size={18} className="text-[#0F172A] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-800 mb-1">YouTube — didukung penuh</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Buka video, klik Share, lalu salin link biasa. Video akan langsung autoplay saat diklik di halaman
                testimoni.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <FaLink size={18} className="text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-800 mb-1">TikTok, Instagram, Facebook</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tempel link postingan seperti biasa. Untuk saat ini video dari platform ini belum bisa autoplay
                langsung di halaman — akan tampil sebagai tautan ke konten aslinya.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL KONFIRMASI PUBLIKASI */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Yakin ingin publikasikan?</h3>
            <p className="text-sm text-slate-500">
              Testimoni ini akan langsung tampil di halaman website setelah dipublikasikan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-semibold border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmPublish}
                className="flex-1 px-4 py-2 text-sm font-semibold bg-[#E87722] hover:bg-[#d66a1a] text-white rounded-md"
              >
                Ya, Publikasikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}