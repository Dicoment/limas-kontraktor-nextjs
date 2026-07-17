"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import { IoArrowBackSharp, IoArrowForwardSharp, IoLocationSharp, IoHammerOutline } from "react-icons/io5"
import { LuScaling, LuUser, LuLayers, LuFileText } from "react-icons/lu"
import { MdOutlineVerified } from "react-icons/md"
import Link from "next/link"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

interface RealProject {
  id: string
  title: string
  slug: string
  location: string | null
  client: string | null
  limasRole: string | null
  coverImage: string | null
  status: "DRAFT" | "ONGOING" | "COMPLETED" | string // Menerima semua tipe status dari DB
  categoryProjects: {
    select?: {
      catEntry: {
        select: {
          name: boolean
        }
      }
    }
    catEntry: {
      name: string
    }
  }[]
}

interface PortfolioCarouselProps {
  projects: RealProject[]
}

export default function PortfolioCarousel({ projects }: PortfolioCarouselProps) {
  if (projects.length === 0) return null

  // Fungsi helper untuk merender Badge Status secara dinamis dan akurat
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 bg-emerald-500/90 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-sm z-10">
            <MdOutlineVerified size={13} />
            <span>PROYEK SELESAI</span>
          </div>
        )
      case "ONGOING":
        return (
          <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 bg-E87722/95 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-sm z-10">
            <IoHammerOutline size={13} className="animate-spin [animation-duration:3s]" />
            <span>DALAM PROSES</span>
          </div>
        )
      default: // DRAFT atau status lainnya
        return (
          <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 bg-slate-600/90 text-white backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-sm z-10">
            <LuFileText size={13} />
            <span>DRAFT PLAN</span>
          </div>
        )
    }
  }

  return (
    <div className="w-full relative overflow-visible select-none">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        // Jika data cuma 1, jangan tampilkan slide mengintip. Kalau lebih dari 1, aktifkan slide samping.
        slidesPerView={projects.length === 1 ? 1 : 1.2} 
        centeredSlides={true}
        // CRITICAL FIX: Loop HANYA aktif jika jumlah data proyek lebih dari 3!
        loop={projects.length > 3} 
        pagination={{
          el: ".custom-swiper-pagination",
          clickable: true,
        }}
        navigation={{
          nextEl: ".custom-swiper-next",
          prevEl: ".custom-swiper-prev",
        }}
        breakpoints={{
          768: {
            slidesPerView: projects.length === 1 ? 1 : 1.5,
            spaceBetween: 30,
          },
          1200: {
            slidesPerView: projects.length >= 3 ? 1.8 : 1.2,
            spaceBetween: 40,
          },
        }}
        watchOverflow={true}
        className="portfolio-swiper !overflow-visible"
      >
        {projects.map((project) => {
          const categoryName = project.categoryProjects[0]?.catEntry?.name || "Konstruksi"
          
          return (
            <SwiperSlide 
              key={project.id} 
              className="transition-all duration-500 ease-out py-4 opacity-35 scale-[0.92] [&.swiper-slide-active]:opacity-100 [&.swiper-slide-active]:scale-100"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-100/80 transition-all duration-300 hover:shadow-xl">
                
                {/* Visual Area */}
                <div className="relative w-full aspect-[16/10] md:aspect-[21/7] lg:aspect-[21/6] bg-slate-100">
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      priority
                      className="object-cover object-center"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
                      Tidak Ada Gambar Cover
                    </div>
                  )}
                  
                  {/* Memanggil Badge Dinamis */}
                  {renderStatusBadge(project.status)}
                </div>

                {/* Konten Data */}
                <div className="p-5 md:p-8 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                        <IoLocationSharp className="text-[#E87722]" size={13} />
                        <span>{project.location || "Lokasi Belum Ditentukan"}</span>
                      </div>
                      <h3 className="text-lg md:text-2xl font-black text-[#0F2340] tracking-tight uppercase leading-tight">
                        {project.title}
                      </h3>
                    </div>
                    
                    <div className="bg-E87722/10 text-[#E87722] text-[11px] font-extrabold px-3.5 py-1.5 rounded-md tracking-wider uppercase h-fit self-start shrink-0">
                      {categoryName}
                    </div>
                  </div>

                  {/* Info Panel Spesifikasi */}
                  <div className="grid grid-cols-3 gap-4 border-t border-b border-slate-100 py-4 text-gray-600">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#0F2340] shrink-0">
                        <LuUser size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Klien</p>
                        <p className="text-xs font-bold text-[#0F2340] truncate">{project.client || "Internal"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#0F2340] shrink-0">
                        <LuLayers size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Peran</p>
                        <p className="text-xs font-bold text-[#0F2340] truncate">{project.limasRole || "Utama"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#0F2340] shrink-0">
                        <LuScaling size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Status</p>
                        <p className={`text-xs font-bold uppercase tracking-wider truncate ${project.status === "COMPLETED" ? "text-emerald-600" : project.status === "ONGOING" ? "text-[#E87722]" : "text-slate-500"}`}>
                          {project.status === "COMPLETED" ? "Selesai" : project.status === "ONGOING" ? "Berjalan" : project.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Navigasi Link */}
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[11px] text-gray-400 italic">Limas Kontraktor</span>
                    <Link
                      href={`/proyek/${project.slug}`}
                      className="inline-flex items-center justify-center bg-[#0F2340] text-white font-bold px-4 py-2.5 rounded-lg text-[11px] tracking-wider uppercase transition-colors duration-300 hover:bg-[#E87722]"
                    >
                      Lihat Proyek
                    </Link>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>

      {/* Navigasi Control */}
      <div className="w-full flex justify-center mt-12 relative z-20">
        <div className="flex items-center justify-between w-full max-w-[280px] px-3 py-2">
          
          {/* Tombol Kiri */}
          <button className="custom-swiper-prev w-10 h-10 rounded-full border border-slate-200/70 flex items-center justify-center text-[#0F2340] transition-all duration-300 hover:bg-[#0F2340] hover:text-white bg-white cursor-pointer shrink-0">
            <IoArrowBackSharp size={16} />
          </button>
          
          {/* Container Pagination Tengah — Dipaksa Flex Center dan Lebar Statis */}
          <div className="custom-swiper-pagination !relative !bottom-0 !left-0 !right-0 !w-auto flex items-center justify-center gap-1.5 min-w-[100px] h-4 mx-2
            [&_.swiper-pagination-bullet]:w-1.5 
            [&_.swiper-pagination-bullet]:h-1.5 
            [&_.swiper-pagination-bullet]:bg-slate-300 
            [&_.swiper-pagination-bullet]:opacity-100
            [&_.swiper-pagination-bullet]:transition-all
            [&_.swiper-pagination-bullet]:duration-300
            [&_.swiper-pagination-bullet-active]:!bg-[#E87722] 
            [&_.swiper-pagination-bullet-active]:!w-4 
            [&_.swiper-pagination-bullet-active]:!h-4 
            [&_.swiper-pagination-bullet-active]:rounded-full" 
          />

          {/* Tombol Kanan — Dikunci Ukurannya */}
          <button className="custom-swiper-next w-10 h-10 rounded-full border border-slate-200/70 flex items-center justify-center text-[#0F2340] transition-all duration-300 hover:bg-[#0F2340] hover:text-white bg-white cursor-pointer shrink-0">
            <IoArrowForwardSharp size={16} />
          </button>
          
        </div>
      </div>
    </div>
  )
}