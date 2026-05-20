import { getTeams } from "@/actions/misc.actions"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminTeamsPage({ searchParams }: { searchParams: { page?: string; search?: string } }) {
  const data = await getTeams({
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: 20,
    search: searchParams.search,
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Teams</h1>
        <Link href="/admin/teams/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">+ New Team</Link>
      </div>
      <form method="GET" className="flex gap-2">
        <input name="search" defaultValue={searchParams.search || ""} placeholder="Cari..." className="px-3 py-2 border border-slate-300 rounded-md text-sm w-64" />
        <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm">Search</button>
      </form>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Position</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Order</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data as any).data?.map((t: any) => (
              <tr key={t.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{t.name}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{t.position || "—"}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{t.email || "—"}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{t.displayOrder ?? "—"}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link href={`/admin/teams/${t.id}/edit`} className="text-blue-600 hover:text-blue-800 text-sm">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}