"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AdminLeadsLogsClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [page])

  async function fetchData() {
    setLoading(true)
    try {
      const res = await fetch(`/api/leads-logs?page=${page}&limit=20`)
      const result = await res.json()
      setData(result)
    } catch (error) {
      console.error("Failed to fetch leads logs:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this leads log?")) return
    setDeleting(id)
    try {
      await fetch(`/api/leads-logs/${id}`, { method: "DELETE" })
      router.refresh()
    } catch (error) {
      console.error("Failed to delete:", error)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Leads Log</h1>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Project</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Message</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Date</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.items?.map((log: any) => (
              <tr key={log.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{log.name || "Anonymous"}</td>
                <td className="px-4 py-3">
                  {log.phone ? (
                    <a href={`https://wa.me/${log.phone.replace(/\D/g, "")}`} className="text-green-600 hover:underline">{log.phone}</a>
                  ) : "—"}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{log.projectId ? `ID: ${log.projectId.slice(0, 8)}...` : "—"}</td>
                <td className="px-4 py-3 max-w-xs truncate text-slate-600">{log.message || "—"}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{new Date(log.createdAt).toLocaleDateString("id-ID")}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(log.id)}
                    disabled={deleting === log.id}
                    className="text-red-500 hover:text-red-700 text-sm cursor-pointer disabled:opacity-50"
                  >
                    {deleting === log.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
