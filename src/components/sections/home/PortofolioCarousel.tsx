"use client"

import Image from "next/image"
import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import { FiArrowLeft, FiArrowRight, FiMapPin } from "react-icons/fi"

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
  status: "DRAFT" | "ONGOING" | "COMPLETED" | string
  categoryProjects: {
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

  // Status badge yang clean dan terstruktur
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="bg-slate-900/90 text-white backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-mono tracking-widest uppercase">
            Selesai
          </span>
        )
      case "ONGOING":
        return (
          <span className="bg-[#E87722] text-white backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-mono tracking-widest uppercase font-semibold">
            Dalam Proses
          </span>
        )
      default:
        return (
          <span className="bg-slate-200/90 text-slate-700 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-mono tracking-widest uppercase">
            Perencanaan
          </span>
        )
    }
  }

  return (
    <div className="w-full relative overflow-visible select-none">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1.15}
        centeredSlides={true}
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
            slidesPerView: 1.4,
            spaceBetween: 32,
          },
          1200: {
            slidesPerView: 1.7,
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
              className="transition-all duration-500 ease-out py-4 opacity-40 scale-[0.93] [&.swiper-slide-active]:opacity-100 [&.swiper-slide-active]:scale-100"
            >
              <div className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden transition-all duration-300 group hover:shadow-2xl hover:shadow-slate-200/60">
                
                {/* Visual Cover Image */}
                <div className="relative w-full aspect-[16/10] md:aspect-[21/9] bg-slate-200 overflow-hidden">
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      priority
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400 font-mono text-xs uppercase">
                      No Cover Image
                    </div>
                  )}
                  
                  {/* Badge Top Left */}
                  <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
                    {renderStatusBadge(project.status)}
                  </div>

                  {/* Category Top Right */}
                  <div className="absolute top-5 right-5 z-10">
                    <span className="bg-white/90 text-slate-800 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-mono tracking-wider uppercase font-medium border border-slate-200">
                      {categoryName}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 md:p-8 space-y-6 bg-white">
                  
                  {/* Title & Location */}
                  <div className="space-y-2">
                    {project.location && (
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                        <FiMapPin className="text-[#E87722]" size={13} />
                        <span>{project.location}</span>
                      </div>
                    )}
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight group-hover:text-[#E87722] transition-colors duration-300">
                      {project.title}
                    </h3>
                  </div>

                  {/* Clean Spec Grid */}
                  <div className="grid grid-cols-3 gap-4 border-t border-b border-slate-100 py-4 font-mono text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Klien</p>
                      <p className="font-semibold text-slate-800 truncate pt-0.5">{project.client || "Privat"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Peran</p>
                      <p className="font-semibold text-slate-800 truncate pt-0.5">{project.limasRole || "Utama"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Status</p>
                      <p className={`font-semibold uppercase truncate pt-0.5 ${
                        project.status === "COMPLETED" ? "text-slate-800" : "text-[#E87722]"
                      }`}>
                        {project.status === "COMPLETED" ? "Selesai" : project.status === "ONGOING" ? "Berjalan" : "Draft"}
                      </p>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs font-mono text-slate-400">Project By Limas Kontraktor</span>
                    <Link
                      href={`/proyek/${project.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-slate-900 hover:text-[#E87722] transition-colors group/link"
                    >
                      <span>Detail Proyek</span>
                      <FiArrowRight size={14} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  </div>

                </div>

              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>

      {/* Navigasi Control */}
      <div className="w-full flex justify-center mt-10 relative z-20">
        <div className="flex items-center justify-between w-full max-w-[260px] px-2">
          
          <button className="custom-swiper-prev w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 bg-white cursor-pointer shrink-0">
            <FiArrowLeft size={16} />
          </button>
          
          <div className="custom-swiper-pagination !relative !bottom-0 !left-0 !right-0 !w-auto flex items-center justify-center gap-2 h-4
  [&_.swiper-pagination-bullet]:!w-2 
  [&_.swiper-pagination-bullet]:!h-2 
  [&_.swiper-pagination-bullet]:!bg-slate-700 
  [&_.swiper-pagination-bullet]:!opacity-100
  [&_.swiper-pagination-bullet]:!rounded-full
  [&_.swiper-pagination-bullet]:transition-all
  [&_.swiper-pagination-bullet]:duration-300
  [&_.swiper-pagination-bullet-active]:!bg-[#E87722] 
  [&_.swiper-pagination-bullet-active]:!w-6 
  [&_.swiper-pagination-bullet-active]:!h-2
  [&_.swiper-pagination-bullet-active]:!rounded-full" 
/>

          <button className="custom-swiper-next w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 bg-white cursor-pointer shrink-0">
            <FiArrowRight size={16} />
          </button>
          
        </div>
      </div>
    </div>
  )
}