"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table } from "@/components/ui/Table"
import Button from "@/components/ui/Button"
import { Trash2 } from "lucide-react"
import Link from "next/link"
import { deleteTeams } from "@/actions/misc.actions"

export function TeamTable({ initialData }: { initialData: any[] }) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Yakin hapus ${selectedIds.length} anggota tim?`)) return
    setIsDeleting(true)
    try {
      const result = await deleteTeams(selectedIds)
      setSelectedIds([])
      router.refresh()
      const failed = selectedIds.length - result.deletedCount
      if (failed > 0) alert(`${result.deletedCount} berhasil dihapus, ${failed} gagal (kemungkinan masih terhubung ke project).`)
    } catch {
      alert("Gagal menghapus tim.")
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === initialData.length ? [] : initialData.map(t => t.id))
  }
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const headers = [
    { key: "select", label: <input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.length === initialData.length && initialData.length > 0} className="rounded border-slate-300" />, className: "w-10" },
    { key: "name", label: "Name" },
    { key: "position", label: "Position" },
    { key: "email", label: "Email" },
    { key: "actions", label: "Actions", align: "right" as const },
  ]

  return (
    <>
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg mb-4">
          <span className="text-sm font-bold text-red-700">{selectedIds.length} item dipilih</span>
          <Button onClick={handleDelete} variant="primary" className="bg-red-600 hover:bg-red-700" size="sm" disabled={isDeleting}>
            <Trash2 size={16} className="mr-2"/> {isDeleting ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      )}

      <Table
        headers={headers}
        rows={initialData}
        emptyMessage="Belum ada anggota tim."
        renderRow={(team) => (
          <tr key={team.id} className="block md:table-row mb-3 md:mb-0 rounded-lg md:rounded-none border border-slate-200 md:border-0 md:border-b md:border-slate-50 shadow-sm md:shadow-none p-3 md:p-0 hover:bg-slate-50">
            <td className="hidden md:table-cell md:px-5 md:py-4">
              <input type="checkbox" checked={selectedIds.includes(team.id)} onChange={() => toggleSelect(team.id)} className="rounded border-slate-300" />
            </td>
            <td className="block md:table-cell md:px-5 md:py-4 pb-2 md:pb-4">
              <label className="flex items-center gap-2 md:hidden mb-2 -mx-1 px-1 py-1 cursor-pointer active:bg-slate-50 rounded">
                <input type="checkbox" checked={selectedIds.includes(team.id)} onChange={() => toggleSelect(team.id)} className="w-5 h-5 rounded border-slate-300 accent-[#E87722]" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pilih</span>
              </label>
              <div className="flex items-center gap-3">
                {team.avatar ? (
                  <img
                    src={team.avatar}
                    alt={team.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                    onError={(e) => { e.currentTarget.style.display = "none" }}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                    {team.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                <p className="font-bold text-slate-800">{team.name}</p>
              </div>
            </td>
            <td className="block md:table-cell md:px-5 md:py-4 py-1.5 text-xs before:content-['Position'] before:block before:text-[10px] before:font-bold before:text-slate-400 before:uppercase before:tracking-wider md:before:content-none">
              {team.position || "-"}
            </td>
            <td className="block md:table-cell md:px-5 md:py-4 py-1.5 text-xs before:content-['Email'] before:block before:text-[10px] before:font-bold before:text-slate-400 before:uppercase before:tracking-wider md:before:content-none">
              {team.email || "-"}
            </td>
            <td className="block md:table-cell md:px-5 md:py-4 pt-2 md:pt-4 text-left md:text-right border-t md:border-t-0 border-slate-100 mt-2 md:mt-0">
              <Link href={`/dashboard/teams/${team.id}/edit`} className="text-[#E87722] font-bold text-xs hover:underline">Edit</Link>
            </td>
          </tr>
        )}
      />
    </>
  )
}