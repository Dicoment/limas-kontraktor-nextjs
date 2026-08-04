"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import MediaPicker from "@/components/ui/MediaPicker"
import Button from "@/components/ui/Button"
import { FaCircleCheck, FaTrash, FaPlus } from "react-icons/fa6"

type Hotspot = {
  targetSceneId: string
  label: string
  yaw: number
  pitch: number
}

type Scene = {
  id: string
  title: string
  imageUrl: string
  projectId: string | null
  hotspots: Hotspot[] | null
  published: boolean
}

type SceneOption = { id: string; title: string }
type Project = { id: string; title: string }

export default function VirtualTourFormClient({
  scene,
  sceneOptions,
  projects,
  createScene,
  updateScene,
}: {
  scene?: Scene
  sceneOptions: SceneOption[]
  projects: Project[]
  createScene: (data: any) => Promise<any>
  updateScene: (id: string, data: any) => Promise<any>
}) {
  const router = useRouter()
  const isEdit = !!scene

  const [imageUrl, setImageUrl] = useState(scene?.imageUrl || "")
  const [title, setTitle] = useState(scene?.title || "")
  const [projectId, setProjectId] = useState(scene?.projectId || "")
  const [hotspots, setHotspots] = useState<Hotspot[]>(scene?.hotspots || [])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showConfirm, setShowConfirm] = useState(false)
  const [successState, setSuccessState] = useState<null | "published" | "draft">(null)

  // Scene lain yang bisa dijadikan tujuan hotspot (gak termasuk diri sendiri)
  const availableTargets = sceneOptions.filter((s) => s.id !== scene?.id)

  const addHotspot = () => {
    if (availableTargets.length === 0) return
    setHotspots((prev) => [
      ...prev,
      { targetSceneId: availableTargets[0].id, label: availableTargets[0].title, yaw: 0, pitch: 0 },
    ])
  }

  const updateHotspot = (index: number, patch: Partial<Hotspot>) => {
    setHotspots((prev) => prev.map((h, i) => (i === index ? { ...h, ...patch } : h)))
  }

  const removeHotspot = (index: number) => {
    setHotspots((prev) => prev.filter((_, i) => i !== index))
  }

  const saveScene = async (published: boolean) => {
    if (!imageUrl) {
      setError("Foto 360 wajib diupload dulu.")
      return
    }
    setLoading(true)
    setError("")

    const payload = {
      title,
      imageUrl,
      projectId: projectId || null,
      hotspots,
      published,
    }

    try {
      if (isEdit) {
        await updateScene(scene!.id, payload)
      } else {
        await createScene(payload)
      }
      setSuccessState(published ? "published" : "draft")
    } catch (err) {
      console.error("Gagal menyimpan scene:", err)
      setError(isEdit ? "Gagal memperbarui scene." : "Gagal membuat scene.")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = () => saveScene(false)
  const handlePublishClick = () => setShowConfirm(true)
  const confirmPublish = () => {
    setShowConfirm(false)
    saveScene(true)
  }

  if (successState) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 font-jakarta">
        <div className="max-w-md w-full text-center space-y-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="flex justify-center">
            <FaCircleCheck size={52} className="text-emerald-500" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-slate-900">
              {successState === "published" ? "Scene berhasil dipublikasikan!" : "Draft berhasil disimpan!"}
            </h2>
            <p className="text-sm text-slate-500">
              {successState === "published"
                ? "Scene ini sekarang sudah tampil di halaman Virtual Tour."
                : "Scene disimpan sebagai draft dan belum tampil di website."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            
              <a href="/dashboard/virtual-tour"
              className="flex-1 px-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 text-center"
            >
              Kembali ke Daftar
            </a>
            
             <a href="/dashboard/virtual-tour/new"
              className="flex-1 px-4 py-2.5 text-sm font-semibold bg-[#E87722] hover:bg-[#d66a1a] text-white rounded-md text-center"
            >
              + Tambah Scene Baru
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 font-jakarta relative">
      <h1 className="text-lg font-bold text-slate-900 tracking-tight">{isEdit ? "Edit" : "New"} Virtual Tour Scene</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}

      <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 space-y-5 max-w-2xl">
        {/* Foto 360 */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Foto 360° (Equirectangular)</label>
          <MediaPicker value={imageUrl} onChange={setImageUrl} placeholder="Upload foto render 360" />
          <p className="text-[11px] text-slate-400 mt-1">
            Rasio 2:1 (misal 6000×3000px), hasil export render 360 dari software 3D.
          </p>
        </div>

        {/* Judul */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Nama Ruangan/Titik</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
            placeholder="cth. Ruang Tamu, Carport, Kamar Utama"
            required
            minLength={2}
            maxLength={100}
          />
        </div>

        {/* Proyek */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Proyek Terkait</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
          >
            <option value="">— Tidak ada —</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        {/* Hotspot */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-medium text-slate-500">Hotspot Perpindahan Ruangan</label>
            <button
              type="button"
              onClick={addHotspot}
              disabled={availableTargets.length === 0}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#E87722] hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaPlus size={11} /> Tambah Hotspot
            </button>
          </div>

          {availableTargets.length === 0 && (
            <p className="text-[11px] text-slate-400 mb-2">
              Belum ada scene lain. Buat scene ruangan lain dulu supaya bisa dihubungkan lewat hotspot.
            </p>
          )}

          <div className="space-y-3">
            {hotspots.map((hs, index) => (
              <div key={index} className="border border-slate-200 rounded-md p-3 space-y-2 bg-slate-50">
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={hs.targetSceneId}
                    onChange={(e) => {
                      const target = sceneOptions.find((s) => s.id === e.target.value)
                      updateHotspot(index, { targetSceneId: e.target.value, label: target?.title || hs.label })
                    }}
                    className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs bg-white"
                  >
                    {availableTargets.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeHotspot(index)}
                    className="text-red-500 hover:text-red-700 shrink-0"
                    aria-label="Hapus hotspot"
                  >
                    <FaTrash size={13} />
                  </button>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Label Hotspot</label>
                  <input
                    value={hs.label}
                    onChange={(e) => updateHotspot(index, { label: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs bg-white"
                    placeholder="cth. Ke Ruang Tamu"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Posisi Horizontal (Yaw)</label>
                    <input
                      type="number"
                      value={hs.yaw}
                      onChange={(e) => updateHotspot(index, { yaw: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Posisi Vertikal (Pitch)</label>
                    <input
                      type="number"
                      value={hs.pitch}
                      onChange={(e) => updateHotspot(index, { pitch: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Yaw/Pitch nentuin posisi titik hotspot muncul di foto. Isi dulu angka sembarang (misal 0, 0), nanti kita
            rapikan posisinya pas sudah lihat hasilnya di halaman publik.
          </p>
        </div>

        {/* Tombol aksi */}
        <div className="flex flex-col sm:flex-row gap-3 border-t border-slate-100 pt-5">
          <Button type="button" variant="outline" disabled={loading} onClick={handleSaveDraft} className="w-full sm:w-auto justify-center">
            {loading ? "Menyimpan..." : "Simpan Draft"}
          </Button>
          <Button type="button" variant="primary" disabled={loading} onClick={handlePublishClick} className="w-full sm:w-auto justify-center">
            {loading ? "Menyimpan..." : "Publikasikan"}
          </Button>
          <a href="/dashboard/virtual-tour" className="px-4 py-2 text-sm border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600 text-center w-full sm:w-auto">
            Batal
          </a>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Yakin ingin publikasikan?</h3>
            <p className="text-sm text-slate-500">Scene ini akan langsung tampil di halaman Virtual Tour setelah dipublikasikan.</p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button type="button" onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-2 text-sm font-semibold border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600">
                Batal
              </button>
              <button type="button" onClick={confirmPublish} className="flex-1 px-4 py-2 text-sm font-semibold bg-[#E87722] hover:bg-[#d66a1a] text-white rounded-md">
                Ya, Publikasikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}