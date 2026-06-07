import { getTags } from "@/actions/misc.actions"
import { SearchForm } from "../../../components/admin/BlogTableComponents"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminTagsPage({ searchParams }: { searchParams: { page?: string; search?: string } }) {
  const data = await getTags({
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: 50,
    search: searchParams.search,
  }) as Awaited<ReturnType<typeof getTags>>

  return (
    <div className="space-y-6 font-jakarta">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Tags</h1>
        <Link href="/dashboard/tags/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">+ New Tag</Link>
      </div>
      <div className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-md">
        <SearchForm placeholder="Cari tag..." />
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Slug</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data as any).data?.map((t: any) => (
              <tr key={t.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{t.name}</td>
                <td className="px-4 py-3 text-sm text-slate-400">{t.slug}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link href={`/dashboard/tags/${t.id}/edit`} className="text-blue-600 hover:text-blue-800 text-sm">Edit</Link>
                </td>
              </tr>
            ))}
            {!(data as any).data?.length && <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-400">No tags found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}