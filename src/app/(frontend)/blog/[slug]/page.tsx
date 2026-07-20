import { prisma } from "@/lib/prisma"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, User, Tag, Search, TrendingUp, PhoneCall, ArrowRight, Grid } from "lucide-react"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ slug: string }>
}

// ============================================================================
// 1. DYNAMIC METADATA GENERATOR (SEO ENGINE)
// ============================================================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug } })
  
  if (!post) return { title: "Artikel Tidak Ditemukan - Limas Kontraktor" }
  
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
export default async function PublicBlogDetailPage({ params }: Props) {
  const { slug } = await params
  
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { 
      blogPostCategories: { include: { catEntry: true } }, 
      blogPostTags: { include: { tagEntry: true } },
      author: true,
    },
  })

  if (!post) notFound()

  const trendingPosts = await prisma.blogPost.findMany({
    where: { 
      NOT: { id: post.id },
      published: true 
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  })

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

  const formatDate = (date: Date | null) => {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }
  return (
    <div className="bg-white min-h-screen font-sans antialiased text-slate-800">
      
      {/* ============================================================================
      // HERO SECTION: FIXED ALIGNMENT WITH CONTENT & NAV
      // ============================================================================ */}
      <header className="relative w-full min-h-[55vh] md:min-h-[60vh] flex items-end pt-36 pb-16 px-6 md:px-12 bg-slate-900">
        {/* Render Image Thumbnail sebagai Background */}
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="object-cover object-center pointer-events-none opacity-25 mix-blend-luminosity" 
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/50 z-0" />

        {/* FIX: Diubah ke max-w-7xl agar sejajar sempurna dengan Navbar & Grid bawah */}
        <div className="max-w-7xl mx-auto w-full relative z-10 space-y-6">
          
          {/* Badge Kategori */}
          <div className="flex gap-2 flex-wrap">
            {(post.blogPostCategories || []).map((c: any) => (
              <span 
                key={c.categoryId} 
                className="px-3 py-1 text-xs font-bold rounded-full bg-orange-500 text-white tracking-wider uppercase backdrop-blur-sm"
              >
                {c.catEntry.name}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white max-w-5xl drop-shadow-md">
            {post.title}
          </h1>

          {/* Metadata Penulis & Tanggal */}
          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/20 font-medium w-full max-w-5xl">
            {/* Real Author Info */}
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white/80 bg-slate-800 shrink-0 shadow-sm">
                {post.author?.avatar ? (
                  <Image 
                    src={post.author.avatar} 
                    alt={post.author.name || "Author"} 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-orange-500 text-white font-extrabold uppercase text-sm">
                    {post.author?.name?.slice(0, 2) || "UA"}
                  </div>
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs text-slate-400 font-light">Penulis</span>
                <span className="text-sm md:text-base text-white font-bold tracking-wide">
                  {post.author?.name || "Admin Limas"}
                </span>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-px bg-white/20"></div>

            {/* Date Info */}
            <div className="flex items-center gap-3 text-slate-200">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                <Calendar size={16} className="text-orange-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs text-slate-400 font-light">Diterbitkan</span>
                <span className="text-sm md:text-base font-semibold">{formatDate(post.publishedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================================
      // MAIN CONTENT SECTION: CLEAN EDITORIAL LAYOUT
      // ============================================================================ */}
      {/* Container utama menggunakan max-w-7xl dan padding px-6 md:px-12 sama seperti Hero */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          
          {/* SEKSI KIRI: Body Teks Utama Artikel */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* [BARU] MENAMPILKAN THUMBNAIL NYATA SEBELUM ARTIKEL DIMULAI */}
            {post.coverImage && (
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/40">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-w-768px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
            )}

            {/* Isi Artikel */}
            <div 
              className="prose prose-slate max-w-none text-slate-800 text-lg md:text-xl leading-relaxed font-normal
                prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
                prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:border-b prose-h2:pb-2 prose-h2:border-slate-100
                prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:mb-6 prose-p:leading-loose text-justify
                prose-strong:text-slate-900 prose-strong:font-bold
                prose-img:rounded-2xl prose-img:my-8 prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />

            {/* Tags / Hashtags Ringan */}
            {(post.blogPostTags || []).length > 0 && (
              <div className="pt-8 border-t border-slate-100 flex items-center gap-3 flex-wrap">
                <Tag size={18} className="text-slate-400 shrink-0" />
                <div className="flex flex-wrap gap-2">
                  {post.blogPostTags.map((t: any) => (
                    <span key={t.tagId} className="text-xs font-semibold bg-slate-50 border border-slate-200/60 text-slate-600 px-3 py-1.5 rounded-full transition-colors hover:bg-slate-100">
                      #{t.tagEntry.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SEKSI KANAN: Clean Sidebar Area */}
<aside className="space-y-12 lg:sticky lg:top-28 border-t lg:border-t-0 pt-10 lg:pt-0 border-slate-100">
  
  {/* Widget 1: Minimalist Search */}
  <div className="space-y-3">
    <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Cari Artikel</h3>
    <div className="relative">
      <input 
        type="text" 
        placeholder="Ketik kata kunci pencarian..." 
        className="w-full pl-0 pr-10 py-3 bg-transparent border-b-2 border-slate-200 text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
      />
      <Search size={18} className="absolute right-2 top-3.5 text-slate-400" />
    </div>
  </div>

  {/* Widget 2: Clean Latest Posts */}
  <div className="space-y-6">
    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
      <TrendingUp size={16} className="text-orange-500" />
      <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Artikel Terbaru</h3>
    </div>
    <div className="space-y-6">
      {trendingPosts.map((tPost: any) => (
        <Link href={`/blog/${tPost.slug}`} key={tPost.id} className="flex gap-4 group items-start">
          <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
            {tPost.coverImage && <Image src={tPost.coverImage} alt={tPost.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />}
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-800 group-hover:text-orange-500 line-clamp-2 transition-colors leading-snug">
              {tPost.title}
            </h4>
            <span className="text-xs text-slate-400 font-normal block">{formatDate(tPost.publishedAt)}</span>
          </div>
        </Link>
      ))}
    </div>
  </div>

  {/* Widget 3: Premium CTA Box */}
  <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl space-y-5 text-left">
    <h3 className="font-black text-xl text-slate-900 leading-snug">Merencanakan Pembangunan & Renovasi?</h3>
    <p className="text-sm text-slate-500 leading-relaxed">
      Konsultasikan kebutuhan arsitektur dan konstruksi Anda bersama tim ahli Limas Kontraktor Sekarang!
    </p>
    <a 
      href="/kontak" 
      className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#0F2340] hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-sm rounded-xl transition-all group shadow-sm"
    >
      <PhoneCall size={14} />
      Mulai Konsultasi
      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
    </a>
  </div>
</aside>

        </div>
      </div>

      {/* ============================================================================
      // RELATED POSTS SECTION
      // ============================================================================ */}
      {relatedPosts.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-100 py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="space-y-2 text-left">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Artikel Terkait
              </h2>
              <p className="text-sm md:text-base text-slate-500 font-normal">
                Edukasi praktis seputar manajemen proyek dan tips konstruksi lainnya.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((rPost: any) => (
                <Link 
                  href={`/blog/${rPost.slug}`} 
                  key={rPost.id} 
                  className="group flex flex-col justify-between space-y-4"
                >
                  <div className="relative h-52 w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200/40">
                    {rPost.coverImage && (
                      <Image 
                        src={rPost.coverImage} 
                        alt={rPost.title} 
                        fill 
                        className="object-cover group-hover:scale-102 transition-transform duration-500" 
                      />
                    )}
                  </div>
                  <div className="space-y-2 flex-grow">
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-wider block">
                      {rPost.blogPostCategories?.[0]?.catEntry?.name || "Konstruksi"}
                    </span>
                    <h4 className="font-bold text-lg text-slate-900 group-hover:text-orange-500 line-clamp-2 transition-colors leading-snug">
                      {rPost.title}
                    </h4>
                  </div>
                  <div className="text-xs text-slate-400 font-medium pt-2 border-t border-slate-100">
                    {formatDate(rPost.publishedAt)}
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex justify-center pt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 font-bold text-sm rounded-xl transition-all group"
              >
                <Grid size={16} />
                Baca Artikel Lainnya
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}