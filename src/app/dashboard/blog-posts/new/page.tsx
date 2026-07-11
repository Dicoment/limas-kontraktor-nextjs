import { getAllCategories } from "@/actions/project.actions"
import { getAllTags } from "@/actions/blog-post.actions"
import BlogPostFormClient from "@/components/blog-post/BlogPostFormClient"

export const dynamic = "force-dynamic"

export default async function NewBlogPostPage() {
  // PENTING: type "blog" — jangan panggil getAllCategories() tanpa argumen,
  // nanti kategori Project ikut nyampur (lihat konvensi filter type kategori).
  const [categories, tags] = await Promise.all([getAllCategories("blog"), getAllTags()])

  return <BlogPostFormClient categories={categories} tags={tags} />
}