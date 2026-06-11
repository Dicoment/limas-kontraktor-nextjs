import { prisma } from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"

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

  // Fungsi helper untuk memformat tanggal Indonesia
  const formatDate = (date: Date | null) => {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Hero Section Banner */}
      <div className="bg-[#0F2340] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Blog & Inspirasi Bangunan
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
            Temukan tips, artikel edukasi konstruksi, tren desain arsitektur, dan kabar terbaru dari Limas Kontraktor.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 font-medium">Belum ada artikel yang diterbitkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300"
              >
                {/* Gambar Cover */}
                <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                      <span>No Image Available</span>
                    </div>
                  )}
                </div>

                {/* Konten Kartu */}
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  {/* Kategori */}
                  <div className="flex gap-2 flex-wrap">
                    {(post.blogPostCategories || []).map((cat: any) => (
                      <span 
                        key={cat.categoryId} 
                        className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-orange-50 text-[#E87722]"
                      >
                        {cat.catEntry.name}
                      </span>
                    ))}
                  </div>

                  {/* Metadata (Tanggal & Penulis) */}
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-slate-400" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={14} className="text-slate-400" />
                      <span>Admin</span>
                    </div>
                  </div>

                  {/* Judul Post */}
                  <h3 className="font-bold text-lg text-slate-800 leading-snug tracking-tight group-hover:text-[#E87722] transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug || post.id}`}>
                      {post.title}
                    </Link>
                  </h3>

                  {/* Ringkasan/Excerpt */}
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 flex-grow">
                    {post.excerpt || (post.content ? post.content.replace(/<[^>]*>/g, "").slice(0, 150) + "..." : "")}
                  </p>

                  {/* Tombol Aksi */}
                  <div className="pt-2 border-t border-slate-50">
                    <Link 
                      href={`/blog/${post.slug || post.id}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#0F2340] hover:text-[#E87722] transition-colors group/btn"
                    >
                      Baca Selengkapnya
                      <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}