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

export function Table({ 
  headers, 
  rows, 
  emptyMessage = "No data found.", 
  renderRow 
}: TableProps) {
  return (
    <div className="w-full bg-white border border-slate-100 rounded-md overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
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
        <tbody className="divide-y divide-slate-50 text-black">
          {rows && rows.length > 0 ? (
            rows.map((row, index) => renderRow(row, index))
          ) : (
            <tr>
              <td colSpan={headers.length} className="px-5 py-12 text-center text-slate-400 text-xs font-medium">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}