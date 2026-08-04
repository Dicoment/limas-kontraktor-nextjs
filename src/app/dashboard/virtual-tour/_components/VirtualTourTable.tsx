"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table } from "@/components/ui/Table"
import Button from "@/components/ui/Button"
import { Trash2 } from "lucide-react"
import Link from "next/link"
import { deleteVirtualTourScenes } from "@/actions/virtual-tour.actions"

export function VirtualTourTable({ initialData }: { initialData: any[] }) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Yakin hapus ${selectedIds.length} scene?`)) return
    setIsDeleting(true)
    try {
      const result = await deleteVirtualTourScenes(selectedIds)
      setSelectedIds([])
      router.refresh()
      const failed = selectedIds.length - result.deletedCount
      if (failed > 0) alert(`${result.deletedCount} berhasil dihapus, ${failed} gagal.`)
    } catch {
      alert("Gagal menghapus scene.")
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === initialData.length ? [] : initialData.map((s) => s.id))
  }
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const headers = [
    {
      key: "select",
      label: (
        <input
          type="checkbox"
          onChange={toggleSelectAll}
          checked={selectedIds.length === initialData.length && initialData.length > 0}
          className="rounded border-slate-300"
        />
      ),
      className: "w-10",
    },
    { key: "title", label: "Scene" },
    { key: "project", label: "Proyek" },
    { key: "hotspots", label: "Hotspot" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions", align: "right" as const },
  ]

  return (
    <>
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg mb-4">
          <span className="text-sm font-bold text-red-700">{selectedIds.length} item dipilih</span>
          <Button onClick={handleDelete} variant="primary" className="bg-red-600 hover:bg-red-700" size="sm" disabled={isDeleting}>
            <Trash2 size={16} className="mr-2" /> {isDeleting ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      )}

      <Table
        headers={headers}
        rows={initialData}
        emptyMessage="Belum ada scene virtual tour."
        renderRow={(scene) => (
          <tr
            key={scene.id}
            className="block md:table-row mb-3 md:mb-0 rounded-lg md:rounded-none border border-slate-200 md:border-0 md:border-b md:border-slate-50 shadow-sm md:shadow-none p-3 md:p-0 hover:bg-slate-50"
          >
            <td className="hidden md:table-cell md:px-5 md:py-4">
              <input
                type="checkbox"
                checked={selectedIds.includes(scene.id)}
                onChange={() => toggleSelect(scene.id)}
                className="rounded border-slate-300"
              />
            </td>
            <td className="block md:table-cell md:px-5 md:py-4 pb-2 md:pb-4">
              <div className="flex items-center gap-2">
                {scene.imageUrl && (
                  <img
                    src={scene.imageUrl}
                    alt={scene.title}
                    className="w-10 h-10 rounded object-cover border border-slate-200 shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                )}
                <p className="font-semibold text-slate-900 text-sm">{scene.title}</p>
              </div>
            </td>
            <td className="block md:table-cell md:px-5 md:py-4 py-1.5 text-xs md:text-sm text-slate-600 before:content-['Proyek'] before:block before:text-[10px] before:font-bold before:text-slate-400 before:uppercase before:tracking-wider md:before:content-none">
              {scene.project?.title || "—"}
            </td>
            <td className="block md:table-cell md:px-5 md:py-4 py-1.5 text-xs md:text-sm text-slate-600 before:content-['Hotspot'] before:block before:text-[10px] before:font-bold before:text-slate-400 before:uppercase before:tracking-wider md:before:content-none">
              {Array.isArray(scene.hotspots) ? scene.hotspots.length : 0} titik
            </td>
            <td className="block md:table-cell md:px-5 md:py-4 py-1.5 before:content-['Status'] before:block before:text-[10px] before:font-bold before:text-slate-400 before:uppercase before:tracking-wider md:before:content-none">
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full inline-block ${scene.published ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                {scene.published ? "Published" : "Draft"}
              </span>
            </td>
            <td className="block md:table-cell md:px-5 md:py-4 pt-2 md:pt-4 text-left md:text-right border-t md:border-t-0 border-slate-100 mt-2 md:mt-0">
              <Link href={`/dashboard/virtual-tour/${scene.id}/edit`} className="text-[#E87722] font-bold text-xs hover:underline">Edit</Link>
            </td>
          </tr>
        )}
      />
    </>
  )
}