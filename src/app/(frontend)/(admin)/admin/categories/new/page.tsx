import { prisma } from "@/lib/prisma"

export default async function AdminNewCategoryPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold text-slate-800">New Category</h1>
      <CategoryForm />
    </div>
  )
}

function CategoryForm({ category }: { category?: any }) {
  const isEdit = !!category
  return (
    <form action={isEdit ? `/api/categories/${category.id}` : "/api/categories"} method={isEdit ? "PUT" : "POST"} className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
        <input name="name" defaultValue={category?.name || ""} className="w-full px-3 py-2 border border-slate-300 rounded" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
        <input name="slug" defaultValue={category?.slug || ""} className="w-full px-3 py-2 border border-slate-300 rounded" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
        <select name="type" defaultValue={category?.type || "blog"} className="w-full px-3 py-2 border border-slate-300 rounded">
          <option value="blog">Blog</option>
          <option value="project">Project</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea name="description" defaultValue={category?.description || ""} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded" />
      </div>
      <div className="flex gap-3">
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">{isEdit ? "Update" : "Create"}</button>
        <a href="/admin/categories" className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50">Cancel</a>
      </div>
    </form>
  )
}
