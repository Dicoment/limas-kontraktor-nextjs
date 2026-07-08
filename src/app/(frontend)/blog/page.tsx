import { prisma } from "@/lib/prisma"
import BlogListClient from "./Bloglistclient"

export const dynamic = "force-dynamic"

export default async function PublicBlogListPage() {
  // Mengambil data artikel yang berstatus PUBLISHED (jika ada field status)
  // Dilengkapi dengan fallback kategori dan tag yang aman
  const posts = await prisma.blogPost.findMany({
    // Jika di schema ada field status, kamu bisa uncomment baris di bawah:
    // where: { status: "PUBLISHED" }, 
    include: { 
      blogPostCategories: { 
        include: { 
          catEntry: true 
        } 
      }, 
      blogPostTags: { 
        include: { 
          tagEntry: true 
        } 
      } 
    },
    orderBy: { publishedAt: "desc" },
  })

  return <BlogListClient posts={posts} />
}