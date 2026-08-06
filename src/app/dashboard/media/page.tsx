"use client"

import { useState, useEffect, useMemo } from "react"
import {
  RiImageLine, RiLoader4Line, RiDeleteBin6Line,
  RiCloseLine, RiArrowLeftSLine, RiArrowRightSLine,
  RiHardDrive2Line, RiCheckboxCircleLine,
} from "react-icons/ri"

type MediaFile = {
  id: string
  name: string
  size: number
  url: string
  createdAt: string
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  })
}

export default function MediaDashboardPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNames, setSelectedNames] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  // Lightbox
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/media")
      const json = await res.json()
      setFiles(json.data || [])
    } catch (err) {
      console.error("Gagal memuat media:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const totalSize = useMemo(() => files.reduce((sum, f) => sum + f.size, 0), [files])

  const toggleSelect = (name: string) => {
    setSelectedNames((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]))
  }

  const toggleSelectAll = () => {
    setSelectedNames(selectedNames.length === files.length ? [] : files.map((f) => f.name))
  }

  const handleDelete = async () => {
    if (selectedNames.length === 0) return
    if (!confirm(`Yakin hapus ${selectedNames.length} gambar? Aksi ini tidak bisa dibatalkan.`)) return

    setIsDeleting(true)
    try {
      const res = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filenames: selectedNames }),
      })
      const json = await res.json()
      setSelectedNames([])
      await fetchMedia()
      if (json.failed?.length > 0) {
        alert(`${json.deletedCount} berhasil dihapus, ${json.failed.length} gagal.`)
      }
    } catch (err) {
      console.error("Gagal menghapus:", err)
      alert("Gagal menghapus gambar.")
    } finally {
      setIsDeleting(false)
    }
  }

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex((i) => (i === null ? null : (i - 1 + files.length) % files.length))
  const nextImage = () => setLightboxIndex((i) => (i === null ? null : (i + 1) % files.length))

  useEffect(() => {
    if (lightboxIndex === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowLeft") prevImage()
      if (e.key === "ArrowRight") nextImage()
    }
    window.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [lightboxIndex, files.length])

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans py-4 px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Media Library</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola semua gambar yang pernah diupload ke website.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold">
          <RiHardDrive2Line size={18} className="text-indigo-400" />
          <span>{files.length} file</span>
          <span className="text-slate-500">•</span>
          <span>{formatBytes(totalSize)} terpakai</span>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedNames.length > 0 && (
        <div className="flex items-center justify-between bg-red-50 border border-red-100 p-4 rounded-xl sticky top-2 z-30 shadow-sm">
          <span className="text-sm font-bold text-red-700 flex items-center gap-2">
            <RiCheckboxCircleLine size={16} />
            {selectedNames.length} gambar dipilih
          </span>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
          >
            <RiDeleteBin6Line size={14} />
            {isDeleting ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      )}

      {/* Select all */}
      {files.length > 0 && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedNames.length === files.length && files.length > 0}
            onChange={toggleSelectAll}
            className="rounded border-slate-300"
          />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pilih Semua</span>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-60 text-slate-400 gap-2 text-sm">
          <RiLoader4Line className="animate-spin" size={20} /> Memuat media...
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 text-slate-400 gap-2">
          <RiImageLine size={40} className="opacity-30" />
          <span className="text-sm">Belum ada gambar yang diupload.</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file, index) => {
            const isSelected = selectedNames.includes(file.name)
            return (
              <div
                key={file.name}
                className={`group relative rounded-xl overflow-hidden border-2 bg-white transition ${
                  isSelected ? "border-[#E87722] shadow-md" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSelect(file.name)
                  }}
                  className="absolute top-2 left-2 z-10 w-5 h-5 rounded-md border-2 border-white bg-white/80 backdrop-blur flex items-center justify-center shadow-sm"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className="w-full h-full rounded cursor-pointer accent-[#E87722]"
                  />
                </button>

                {/* Gambar — klik buka lightbox */}
                <button
                  type="button"
                  onClick={() => openLightbox(index)}
                  className="w-full aspect-square block cursor-zoom-in"
                >
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                </button>

                {/* Info bawah */}
                <div className="p-2 space-y-0.5">
                  <p className="text-[10px] font-medium text-slate-600 truncate" title={file.name}>{file.name}</p>
                  <div className="flex items-center justify-between text-[9px] text-slate-400">
                    <span>{formatBytes(file.size)}</span>
                    <span>{formatDate(file.createdAt)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && files[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center backdrop-blur-md"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/10"
            aria-label="Tutup"
          >
            <RiCloseLine size={22} />
          </button>

          <div className="absolute top-6 left-6 z-20 text-white/80 text-sm font-semibold tracking-widest uppercase bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            {lightboxIndex + 1} / {files.length}
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/70 text-xs bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 max-w-[90vw] truncate">
            {files[lightboxIndex].name} • {formatBytes(files[lightboxIndex].size)}
          </div>

          {files.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/10"
              aria-label="Sebelumnya"
            >
              <RiArrowLeftSLine size={26} />
            </button>
          )}

          <div
            className="relative w-[88vw] h-[75vh] max-w-[1200px]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={files[lightboxIndex].url}
              alt={files[lightboxIndex].name}
              className="w-full h-full object-contain select-none shadow-2xl"
            />
          </div>

          {files.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/10"
              aria-label="Berikutnya"
            >
              <RiArrowRightSLine size={26} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}