"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { SearchForm, Pagination } from "@/components/admin/BlogTableComponents"

export default function AdminPagesClient({ searchParams }: { searchParams: { page?: string; search?: string } }) {
  const page = searchParams?.page ? parseInt(searchParams.page) : 1
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [page])

  async function fetchData() {
    setLoading(true)
    try {
      const res = await fetch(`/api/pages?page=${page}&limit=20&search=${searchParams.search || ""}`)
      const result = await res.json()
      setData(result)
    } catch (error) {
      console.error("Failed to fetch pages:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 font-jakarta">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Pages</h1>
        <Link href="/dashboard/pages/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">+ New Page</Link>
      </div>
      <div className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-md">
        <SearchForm placeholder="Cari halaman..." />
      </div>
      {loading ? (
        <div className="p-6">Loading...</div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Slug</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.items?.map((p: any) => (
                  <tr key={p.id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{p.title}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{p.slug}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${p.published ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}>
                        {p.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Link href={`/dashboard/pages/${p.id}/edit`} className="text-blue-600 hover:text-blue-800 text-sm">Edit</Link>
                    </td>
                  </tr>
                ))}
                {!data?.items?.length && <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">No pages found.</td></tr>}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={data?.page} totalPages={data?.totalPages} />
        </>
      )}
    </div>
  )
}