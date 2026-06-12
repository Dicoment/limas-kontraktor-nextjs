import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Proyek | Limas Kontraktor",
  description: "Portofolio proyek konstruksi dan renovasi Limas Kontraktor di Bekasi, Jakarta, dan Jabodetabek.",
}

interface Props {
  searchParams: { category?: string }
}

export default async function ProyekPage({ searchParams }: Props) {
  const activeCategory = searchParams.category ?? "all"

  const [allCategories, allProjects] = await Promise.all([
    prisma.category.findMany({ where: { type: "project" }, orderBy: { name: "asc" } }),
    prisma.project.findMany({
      where: activeCategory !== "all"
        ? { categoryProjects: { some: { catEntry: { slug: activeCategory } } } }
        : undefined,
      include: { categoryProjects: { include: { catEntry: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ])

  return (
    <main className="min-h-screen bg-white font-sans antialiased">

      {/* ── HERO ── */}
<section
  className="relative min-h-[420px] flex flex-col justify-center px-6 pt-36 pb-20 overflow-hidden"
  style={{ backgroundImage: "url('/heroproyek.webp')", backgroundSize: "cover", backgroundPosition: "center" }}
>
  <div className="absolute inset-0 bg-[#0F2340]/85" />
  <div className="absolute top-8 right-16 w-40 h-40 rounded-full border border-white/10" />
  <div className="absolute top-14 right-28 w-20 h-20 rounded-full border border-white/10" />
  <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full border border-white/10 -translate-x-1/2 translate-y-1/2" />
  <div className="max-w-7xl mx-auto w-full relative z-10">
    <p className="text-xs font-bold tracking-widest uppercase text-[#E87722] mb-3">Portofolio</p>
    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">Proyek Kami</h1>
    <p className="text-white/80 text-base md:text-lg max-w-xl leading-relaxed">
    Kumpulan proyek konstruksi dan renovasi terbaik kami yang telah berhasil diselesaikan di Bekasi, Jakarta, dan Seluruh Indonesia.
    </p>
  </div>
</section>

      {/* ── FILTER ── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/proyek"
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeCategory === "all"
                ? "bg-[#0F2340] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Semua
          </Link>
          {allCategories.map((c: { id: string; slug: string; name: string }) => (
            <Link
              key={c.id}
              href={`/proyek?category=${c.slug}`}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeCategory === c.slug
                  ? "bg-[#0F2340] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {allProjects.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <p className="text-lg font-medium">Belum ada proyek di kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProjects.map((project: { id: string; slug: string; title: string; description: string | null; coverImage: string | null; client: string | null; location: string | null; status: string; categoryProjects: { catEntry: { id: string; name: string } }[]; createdAt: Date }) => (
              <Link
                key={project.id}
                href={`/proyek/${project.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-300 text-sm">
                      No Image
                    </div>
                  )}
                  {/* Status badge */}
                  <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full ${
                    project.status === "COMPLETED" ? "bg-emerald-500 text-white" :
                    project.status === "ONGOING" ? "bg-blue-500 text-white" :
                    "bg-amber-500 text-white"
                  }`}>
                    {project.status === "COMPLETED" ? "Selesai" :
                     project.status === "ONGOING" ? "Berjalan" : "Perencanaan"}
                  </span>
                  {/* Category badges */}
                  <div className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end">
                    {project.categoryProjects.slice(0, 2).map(({ catEntry }) => (
                      <span key={catEntry.id} className="px-2 py-1 text-xs font-medium bg-black/50 text-white rounded-full backdrop-blur-sm">
                        {catEntry.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="font-black text-lg text-slate-900 group-hover:text-[#E87722] transition-colors leading-snug">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-2 text-xs text-slate-400 border-t border-slate-100">
                    <span className="font-medium">{project.client || project.location || "Indonesia"}</span>
                    <span>{new Date(project.createdAt).toLocaleDateString("id-ID", { year: "numeric", month: "short" })}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="relative bg-[#0F2340] rounded-2xl px-10 py-16 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full border border-white/10 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full border border-white/10 translate-x-1/2 translate-y-1/2" />
          <p className="text-xs font-bold tracking-widest uppercase text-[#E87722] mb-3 relative">Mari Bekerja Sama</p>
          <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4 relative">
            Proyek Anda berikutnya bersama kami?
          </h2>
          <p className="text-white/80 text-sm max-w-lg mx-auto mb-8 relative">
            Konsultasikan rencana konstruksi atau renovasi Anda dengan tim profesional Limas Kontraktor.
          </p>
          
           <a href="https://wa.me/6282320721150"
            target="_blank"
            rel="noreferrer"
            className="relative inline-flex items-center gap-2 bg-[#E87722] hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full text-sm transition-colors"
          >
            Konsultasi Gratis
          </a>
        </div>
      </section>

    </main>
  )
}