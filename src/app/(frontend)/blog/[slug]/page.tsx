import { prisma } from "@/lib/prisma"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, User, Tag, Search, TrendingUp, PhoneCall, ArrowRight, Grid } from "lucide-react"

// NOTE: Memaksa halaman ini selalu dirender di sisi server (SSR) pada setiap request.
// Ini krusial karena isi blog, dynamic metadata, dan data artikel terkait bergantung penuh pada data realtime di database PostgreSQL.
export const dynamic = "force-dynamic"

/**
 * Interface standar untuk menangkap parameter routing dinamis di Next.js App Router.
 * NOTE: Sejak Next.js 15, objek `params` wajib berupa Promise dan dibaca secara asinkronus (async/await)
 * untuk mendukung arsitektur Partial Prerendering (PPR).
 */
interface Props {
  params: Promise<{ slug: string }>
}

// ============================================================================
// 1. DYNAMIC METADATA GENERATOR (SEO ENGINE)
// ============================================================================

/**
 * Generator otomatis untuk meta tag SEO (Title, Description, OpenGraph, Twitter Card).
 * Dieksekusi otomatis oleh Next.js sebelum komponen utama merender HTML ke client.
 * * @param {Props} props - Parameter berisi slug artikel dari URL.
 * @returns {Promise<Metadata>} Objek konfigurasi metadata standar Next.js.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Unwrapping parameter slug secara asinkronus sesuai standar Next.js 15
  const { slug } = await params
  
  const post = await prisma.blogPost.findUnique({ where: { slug } })
  
  // Fallback title jika rute diakses tapi record tidak ditemukan di database
  if (!post) return { title: "Artikel Tidak Ditemukan - Limas Kontraktor" }
  
  // Regex untuk membersihkan tag HTML (rich text editor) agar deskripsi SEO di Google SERP bersih berupa teks biasa.
  // Dibatasi maksimal 160 karakter agar tidak terpotong (truncated) oleh algoritma pencarian Google.
  const cleanExcerpt = post.excerpt || post.content?.replace(/<[^>]*>/g, "").slice(0, 160) || ""
  
  return {
    title: post.seoTitle || `${post.title} - Limas Kontraktor`,
    description: post.seoDescription || cleanExcerpt,
    openGraph: {
      title: post.title,
      description: cleanExcerpt,
      type: "article",
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  }
}

// ============================================================================
// 2. MAIN SERVER COMPONENT (PAGE VIEW)
// ============================================================================

/**
 * Komponen halaman utama Detail Artikel Blog (Server Side Rendered).
 * Menangani fetch data utama, ekstraksi kategori untuk relasi, serta pencarian artikel terkait.
 */
export default async function PublicBlogDetailPage({ params }: Props) {
  // Membuka data slug dari URL
  const { slug } = await params
  
  // Fetch data artikel utama beserta relasi Many-to-Many untuk Kategori dan Tags
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { 
      blogPostCategories: { include: { catEntry: true } }, 
      blogPostTags: { include: { tagEntry: true } },
    },
  })

  // Memicu halaman template 404 bawaan Next.js jika slug salah/tidak terdaftar di DB
  if (!post) notFound()

  // Fetch data untuk Widget Sidebar: Ambil 3 artikel terbaru selain artikel yang sedang dibaca.
  // PENTING: Hanya mengambil artikel dengan flag `published: true` demi keamanan data draf internal.
  const trendingPosts = await prisma.blogPost.findMany({
    where: { 
      NOT: { id: post.id },
      published: true 
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  })

  // Fetch data untuk Seksi Rekomendasi (Related Posts):
  // 1. Ambil ID dari semua kategori yang melekat pada artikel aktif ini.
  // 2. Cari maksimal 6 artikel lain yang memiliki salah satu (intersection) kategori yang sama untuk mengisi grid layout 3x2.
  const categoryIds = post.blogPostCategories.map((c: any) => c.categoryId)
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      NOT: { id: post.id },
      published: true,
      blogPostCategories: {
        some: {
          categoryId: { in: categoryIds }
        }
      }
    },
    take: 6,
    include: {
      blogPostCategories: {
        include: {
          catEntry: true
        }
      }
    },
    orderBy: { publishedAt: "desc" },
  })

  /**
   * Helper internal untuk standardisasi format tanggal lokal Indonesia (WIB/WIT/WITA).
   * Contoh Output: "11 Juni 2026"
   */
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
      <article className="pb-12">
        
        {/* HEADER BANNER SECTION */}
        {/* NOTE: Padding top sengaja diset tinggi (pt-36) untuk menghindari konten tertutup oleh Floating Navbar */}
        <header className="bg-[#0F2340] text-white pt-36 pb-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto space-y-5">
            
            {/* Render List Kategori (Badge Style) */}
            <div className="flex gap-2 flex-wrap">
              {(post.blogPostCategories || []).map((c: any) => (
                <span 
                  key={c.categoryId} 
                  className="px-3.5 py-1 text-xs md:text-sm font-bold rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 tracking-wide uppercase"
                >
                  {c.catEntry.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-5xl text-white">
              {post.title}
            </h1>

            {/* Metadata Penulis & Waktu Publish */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm md:text-base text-gray-300 pt-5 border-t border-white/10 font-medium">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-orange-400" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={18} className="text-orange-400" />
                <span>Oleh: Tim Ahli Limas Kontraktor</span>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN BODY CONTENT LAYOUT */}
        <div className="max-w-7xl mx-auto px-6 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            
            {/* SEKSI KIRI: Detail Artikel Utama */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-12 space-y-8">
                
                {/* Image Wrapper dengan Aspek Rasio Pasti untuk Mencegah Cumulative Layout Shift (CLS) */}
                {post.coverImage && (
                  <div className="relative w-full h-[280px] md:h-[480px] rounded-xl overflow-hidden bg-slate-100 shadow-inner">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      priority // Ditambahkan priority karena elemen ini adalah LCP (Largest Contentful Paint) di view port atas
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Inject isi HTML dari Rich Text Editor Editor CMS.
                    Styling diatur menggunakan Tailwind `@tailwindcss/typography` (class `prose`) */}
                <div 
                  className="prose prose-slate max-w-none text-slate-800 text-base md:text-lg leading-relaxed
                    prose-headings:font-extrabold prose-headings:text-slate-900 prose-headings:tracking-tight
                    prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
                    prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                    prose-p:mb-5 prose-p:text-slate-800 prose-p:leading-relaxed
                    prose-strong:text-slate-900 font-normal
                    prose-img:rounded-xl prose-img:my-6"
                  dangerouslySetInnerHTML={{ __html: post.content || "" }}
                />

                {/* Render List Hashtag / Tags */}
                {(post.blogPostTags || []).length > 0 && (
                  <div className="pt-6 border-t border-slate-100 flex items-start gap-3">
                    <Tag size={20} className="text-slate-400 mt-1 shrink-0" />
                    <div className="flex flex-wrap gap-2">
                      {post.blogPostTags.map((t: any) => (
                        <span key={t.tagId} className="text-sm bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md font-semibold">
                          #{t.tagEntry.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SEKSI KANAN: Sidebar Sticky Widget Area */}
            <aside className="space-y-8 lg:sticky lg:top-28">
              
              {/* Widget 1: Formulir Pencarian Teks */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
                <h3 className="font-extrabold text-sm md:text-base text-slate-900 uppercase tracking-wider">Cari Artikel</h3>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Ketik kata kunci..." 
                    className="w-full pl-4 pr-12 py-3 border border-slate-200 rounded-lg text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                  {/* FIX: Menggunakan 'Search' kapital bawaan Lucide, bukan tag bawan html 'search' kecil */}
                  <Search size={18} className="absolute right-4 top-3.5 text-slate-400" />
                </div>
              </div>

              {/* Widget 2: Daftar Artikel Terbaru */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <TrendingUp size={18} className="text-orange-500" />
                  <h3 className="font-extrabold text-sm md:text-base text-slate-900 uppercase tracking-wider">Artikel Terbaru</h3>
                </div>
                <div className="space-y-5">
                  {trendingPosts.map((tPost: { id: string; slug: string; title: string; coverImage: string | null; publishedAt: Date | null }) => (
                    <Link href={`/blog/${tPost.slug}`} key={tPost.id} className="flex gap-4 group items-center">
                      <div className="relative w-24 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0 shadow-sm">
                        {tPost.coverImage && <Image src={tPost.coverImage} alt={tPost.title} fill className="object-cover" />}
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-sm md:text-base text-slate-900 group-hover:text-orange-500 line-clamp-2 transition-colors leading-snug">
                          {tPost.title}
                        </h4>
                        <span className="text-xs md:text-sm text-slate-400 font-medium block">{formatDate(tPost.publishedAt)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Widget 3: CTA Box Interaktif (Lead Magnet) */}
              <div className="bg-gradient-to-br from-[#0F2340] to-[#163159] text-white p-8 rounded-xl shadow-md text-center space-y-5 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-orange-500/10 rounded-full blur-xl"></div>
                <h3 className="font-extrabold text-xl leading-snug">Mau Bangun atau Renovasi Rumah?</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Konsultasikan rencana pembangunan Anda bersama tim ahli dari Limas Kontraktor secara gratis.
                </p>
                <a 
                  href="/kontak" 
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-sm rounded-lg shadow transition-all group"
                >
                  <PhoneCall size={16} className="animate-pulse" />
                  Hubungi Kami Sekarang
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </aside>

          </div>
        </div>
      </article>

      {/* ============================================================================
      // 3. FULL WIDTH RELATED POSTS GRID (BOTTOM BANNER)
      // ============================================================================ */}
      {relatedPosts.length > 0 && (
        <section className="bg-white border-t border-slate-200/60 py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                  Artikel Terkait
                </h2>
                <p className="text-base text-slate-500 font-medium">
                  Mungkin Anda juga tertarik dengan edukasi dan tips konstruksi berikut ini
                </p>
              </div>
            </div>

            {/* Grid dinamis: Otomatis 1 kolom di mobile, 2 di tablet, dan 3 kolom di desktop monitor */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((rPost: any) => (
                <Link 
                  href={`/blog/${rPost.slug}`} 
                  key={rPost.id} 
                  className="group bg-slate-50 rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-slate-200/80 transition-all duration-300"
                >
                  <div className="relative h-56 w-full bg-slate-200 overflow-hidden">
                    {rPost.coverImage && (
                      <Image 
                        src={rPost.coverImage} 
                        alt={rPost.title} 
                        fill 
                        className="object-cover group-hover:scale-103 transition-transform duration-500" 
                      />
                    )}
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <span className="text-xs md:text-sm font-bold text-orange-500 uppercase tracking-wider block">
                        {rPost.blogPostCategories?.[0]?.catEntry?.name || "Edukasi"}
                      </span>
                      <h4 className="font-extrabold text-lg md:text-xl text-slate-900 group-hover:text-orange-500 line-clamp-2 transition-colors leading-snug">
                        {rPost.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium pt-4 border-t border-slate-200/60">
                      <Calendar size={16} className="text-slate-400" />
                      <span>{formatDate(rPost.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Tombol Navigasi Kembali ke Hub Halaman Utama Blog */}
            <div className="flex justify-center pt-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#0F2340] text-[#0F2340] hover:bg-[#0F2340] hover:text-white active:bg-slate-950 font-extrabold text-sm md:text-base rounded-lg transition-all group"
              >
                <Grid size={18} />
                Lihat Artikel Lainnya
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}