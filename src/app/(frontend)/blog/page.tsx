import { prisma } from "@/lib/prisma"
import BlogListClient from "./Bloglistclient"

export const dynamic = "force-dynamic"

// Next.js 16 App Router menggunakan searchParams berbasis Promise pada Halaman Server
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PublicBlogListPage({ searchParams }: PageProps) {
  // 1. Ambil & validasi query parameter halaman dari URL
  const resolvedParams = await searchParams
  const pageParam = typeof resolvedParams.page === 'string' ? resolvedParams.page : '1'
  const currentPage = Math.max(1, parseInt(pageParam, 10) || 1)

  // 2. Tentukan batasan data per halaman (Limit)
  const postsPerPage = 9 
  const skip = (currentPage - 1) * postsPerPage

  // 3. Jalankan query secara paralel untuk efisiensi waktu load
  const [posts, totalPosts] = await Promise.all([
    // Query A: Mengambil data post untuk halaman aktif saat ini
    prisma.blogPost.findMany({
      // where: { status: "PUBLISHED" }, // Uncomment jika skema memakai status
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
      take: postsPerPage,
      skip: skip,
    }),
    
    // Query B: Menghitung total seluruh post untuk kalkulasi halaman akhir
    prisma.blogPost.count({
      // where: { status: "PUBLISHED" },
    })
  ])

  // 4. Hitung total halaman (minimal 1 halaman jika data kosong)
  const totalPages = Math.ceil(totalPosts / postsPerPage) || 1

  // 5. Kirim data yang sudah bersih ke Client Component
  return (
    <BlogListClient 
      posts={posts} 
      currentPage={currentPage} 
      totalPages={totalPages} 
    />
  )
}