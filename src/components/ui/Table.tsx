import type { ReactNode } from "react"

interface TableHeader {
  key: string
  label: string | ReactNode
  align?: "left" | "right" | "center"
  className?: string
}

interface TableProps {
  headers: TableHeader[]
  rows: any[]
  emptyMessage?: string
  renderRow: (row: any, index: number) => ReactNode
}

/**
 * Komponen tabel generik & reusable (dipakai ProjectTable, nanti
 * BlogPostTable, dll). Struktur di sini cuma ngatur <table>/<thead>
 * jadi responsive (hidden di mobile, table normal di desktop).
 *
 * PENTING buat siapapun yang manggil komponen ini lewat `renderRow`:
 * tiap <tr>/<td> yang kalian return HARUS ikut pola class responsive
 * yang sama (lihat contoh di ProjectTable.tsx) — Table.tsx gak bisa
 * "maksa" style ke JSX opaque yang di-return renderRow.
 */
export function Table({ 
  headers, 
  rows, 
  emptyMessage = "No data found.", 
  renderRow 
}: TableProps) {
  return (
    <div className="w-full lg:bg-white lg:border lg:border-slate-100 rounded-md overflow-hidden">
      <table className="w-full text-left border-collapse block md:table">
        {/* thead disembunyiin total di mobile — labelnya dipindah jadi
            "label kecil" di atas tiap value, dikerjain per-<td> di renderRow */}
        <thead className="hidden md:table-header-group">
          <tr className="border-b border-slate-100 bg-slate-50/70">
            {headers.map((header) => {
              const alignClass = 
                header.align === "right" ? "text-right" : 
                header.align === "center" ? "text-center" : "text-left"
              
              return (
                <th 
                  key={header.key} 
                  className={`px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider ${alignClass} ${header.className || ""}`}
                >
                  {header.label}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="block md:table-row-group divide-y-0 md:divide-y divide-slate-50 text-black">
          {rows && rows.length > 0 ? (
            rows.map((row, index) => renderRow(row, index))
          ) : (
            <tr className="block md:table-row">
              <td colSpan={headers.length} className="block md:table-cell px-5 py-12 text-center text-slate-400 text-xs font-medium">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}