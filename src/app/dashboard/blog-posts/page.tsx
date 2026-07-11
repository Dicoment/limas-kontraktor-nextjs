import { getBlogPosts } from "@/actions/blog-post.actions"
import { SearchForm, Pagination } from "@/components/admin/BlogTableComponents"
import { BlogPostTable } from "./_components/BlogPostTable"

import Link from "next/link"
import Button from "@/components/ui/Button"

export const dynamic = "force-dynamic"

export default async function AdminBlogPostsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const params = await searchParams
  const blogPostsData = await getBlogPosts({
    page: params.page ? parseInt(params.page) : 1,
    limit: 10,
    search: params.search,
  })

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <SearchForm placeholder="Cari Artikel..." />
  <Link href="/dashboard/blog-posts/new" className="w-full sm:w-auto">
    <Button variant="primary" size="sm" className="w-full sm:w-auto">
      + New Post
    </Button>
  </Link>
</div>

      <BlogPostTable initialData={blogPostsData.posts} />

      <Pagination currentPage={blogPostsData.page} totalPages={blogPostsData.totalPages} />
    </div>
  )
}