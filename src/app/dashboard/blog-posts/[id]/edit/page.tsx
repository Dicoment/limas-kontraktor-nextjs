import { getBlogPostById } from "@/actions/blog-post.actions"
import { getAllCategories } from "@/actions/project.actions"
import { getAllTags } from "@/actions/blog-post.actions"
import BlogPostFormClient from "@/components/blog-post/BlogPostFormClient"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [post, categories, tags] = await Promise.all([
    getBlogPostById(id),
    getAllCategories("blog"),
    getAllTags(),
  ])

  if (!post) redirect("/dashboard/blog-posts")

  return <BlogPostFormClient categories={categories} tags={tags} initialData={post} />
}