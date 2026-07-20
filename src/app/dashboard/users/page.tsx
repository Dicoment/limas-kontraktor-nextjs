import { getUsers } from "@/actions/user.actions"
import { auth } from "@/lib/auth"
import { Pagination } from "@/components/admin/BlogTableComponents"
import { UserTable } from "./_components/UserTable"
import Link from "next/link"
import Button from "@/components/ui/Button"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const params = await searchParams
  const data = await getUsers({ page: params.page ? parseInt(params.page) : 1, limit: 20 })

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-900">Users</h1>
        <Link href="/dashboard/users/new">
          <Button variant="primary" size="sm">+ Tambah User</Button>
        </Link>
      </div>
      <UserTable initialData={data.data} currentUserId={session.user.id} />
      <Pagination currentPage={data.page} totalPages={data.totalPages} />
    </div>
  )
}