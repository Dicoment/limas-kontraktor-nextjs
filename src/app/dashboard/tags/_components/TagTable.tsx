"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table } from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteTags } from "@/actions/tags.actions";

export function TagTable({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Yakin hapus ${selectedIds.length} tag?`)) return;
    setIsDeleting(true);
    try {
      await deleteTags(selectedIds);
      setSelectedIds([]);
      router.refresh();
    } catch (err) {
      alert("Gagal menghapus tag. Pastikan tidak sedang digunakan.");
    } finally {
      setIsDeleting(false);
    }
  };

  const headers = [
    { key: "select", label: <input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? initialData.map(t => t.id) : [])} checked={selectedIds.length === initialData.length && initialData.length > 0} className="rounded border-slate-300" />, className: "w-10" },
    { key: "name", label: "NAME" },
    { key: "slug", label: "SLUG" },
    { key: "actions", label: "ACTIONS", align: "right" as const },
  ];

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

      <Table headers={headers} rows={initialData} emptyMessage="Belum ada tag." renderRow={(tag) => (
        <tr key={tag.id} className="block md:table-row mb-3 md:mb-0 rounded-lg md:rounded-none border border-slate-200 md:border-0 md:border-b md:border-slate-50 shadow-sm md:shadow-none p-3 md:p-0 hover:bg-slate-50">
          <td className="hidden md:table-cell md:px-5 md:py-4">
            <input type="checkbox" checked={selectedIds.includes(tag.id)} onChange={() => setSelectedIds(prev => prev.includes(tag.id) ? prev.filter(i => i !== tag.id) : [...prev, tag.id])} className="rounded border-slate-300" />
          </td>
          <td className="block md:table-cell md:px-5 md:py-4 font-bold text-slate-800 before:content-['NAME'] before:block before:text-[10px] before:font-bold before:text-slate-400 before:uppercase md:before:content-none">
            {tag.name}
          </td>
          <td className="block md:table-cell md:px-5 md:py-4 text-sm text-slate-600 before:content-['SLUG'] before:block before:text-[10px] before:font-bold before:text-slate-400 before:uppercase md:before:content-none">
            {tag.slug}
          </td>
          <td className="block md:table-cell md:px-5 md:py-4 pt-2 md:pt-4 text-left md:text-right border-t md:border-t-0 border-slate-100 before:content-['ACTIONS'] before:block before:text-[10px] before:font-bold before:text-slate-400 before:uppercase md:before:content-none">
            <Link href={`/dashboard/tags/${tag.id}/edit`} className="text-[#E87722] font-bold text-xs hover:underline">Edit</Link>
          </td>
        </tr>
      )} />
    </>
  );
}