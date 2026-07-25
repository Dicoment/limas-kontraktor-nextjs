"use client"

import { ReactNode, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { IoArrowForwardSharp, IoArrowBackSharp } from "react-icons/io5"
import Button from "@/components/ui/Button"

export interface ProjectItem {
  id: string | number
  title: string
  slug: string
  coverImage?: string | null
  location?: string | null
  category?: string | null
}

export interface PortfolioSectionProps {
  subtitle?: string
  title?: ReactNode
  description?: string
  buttonText?: string
  buttonHref?: string
  projects?: ProjectItem[]
  onNext?: () => void
  onPrev?: () => void
}

export default function PortfolioSection({
  subtitle = "Telah Dipercaya oleh berbagai Client",
  title = (
    <>
      Jelajahi <span className="font-extrabold text-slate-900">Portofolio</span> Kami yang Beragam
    </>
  ),
  description = "Dengan track record berbagai proyek sukses, Limas Kontraktor telah membuktikan pengalaman dan kehandalannya di bidang konstruksi. Kami menawarkan keahlian konstruksi yang solid untuk mewujudkan bangunan impian Anda.",
  buttonText = "Lihat Semua Proyek",
  buttonHref = "/proyek",
  projects = [],
  onNext,
  onPrev,
}: PortfolioSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    if (onPrev) {
      onPrev();
    } else if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white text-slate-900 font-sans py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        
        {/* ── 1. HEADER SECTION ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end mb-8 md:mb-12">
          
          {/* Kolom Kiri */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-4 md:space-y-6"
          >
            {subtitle && (
              <p className="text-base md:text-xs font-normal text-slate-400 tracking-wider">
                {subtitle}
              </p>
            )}

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-slate-800 leading-[1.25] tracking-tight">
              {title}
            </h2>

            {/* Button Desktop Only */}
            {buttonText && buttonHref && (
              <div className="hidden md:block pt-2">
                <Button
                  href={buttonHref}
                  variant="outline-dark"
                  size="md"
                  className="rounded-full gap-3 uppercase text-xs font-medium tracking-wider px-7 hover:scale-105 active:scale-95 transition-transform"
                >
                  <span>{buttonText}</span>
                  <IoArrowForwardSharp className="text-sm" />
                </Button>
              </div>
            )}
          </motion.div>

          {/* Kolom Kanan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col justify-between space-y-6 md:space-y-8 lg:pl-6"
          >
            {description && (
              <p className="text-base md:text-xs lg:text-sm text-slate-500 leading-relaxed font-normal">
                {description}
              </p>
            )}

            {/* Slider Arrow Buttons */}
            <div className="flex items-center gap-3 justify-start lg:justify-end">
              <button
                onClick={handlePrev}
                type="button"
                aria-label="Previous slide"
                className="w-12 h-12 border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 active:scale-95"
              >
                <IoArrowBackSharp className="text-lg" />
              </button>
              <button
                onClick={handleNext}
                type="button"
                aria-label="Next slide"
                className="w-12 h-12 border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 active:scale-95"
              >
                <IoArrowForwardSharp className="text-lg" />
              </button>
            </div>
          </motion.div>

        </div>

        {/* ── 2. PORTFOLIO SLIDER ── */}
        {projects && projects.length > 0 ? (
          <>
            <div
              ref={scrollContainerRef}
              className="flex md:grid md:grid-cols-4 gap-5 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-none -mx-5 px-5 md:mx-0 md:px-0 pb-4 md:pb-0"
            >
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-[82vw] sm:w-[320px] md:w-auto flex-shrink-0 snap-start"
                >
                  <Link
                    href={`/proyek/${project.slug}`}
                    className="group relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100 block"
                  >
                    {project.coverImage ? (
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 85vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400 text-base md:text-xs font-mono">
                        NO IMAGE
                      </div>
                    )}

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                    {/* View Badge Center */}
                    <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white text-base md:text-xs font-medium flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                      Lihat
                    </div>

                    {/* Info Text Overlay Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1 text-white">
                      <h3 className="font-semibold text-base tracking-tight leading-snug line-clamp-1">
                        {project.title}
                      </h3>
                      {project.location && (
                        <p className="text-slate-300 text-base md:text-xs tracking-wide truncate">
                          {project.location}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Button Mobile Only (Di Bawah Cards) */}
            {buttonText && buttonHref && (
              <div className="block md:hidden pt-8 text-center">
                <Button
                  href={buttonHref}
                  variant="outline-dark"
                  size="md"
                  className="w-full rounded-full gap-3 uppercase text-base font-medium tracking-wider justify-center py-3.5 hover:scale-105 active:scale-95 transition-transform"
                >
                  <span>{buttonText}</span>
                  <IoArrowForwardSharp className="text-base" />
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full py-4 px-6 border border-blue-500/30 bg-blue-50/50 rounded-md text-blue-600 text-base md:text-xs lg:text-sm font-normal"
          >
            No items were found matching your selection.
          </motion.div>
        )}

      </div>
    </section>
  )
}