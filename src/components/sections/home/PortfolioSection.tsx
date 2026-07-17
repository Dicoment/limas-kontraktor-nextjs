import { prisma } from "@/lib/prisma"
import PortfolioCarousel from "./PortofolioCarousel"
import Button from "@/components/ui/Button"
import { IoArrowForwardSharp } from "react-icons/io5"

export default async function PortfolioSection() {
  const allProjects = await prisma.project.findMany({
    orderBy: {
      createdAt: "desc", 
    },
    take: 4, 
    select: {
      id: true,
      title: true,
      slug: true,
      location: true,
      client: true,
      limasRole: true,
      coverImage: true,
      status: true, // Ambil kolom status real (DRAFT, ONGOING, COMPLETED)
      categoryProjects: {
        select: {
          catEntry: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  // Jika database benar-benar kosong melompong, section tidak akan me-render apa-apa
  if (allProjects.length === 0) return null

  return (
    <section className="py-24 bg-[#FAFBFB] overflow-hidden relative border-t border-slate-100">
      
      {/* ── HIGH PERFORMANCE NATIVE INLINE CSS ANIMATIONS ── */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes portfolioFadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .portfolio-animate {
          animation: portfolioFadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* Aksen Latar Belakang Garis Blueprint Arsitektur */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#0F2340_1px,transparent_1px),linear-gradient(to_bottom,#0F2340_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 mb-16 portfolio-animate">
        
        {/* Aksen Border Atas Tipis untuk Memperkuat Struktur Desain */}
        <div className="w-20 h-[3px] bg-[#E87722] mb-6 rounded-full" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#0F2340]/5 border border-[#0F2340]/10 px-4 py-1.5 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E87722] animate-pulse" />
              <p className="text-[#0F2340] text-xs font-bold tracking-widest uppercase">Eksplorasi Karya</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0F2340] tracking-tight uppercase leading-[1.15]">
              Kualitas Pembuktian <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E87722] to-orange-500">Hasil Konstruksi</span>
            </h2>
          </div>
          
          <div className="lg:col-span-5 border-l-2 border-gray-200/80 pl-6 lg:mb-1">
            <p className="text-gray-500 font-light text-sm md:text-base leading-relaxed">
              Jelajahi seluruh dokumentasi pengerjaan fisik kami di lapangan, mulai dari proyek konstruksi yang telah selesai hingga yang sedang dalam proses pembangunan.
            </p>
          </div>
        </div>
      </div>

      {/* Wrapper Carousel dengan Animasi Masuk */}
      <div className="portfolio-animate" style={{ animationDelay: "150ms", opacity: 0 }}>
        {/* Kirim data real gabungan semua status ke Swiper */}
        <PortfolioCarousel projects={allProjects} />
      </div>

      {/* Tombol Aksi Bawah */}
      <div className="flex justify-center mt-14 relative z-20 portfolio-animate" style={{ animationDelay: "300ms", opacity: 0 }}>
        <Button
          href="/proyek"
          variant="outline"
          size="lg"
          className="gap-2.5 group !text-[#0F2340] !border-[#0F2340]/20 hover:!bg-[#0F2340] hover:!text-white shadow-sm transition-all duration-300"
        >
          Lihat Semua Portofolio
          <IoArrowForwardSharp size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>
    </section>
  )
}