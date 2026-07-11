import { getTags } from "@/actions/tags.actions";
import { SearchForm, Pagination } from "@/components/admin/BlogTableComponents";
import { TagTable } from "@/app/dashboard/tags/_components/TagTable";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default async function AdminTagsPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const params = await searchParams;
  const data = await getTags({ page: params.page ? parseInt(params.page) : 1, search: params.search });
  return (
        <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <SearchForm placeholder="Cari Tag..." />
  <Link href="/dashboard/tags/new" className="w-full sm:w-auto">
    <Button variant="primary" size="sm" className="w-full sm:w-auto">
      + New Tag
    </Button>
  </Link>
</div>
      <TagTable initialData={data.data} />
      <Pagination currentPage={data.page} totalPages={data.totalPages} />
    </div>
  );
}