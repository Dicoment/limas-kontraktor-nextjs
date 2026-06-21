"use client"

import { useState } from "react"
import { Table } from "@/components/ui/Table" 
import Button from "@/components/ui/Button" 
import { Trash2 } from "lucide-react"
import Link from "next/link"
import { deleteProject } from "@/actions/project.actions" 

export function ProjectTable({ initialData }: { initialData: any[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleDelete = async () => {
    if (!confirm(`Yakin hapus ${selectedIds.length} project?`)) return
    
    try {
      // Loop karena deleteProject biasanya cuma buat satu ID
      for (const id of selectedIds) {
        await deleteProject(id) 
      }
      window.location.reload() // Refresh setelah selesai semua
    } catch (err) {
      alert("Gagal hapus data")
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
          >
            <Trash2 size={16} className="mr-2"/> Hapus
          </Button>
        </div>
      )}

      <Table 
        headers={headers}
        rows={initialData}
        renderRow={(project) => (
          <tr key={project.id} className="hover:bg-slate-50 border-b border-slate-50">
            <td className="px-5 py-4">
              <input type="checkbox" checked={selectedIds.includes(project.id)} onChange={() => toggleSelect(project.id)} className="rounded border-slate-300" />
            </td>
            <td className="px-5 py-4">
              <p className="font-bold text-slate-800">{project.title}</p>
            </td>
            <td className="px-5 py-4">
              <span className="text-[10px] font-bold uppercase bg-slate-100 px-2 py-1 rounded-full">{project.status}</span>
            </td>
            <td className="px-5 py-4 text-xs">{project.client || "-"}</td>
            <td className="px-5 py-4 text-right">
              <Link href={`/dashboard/projects/${project.id}/edit`} className="text-[#E87722] font-bold text-xs hover:underline">Edit</Link>
            </td>
          </tr>
        )}
      />
    </>
  )
}