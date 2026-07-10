"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table } from "@/components/ui/Table" 
import Button from "@/components/ui/Button" 
import { Trash2 } from "lucide-react"
import Link from "next/link"
import { deleteProjects } from "@/actions/project.actions" 

export function ProjectTable({ initialData }: { initialData: any[] }) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Yakin hapus ${selectedIds.length} project?`)) return

    setIsDeleting(true)

    try {
      const result = await deleteProjects(selectedIds)
      const failedCount = selectedIds.length - result.deletedCount

      setSelectedIds([])
      router.refresh()

      if (failedCount > 0) {
        alert(
          `${result.deletedCount} project berhasil dihapus, ${failedCount} tidak ditemukan/gagal.`
        )
      }
    } catch (err) {
      // deleteMany itu 1 statement SQL - kalau ada FK constraint yang nge-block
      // salah satu row, seluruh batch gagal (gak ada yang kehapus sama sekali),
      // beda sama versi paralel sebelumnya yang partial success.
      alert("Gagal menghapus project. Kemungkinan masih ada data terkait (lead/gambar) yang mengunci salah satu project.")
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === initialData.length ? [] : initialData.map(p => p.id))
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const headers = [
    { 
      key: "select", 
      label: <input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.length === initialData.length && initialData.length > 0} className="rounded border-slate-300" />, 
      className: "w-10" 
    },
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
    { key: "client", label: "Client" },
    { key: "actions", label: "Actions", align: "right" as const },
  ]

  return (
    <>
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg mb-4">
          <span className="text-sm font-bold text-red-700">{selectedIds.length} item dipilih</span>
          <Button 
            onClick={handleDelete}
            variant="primary" 
            className="bg-red-600 hover:bg-red-700" 
            size="sm"
            disabled={isDeleting}
          >
            <Trash2 size={16} className="mr-2"/> {isDeleting ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      )}

      <Table 
        headers={headers}
        rows={initialData}
        renderRow={(project) => (
          <tr
            key={project.id}
            className="block md:table-row mb-3 md:mb-0 rounded-lg md:rounded-none border border-slate-200 md:border-0 md:border-b md:border-slate-50 shadow-sm md:shadow-none p-3 md:p-0 hover:bg-slate-50"
          >
            {/* Checkbox: kolom terpisah di desktop, disembunyiin di mobile
                karena checkbox mobile-nya digabung 1 baris sama title di bawah. */}
            <td className="hidden md:table-cell md:px-5 md:py-4">
              <input type="checkbox" checked={selectedIds.includes(project.id)} onChange={() => toggleSelect(project.id)} className="rounded border-slate-300" />
            </td>

            <td className="block md:table-cell md:px-5 md:py-4 pb-2 md:pb-4">
              {/* Checkbox mobile — cuma nongol di bawah md, satu baris sama title.
                  Ukuran dibesarin (w-5 h-5) + padding di label biar area klik/tap
                  lebih lega, checkbox bawaan browser kekecilan buat jempol di HP. */}
              <label className="flex items-center gap-2 md:hidden mb-2 -mx-1 px-1 py-1 cursor-pointer active:bg-slate-50 rounded">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(project.id)}
                  onChange={() => toggleSelect(project.id)}
                  className="w-5 h-5 rounded border-slate-300 accent-[#E87722]"
                />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pilih</span>
              </label>
              <p className="font-bold text-slate-800">{project.title}</p>
            </td>

            <td className="block md:table-cell md:px-5 md:py-4 py-1.5 before:content-['Status'] before:block before:text-[10px] before:font-bold before:text-slate-400 before:uppercase before:tracking-wider md:before:content-none">
              <span className="text-[10px] font-bold uppercase bg-slate-100 px-2 py-1 rounded-full inline-block mt-0.5 md:mt-0">{project.status}</span>
            </td>

            <td className="block md:table-cell md:px-5 md:py-4 py-1.5 text-xs before:content-['Client'] before:block before:text-[10px] before:font-bold before:text-slate-400 before:uppercase before:tracking-wider md:before:content-none">
              {project.client || "-"}
            </td>

            <td className="block md:table-cell md:px-5 md:py-4 pt-2 md:pt-4 text-left md:text-right border-t md:border-t-0 border-slate-100 mt-2 md:mt-0">
              <Link href={`/dashboard/projects/${project.id}/edit`} className="text-[#E87722] font-bold text-xs hover:underline">Edit</Link>
            </td>
          </tr>
        )}
      />
    </>
  )
}