import { prisma } from "@/lib/prisma"
import Link from "next/link"
import db from "@/lib/prisma"
import CtaBanner from "@/components/layout/footer/CtaBanner"
import { IoArrowForwardSharp } from "react-icons/io5"

async function getWaNumber() {
  const setting = await db.setting.findUnique({
    where: { key: "contact_phone1" } 
  });
  
  const rawNumber = setting?.value || "6282320721150";
  return rawNumber.replace(/[^0-9]/g, "");
}
export const dynamic = "force-dynamic"

export const metadata = {
  title: "Proyek | Limas Kontraktor",
  description: "Portofolio proyek konstruksi dan renovasi Limas Kontraktor di Bekasi, Jakarta, dan Jabodetabek.",
}

interface Props {
  searchParams: { category?: string }
}
export default async function ProyekPage({ searchParams }: Props) {
  const sParams = await searchParams;
  const activeCategory = sParams?.category ?? "all";

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
    <main className="min-h-screen bg-[#F8F9FA] font-sans antialiased">

      {/* ── HERO ── */}
<section
        className="relative min-h-[60vh] flex flex-col justify-center px-6 pt-36 pb-20 overflow-hidden"
        style={{ backgroundImage: "url('/images/heroproyek.webp')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-[#0F2340]/85" />
        <div className="absolute top-8 right-16 w-40 h-40 rounded-full border border-white/10" />
        <div className="absolute top-14 right-28 w-20 h-20 rounded-full border border-white/10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full border border-white/10 -translate-x-1/2 translate-y-1/2" />
        
        {/* Kontainer Utama Jadi Center-Aligned */}
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center w-full relative z-10">
          <p className="text-xs font-bold tracking-widest uppercase text-[#FFCC00] mb-3">Portofolio</p>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">Proyek Kami</h1>
          <p className="text-white/80 text-base md:text-lg max-w-xl leading-relaxed mb-8">
            Kumpulan proyek konstruksi dan renovasi terbaik kami yang telah berhasil diselesaikan di Bekasi, Jakarta, dan Seluruh Indonesia.
          </p>

          {/* ── BREADCRUMB COMPONENT ── */}
          <nav className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-white/60">
            <Link href="/" className="hover:text-[#FFCC00] transition-colors">
              Beranda
            </Link>
            <span className="text-white/30 font-light text-[10px] select-none">/</span>
            <span className="text-[#FFCC00] select-none">
              Proyek
            </span>
          </nav>
        </div>
      </section>

      {/* ── FILTER (WARNA BERUBAH SAAT AKTIF) ── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/proyek"
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeCategory === "all"
                ? "bg-neutral-900 text-white"
                : "bg-white text-neutral-600 border border-gray-100 hover:bg-gray-50 shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
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
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-600 border border-gray-100 hover:bg-gray-50 shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ── GRID LAYOUT ── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {allProjects.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <p className="text-lg font-medium">Belum ada proyek di kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProjects.map((project: { id: string; slug: string; title: string; description: string | null; coverImage: string | null; client: string | null; location: string | null; status: string; categoryProjects: { catEntry: { id: string; name: string } }[]; createdAt: Date }) => (
  <Link
    key={project.id}
    href={`/proyek/${project.slug}`}
    className="group relative aspect-[4/3.8] w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-md block"
  >
    {/* 1. GAMBAR UTAMA (Full Cover + Hover Zoom) */}
    {project.coverImage ? (
      <img
        src={project.coverImage}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-105"
      />
    ) : (
      <div className="flex items-center justify-center h-full text-neutral-500 text-xs font-mono">
        NO IMAGE AVAILABLE
      </div>
    )}

    {/* 2. OVERLAY GRADIENT GELAP (Untuk teks di bawah biar kontras) */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5 opacity-100 transition-opacity duration-300" />

    {/* 3. TOMBOL LINGKARAN "VIEW" (Hanya muncul pas di-hover di tengah) */}
    <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out pointer-events-none select-none">
      View
    </div>

    {/* 4. IKON PANAH KECIL DI POJOK KANAN ATAS */}
    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black text-white flex items-center justify-center border border-white/5 transition-colors duration-300 group-hover:bg-white group-hover:text-black">
      <IoArrowForwardSharp size={14} className="transform -rotate-45" />
    </div>

    {/* 5. KONTEN TEKS  */}
    <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1 z-10">
      <h3 className="font-bold text-lg md:text-xl text-white tracking-tight leading-snug">
        {project.title}
      </h3>
      <p className="text-gray-300/90 text-xs font-light tracking-wide">
        {project.categoryProjects.map(({ catEntry }) => catEntry.name).join(", ") || "Residential Architecture"}
      </p>
    </div>

    {/* 6. BADGE STATUS */}
    <span className={`absolute top-4 left-4 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded backdrop-blur-md text-white border border-white/10 ${
      project.status === "COMPLETED" ? "bg-emerald-600/80" :
      project.status === "ONGOING" ? "bg-blue-600/80" : "bg-amber-600/80"
    }`}>
      {project.status === "COMPLETED" ? "Selesai" : project.status === "ONGOING" ? "Berjalan" : "Plan"}
    </span>
  </Link>
))}
          </div>
        )}
      </section>

    </main>
  )
}