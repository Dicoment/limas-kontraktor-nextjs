"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table } from "@/components/ui/Table"
import Button from "@/components/ui/Button"
import { Trash2 } from "lucide-react"
import { deleteLeadsLog, deleteLeadsLogs } from "@/actions/misc.actions"

export function LeadsLogTable({ initialData }: { initialData: any[] }) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletingRowId, setDeletingRowId] = useState<string | null>(null)

  const handleBulkDelete = async () => {
    if (!confirm(`Yakin hapus ${selectedIds.length} leads log?`)) return
    setIsDeleting(true)
    try {
      const result = await deleteLeadsLogs(selectedIds)
      setSelectedIds([])
      router.refresh()
      const failed = selectedIds.length - result.deletedCount
      if (failed > 0) alert(`${result.deletedCount} berhasil dihapus, ${failed} gagal.`)
    } catch {
      alert("Gagal menghapus leads log.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRowDelete = async (id: string) => {
    if (!confirm("Yakin hapus leads log ini?")) return
    setDeletingRowId(id)
    try {
      await deleteLeadsLog(id)
      router.refresh()
    } catch {
      alert("Gagal menghapus leads log.")
    } finally {
      setDeletingRowId(null)
    }
  }

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === initialData.length ? [] : initialData.map((l) => l.id))
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
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "project", label: "Project" },
    { key: "message", label: "Message" },
    { key: "date", label: "Date" },
    { key: "actions", label: "Actions", align: "right" as const },
  ]

  return (
    <>
      {selectedIds.length > 0 && (
        <div className="flex items-center sticky top-20 z-50 justify-between bg-red-50 p-4 rounded-lg mb-4 shadow-sm">
          <span className="text-sm font-bold text-red-700">{selectedIds.length} item dipilih</span>
          <Button onClick={handleBulkDelete} variant="primary" className="bg-red-600 hover:bg-red-700" size="sm" disabled={isDeleting}>
            <Trash2 size={16} className="mr-2" /> {isDeleting ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      )}

      <Table
        headers={headers}
        rows={initialData}
        emptyMessage="Belum ada leads masuk."
        renderRow={(lead) => (
          <tr
            key={lead.id}
            onClick={() => router.push(`/dashboard/leads-logs/${lead.id}`)}
            className="block md:table-row mb-3 md:mb-0 rounded-lg md:rounded-none border border-slate-200 md:border-0 md:border-b md:border-slate-50 shadow-sm md:shadow-none p-3 md:p-0 hover:bg-slate-50 cursor-pointer"
          >
            <td className="hidden md:table-cell md:px-5 md:py-4" onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" checked={selectedIds.includes(lead.id)} onChange={() => toggleSelect(lead.id)} className="rounded border-slate-300" />
            </td>
            <td className="block md:table-cell md:px-5 md:py-4 pb-2 md:pb-4">
              <label
                className="flex items-center gap-2 md:hidden mb-2 -mx-1 px-1 py-1 cursor-pointer active:bg-slate-50 rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <input type="checkbox" checked={selectedIds.includes(lead.id)} onChange={() => toggleSelect(lead.id)} className="w-5 h-5 rounded border-slate-300 accent-[#E87722]" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pilih</span>
              </label>
              <p className="font-bold text-slate-800">{lead.name || "Anonymous"}</p>
            </td>
            <td
              className="block md:table-cell md:px-5 md:py-4 py-1.5 text-xs before:content-['Phone'] before:block before:text-[10px] before:font-bold before:text-slate-400 before:uppercase before:tracking-wider md:before:content-none"
              onClick={(e) => e.stopPropagation()}
            >
              {lead.phone ? (
                <a href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                  {lead.phone}
                </a>
              ) : (
                "-"
              )}
            </td>
            <td className="block md:table-cell md:px-5 md:py-4 py-1.5 text-xs text-slate-500 before:content-['Project'] before:block before:text-[10px] before:font-bold before:text-slate-400 before:uppercase before:tracking-wider md:before:content-none">
              {lead.projectId ? `ID: ${lead.projectId.slice(0, 8)}...` : "-"}
            </td>
            <td className="block md:table-cell md:px-5 md:py-4 py-1.5 text-xs text-slate-600 md:max-w-xs md:truncate before:content-['Message'] before:block before:text-[10px] before:font-bold before:text-slate-400 before:uppercase before:tracking-wider md:before:content-none">
              {lead.message || "-"}
            </td>
            <td className="block md:table-cell md:px-5 md:py-4 py-1.5 text-xs text-slate-500 before:content-['Date'] before:block before:text-[10px] before:font-bold before:text-slate-400 before:uppercase before:tracking-wider md:before:content-none">
              {new Date(lead.createdAt).toLocaleDateString("id-ID")}
            </td>
            <td
              className="block md:table-cell md:px-5 md:py-4 pt-2 md:pt-4 text-left md:text-right border-t md:border-t-0 border-slate-100 mt-2 md:mt-0"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => handleRowDelete(lead.id)}
                disabled={deletingRowId === lead.id}
                className="text-red-500 font-bold text-xs hover:underline cursor-pointer disabled:opacity-50"
              >
                {deletingRowId === lead.id ? "Menghapus..." : "Delete"}
              </button>
            </td>
          </tr>
        )}
      />
    </>
  )
}