"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table } from "@/components/ui/Table"
import Button from "@/components/ui/Button"
import { Trash2 } from "lucide-react"
import { deleteUsers } from "@/actions/user.actions"

export function UserTable({ initialData, currentUserId }: { initialData: any[]; currentUserId: string }) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  const selectableRows = initialData.filter((u) => u.id !== currentUserId)

  const handleDelete = async () => {
    if (!confirm(`Yakin hapus ${selectedIds.length} user?`)) return
    setIsDeleting(true)
    try {
      const result = await deleteUsers(selectedIds)
      setSelectedIds([])
      router.refresh()
      const failed = selectedIds.length - result.deletedCount
      if (failed > 0) alert(`${result.deletedCount} berhasil dihapus, ${failed} gagal.`)
    } catch (err: any) {
      alert(err.message || "Gagal menghapus user.")
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === selectableRows.length ? [] : selectableRows.map(u => u.id))
  }
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const headers = [
    { key: "select", label: <input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.length === selectableRows.length && selectableRows.length > 0} className="rounded border-slate-300" />, className: "w-10" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
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
        emptyMessage="Belum ada user."
        renderRow={(user) => {
          const isSelf = user.id === currentUserId
          return (
            <tr key={user.id} className="block md:table-row mb-3 md:mb-0 rounded-lg md:rounded-none border border-slate-200 md:border-0 md:border-b md:border-slate-50 shadow-sm md:shadow-none p-3 md:p-0 hover:bg-slate-50">
              <td className="hidden md:table-cell md:px-5 md:py-4">
                {!isSelf && (
                  <input type="checkbox" checked={selectedIds.includes(user.id)} onChange={() => toggleSelect(user.id)} className="rounded border-slate-300" />
                )}
              </td>
              <td className="block md:table-cell md:px-5 md:py-4 pb-2 md:pb-4">
                {!isSelf && (
                  <label className="flex items-center gap-2 md:hidden mb-2 -mx-1 px-1 py-1 cursor-pointer active:bg-slate-50 rounded">
                    <input type="checkbox" checked={selectedIds.includes(user.id)} onChange={() => toggleSelect(user.id)} className="w-5 h-5 rounded border-slate-300 accent-[#E87722]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pilih</span>
                  </label>
                )}
                <div className="flex items-center gap-3">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0" onError={(e) => { e.currentTarget.style.display = "none" }} />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                      {(user.name || user.email)?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <p className="font-bold text-slate-800">
                    {user.name || "-"} {isSelf && <span className="text-[10px] font-normal text-[#E87722]">(kamu)</span>}
                  </p>
                </div>
              </td>
              <td className="block md:table-cell md:px-5 md:py-4 py-1.5 text-xs before:content-['Email'] before:block before:text-[10px] before:font-bold before:text-slate-400 before:uppercase before:tracking-wider md:before:content-none">
                {user.email}
              </td>
              <td className="block md:table-cell md:px-5 md:py-4 py-1.5 before:content-['Role'] before:block before:text-[10px] before:font-bold before:text-slate-400 before:uppercase before:tracking-wider md:before:content-none">
                <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-slate-100 text-slate-600 inline-block mt-0.5 md:mt-0">{user.role}</span>
              </td>
              <td className="block md:table-cell md:px-5 md:py-4 pt-2 md:pt-4 text-left md:text-right border-t md:border-t-0 border-slate-100 mt-2 md:mt-0">
                {!isSelf ? (
                  <button
                    onClick={async () => {
                      if (!confirm(`Hapus user ${user.email}?`)) return
                      const { deleteUser } = await import("@/actions/user.actions")
                      await deleteUser(user.id)
                      router.refresh()
                    }}
                    className="text-red-500 font-bold text-xs hover:underline"
                  >
                    Hapus
                  </button>
                ) : (
                  <span className="text-slate-300 text-xs">—</span>
                )}
              </td>
            </tr>
          )
        }}
      />
    </>
  )
}