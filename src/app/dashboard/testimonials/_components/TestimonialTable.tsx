"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table } from "@/components/ui/Table"
import Button from "@/components/ui/Button"
import { Trash2 } from "lucide-react"
import Link from "next/link"
import { deleteTestimonials } from "@/actions/misc.actions"

export function TestimonialTable({ initialData }: { initialData: any[] }) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Yakin hapus ${selectedIds.length} testimoni?`)) return
    setIsDeleting(true)
    try {
      const result = await deleteTestimonials(selectedIds)
      setSelectedIds([])
      router.refresh()
      const failed = selectedIds.length - result.deletedCount
      if (failed > 0) alert(`${result.deletedCount} berhasil dihapus, ${failed} gagal.`)
    } catch {
      alert("Gagal menghapus testimoni.")
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === initialData.length ? [] : initialData.map((t) => t.id))
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
    { key: "clientName", label: "Client", className: "w-[25%]" },
    { key: "content", label: "Content", className: "w-[35%]" },
    { key: "rating", label: "Rating", className: "w-[10%]" },
    { key: "platform", label: "Platform", className: "w-[15%]" },
    { key: "actions", label: "Actions", align: "right" as const, className: "w-[10%]" },
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
        emptyMessage="Belum ada testimoni."
        renderRow={(testimonial) => (
          <tr
            key={testimonial.id}
            className="block md:table-row mb-3 md:mb-0 rounded-lg md:rounded-none border border-slate-200 md:border-0 md:border-b md:border-slate-50 shadow-sm md:shadow-none p-3 md:p-0 hover:bg-slate-50"
          >
            <td className="hidden md:table-cell md:px-5 md:py-4">
              <input
                type="checkbox"
                checked={selectedIds.includes(testimonial.id)}
                onChange={() => toggleSelect(testimonial.id)}
                className="rounded border-slate-300"
              />
            </td>
            <td className="block md:table-cell md:px-5 md:py-4 pb-2 md:pb-4">
              <label className="flex items-center gap-2 md:hidden mb-2 -mx-1 px-1 py-1 cursor-pointer active:bg-slate-50 rounded">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(testimonial.id)}
                  onChange={() => toggleSelect(testimonial.id)}
                  className="w-5 h-5 rounded border-slate-300 accent-[#E87722]"
                />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pilih</span>
              </label>
              <div className="flex items-center gap-2">
                {testimonial.avatar && (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.clientName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                )}
                <p className="font-semibold text-slate-900 text-sm">{testimonial.clientName}</p>
              </div>
            </td>
            <td className="block md:table-cell md:px-5 md:py-4 py-1.5 text-xs md:text-sm text-slate-600 md:max-w-xs md:truncate before:content-['Content'] before:block before:text-[10px] before:font-bold before:text-slate-400 before:uppercase before:tracking-wider md:before:content-none">
              {testimonial.content?.length > 60 ? `${testimonial.content.substring(0, 60)}...` : testimonial.content}
            </td>
            <td className="block md:table-cell md:px-5 md:py-4 py-1.5 before:content-['Rating'] before:block before:text-[10px] before:font-bold before:text-slate-400 before:uppercase before:tracking-wider md:before:content-none">
              <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-bold rounded-sm border bg-amber-50 text-amber-700 border-amber-100">
                {testimonial.rating ?? "—"} / 5
              </span>
            </td>
            <td className="block md:table-cell md:px-5 md:py-4 py-1.5 before:content-['Platform'] before:block before:text-[10px] before:font-bold before:text-slate-400 before:uppercase before:tracking-wider md:before:content-none">
              <span
                className={`inline-flex items-center px-2 py-0.5 text-[11px] font-bold rounded-sm border ${
                  testimonial.platform === "SOCIAL_MEDIA"
                    ? "bg-blue-50 text-blue-700 border-blue-100"
                    : "bg-zinc-100 text-zinc-600 border-zinc-200"
                }`}
              >
                {testimonial.platform === "SOCIAL_MEDIA" ? "Social Media" : "Manual"}
              </span>
            </td>
            <td className="block md:table-cell md:px-5 md:py-4 pt-2 md:pt-4 text-left md:text-right border-t md:border-t-0 border-slate-100 mt-2 md:mt-0">
              <Link href={`/dashboard/testimonials/${testimonial.id}/edit`} className="text-[#E87722] font-bold text-xs hover:underline">Edit</Link>
            </td>
          </tr>
        )}
      />
    </>
  )
}