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
    <section className="py-24 bg-white overflow-hidden relative border-t border-slate-50">
      <div className="max-w-7xl mx-auto px-6 relative z-10 mb-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#0F2340]/5 border border-[#0F2340]/10 px-4 py-1.5 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E87722] animate-pulse" />
              <p className="text-[#0F2340] text-xs font-semibold tracking-widest uppercase">Eksplorasi Karya</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F2340] tracking-tight uppercase leading-[1.1]">
              Kualitas Pembuktian <br />
              <span className="text-[#E87722]">Hasil Konstruksi</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-2">
            <p className="text-gray-500 font-light text-sm md:text-base leading-relaxed">
              Jelajahi seluruh dokumentasi pengerjaan fisik kami di lapangan, mulai dari proyek konstruksi yang telah selesai hingga yang sedang dalam proses pembangunan.
            </p>
          </div>
        </div>
      </div>

      {/* Kirim data real gabungan semua status ke Swiper */}
      <PortfolioCarousel projects={allProjects} />

      <div className="flex justify-center mt-12 relative z-20">
        <Button
          href="/proyek"
          variant="outline"
          size="lg"
          className="gap-2.5 group !text-[#0F2340] !border-[#0F2340]/20 hover:!bg-[#0F2340] hover:!text-white"
        >
          Lihat Semua Portofolio
          <IoArrowForwardSharp size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>
    </section>
  )
}