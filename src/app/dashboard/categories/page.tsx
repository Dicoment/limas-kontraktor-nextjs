import { getCategories } from "@/actions/category.actions";
import { SearchForm, Pagination } from "@/components/admin/BlogTableComponents";
import { CategoryTable } from "./_components/CategoryTable";
import Link from "next/link";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; type?: string }>;
}) {
  const params = await searchParams;
  const type = params.type;
  
  const data = await getCategories({
    page: params.page ? parseInt(params.page) : 1,
    limit: 10,
    search: params.search,
    type: type || undefined,
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header: New Category di kanan */}
      <div className="flex items-center justify-end">
        <Link href="/dashboard/categories/new">
          <Button variant="primary" size="sm">+ New Category</Button>
        </Link>
      </div>

      {/* Row Search & Filter: Responsive (Stack di mobile, Sejajar di desktop) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full md:w-auto">
          <SearchForm placeholder="Cari kategori..." />
        </div>
        
        <div className="flex gap-2 bg-slate-50 p-1 rounded-lg w-fit">
          <Link 
            href="?" 
            className={`text-sm px-3 py-1.5 rounded-md transition-all ${!type ? 'bg-white shadow-sm font-bold text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            All
          </Link>
          <Link 
            href="?type=blog" 
            className={`text-sm px-3 py-1.5 rounded-md transition-all ${type === 'blog' ? 'bg-white shadow-sm font-bold text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Blog
          </Link>
          <Link 
            href="?type=project" 
            className={`text-sm px-3 py-1.5 rounded-md transition-all ${type === 'project' ? 'bg-white shadow-sm font-bold text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Project
          </Link>
        </div>
      </div>

      <CategoryTable initialData={(data as any).data || []} />

      <Pagination currentPage={(data as any).page} totalPages={(data as any).totalPages} />
    </div>
  );
}