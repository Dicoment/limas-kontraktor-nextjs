import { getCategories } from "@/actions/category.actions"
import Link from "next/link"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function AdminCategoriesPage({ searchParams }: { searchParams: { page?: string; type?: string } }) {
  const type = searchParams.type
  const data = await getCategories({
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: 20,
    type: type || undefined,
  }) as Awaited<ReturnType<typeof getCategories>>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Categories</h1>
        <div className="flex gap-2">
          <Link href={`?type=blog`} className={`px-3 py-1 text-sm rounded ${type === "blog" ? "bg-blue-600 text-white" : "bg-slate-200"}`}>Blog</Link>
          <Link href={`?type=project`} className={`px-3 py-1 text-sm rounded ${type === "project" ? "bg-blue-600 text-white" : "bg-slate-200"}`}>Project</Link>
          {(!type || type === "blog") ? null : <Link href={`?type=project`} className="text-sm text-blue-600">Show Projects</Link>}
        </div>
        <Link href="/dashboard/categories/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">+ New Category</Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Description</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data as any).data?.map((cat: any) => (
              <tr key={cat.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{cat.name}</td>
                <td className="px-4 py-3 text-sm text-slate-400">{cat.slug}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${cat.type === "blog" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                    {cat.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{cat.description || "—"}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link href={`/dashboard/categories/${cat.id}/edit`} className="text-blue-600 hover:text-blue-800 text-sm">Edit</Link>
                </td>
              </tr>
            ))}
            {!(data as any).data?.length && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No categories found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}