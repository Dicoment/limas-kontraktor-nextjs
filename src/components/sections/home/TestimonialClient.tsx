"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Play, Star, CheckCircle2, Building2, Clock3, ShieldCheck } from "lucide-react"

export interface TestimonialWithProject {
  id: string
  clientName: string
  content: string
  rating: number
  sourceUrl: string | null
  avatar: string | null
  projectTitle: string | null
}

interface TestimonialClientProps {
  testimonials: TestimonialWithProject[]
}

export default function TestimonialClient({ testimonials = [] }: TestimonialClientProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [playVideo, setPlayVideo] = useState(false)

  const active = testimonials[activeIndex] || testimonials[0]

  useEffect(() => {
    setPlayVideo(false)
  }, [activeIndex])

  if (!testimonials || testimonials.length === 0) return null

  return (
    <section className="bg-white text-slate-900 font-sans py-12 md:py-24 select-none border-t border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        
        {/* ── 1. HEADER SECTION ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end mb-10 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-3 md:space-y-4"
          >
            <p className="text-base md:text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Testimoni Klien
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-slate-800 leading-[1.25] tracking-tight">
              Kata Mereka Tentang <span className="font-extrabold text-slate-900">Limas Kontraktor</span>
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 lg:pl-6"
          >
            <p className="text-base md:text-xs lg:text-sm text-slate-500 leading-relaxed font-normal">
              Kepercayaan dibangun dari komitmen eksekusi yang konsisten. Lihat tanggapan langsung dari para pemilik hunian dan proyek yang telah kami selesaikan.
            </p>
          </motion.div>
        </div>

        {/* ── 2. MAIN LAYOUT GRID ── */}
        <div className="grid grid-cols-1 gap-8 lg:gap-10 lg:grid-cols-12 lg:h-[560px] items-stretch">
          
          {/* SISI KIRI: Video Player Showcase */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col h-full justify-between"
          >
            <div className="relative w-full h-full min-h-[320px] sm:min-h-[380px] overflow-hidden bg-slate-950 rounded-2xl border border-slate-200/80 shadow-2xl flex-1">
              
              <AnimatePresence mode="wait">
                {!playVideo ? (
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src="/thumbnail.png" 
                      alt={`Thumbnail Proyek ${active.projectTitle}`}
                      className="h-full w-full object-cover opacity-60 transition-scale duration-700 hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Tag Dokumentasi Minimalis */}
                    <div className="absolute left-5 top-5 sm:left-6 sm:top-6 z-10">
                      <span className="text-base md:text-[11px] font-mono tracking-widest uppercase bg-slate-900/80 backdrop-blur-md text-slate-200 border border-white/10 px-3.5 py-1.5 rounded-full">
                        DOKUMENTASI SERAH TERIMA
                      </span>
                    </div>

                    {/* Info Card Overlay Bottom */}
                    <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 z-10">
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="border border-white/10 bg-slate-900/80 p-5 sm:p-6 rounded-xl backdrop-blur-xl space-y-3"
                      >
                        <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                          {active.projectTitle}
                        </h3>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-base md:text-xs font-normal tracking-wide text-slate-300">
                          {[
                            { icon: Building2, text: "Design & Build" },
                            { icon: Clock3, text: "Tepat Waktu" },
                            { icon: ShieldCheck, text: "Garansi Struktur" },
                          ].map((item, j) => (
                            <div key={j} className="flex items-center gap-2">
                              <item.icon size={16} className="text-slate-400" />
                              <span>{item.text}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>

                    {/* Play Button Minimalis */}
                    <button
                      onClick={() => setPlayVideo(true)}
                      aria-label="Play video testimoni"
                      className="absolute left-1/2 top-1/2 flex h-16 w-16 sm:h-20 sm:w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-900 shadow-2xl hover:scale-110 transition-all duration-300 active:scale-95 cursor-pointer z-20 group"
                    >
                      <Play size={24} className="fill-slate-900 ml-1 transition-transform group-hover:scale-110" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    {active.sourceUrl && (
                      <iframe
                        src={`${active.sourceUrl}?autoplay=1`}
                        title={`Video Testimoni ${active.clientName}`}
                        className="h-full w-full border-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sub-Badges Bottom */}
            <div className="mt-4 sm:mt-5 flex flex-wrap gap-4 sm:gap-6 shrink-0">
  {["Garansi Resmi", "Hasil Realisasi", "Legalitas Jelas"].map((text, idx) => (
    <div key={idx} className="flex items-center gap-2 text-base md:text-xs font-normal text-slate-500">
      <CheckCircle2 size={16} className="text-slate-800" />
      <span>{text}</span>
    </div>
  ))}
</div>
          </motion.div>

          {/* SISI KANAN: Vertical Testimonial List */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col gap-3 h-full overflow-y-auto pr-1 scrollbar-none"
          >
            {testimonials.map((item, index) => {
              const isActive = index === activeIndex

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveIndex(index)}
                  className={`cursor-pointer rounded-2xl p-5 sm:p-6 border transition-all duration-300 flex flex-col justify-between shrink-0 ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white shadow-xl"
                      : "border-slate-200/80 bg-slate-50/60 text-slate-800 hover:bg-slate-100/80 hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 text-amber-400">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" className="stroke-none" />
                        ))}
                      </div>
                      <span className={`text-base md:text-[10px] font-mono tracking-widest uppercase ${isActive ? 'text-slate-400' : 'text-slate-400'}`}>
                        /{index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </span>
                    </div>

                    <p className={`text-base md:text-xs lg:text-sm leading-relaxed font-normal line-clamp-3 ${isActive ? "text-slate-300" : "text-slate-600"}`}>
                      "{item.content}"
                    </p>
                  </div>

                  {/* Client Info */}
                  <div className={`mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t flex items-center gap-3.5 ${isActive ? "border-white/10" : "border-slate-200/80"}`}>
                    <img
                      src={item.avatar || "/avatar-placeholder.png"}
                      alt={item.clientName}
                      className={`h-10 w-10 rounded-full object-cover border ${
                        isActive ? "border-white/20" : "border-slate-200"
                      }`}
                    />
                    <div className="min-w-0">
                      <h4 className={`font-bold text-base md:text-xs lg:text-sm tracking-tight truncate ${isActive ? "text-white" : "text-slate-900"}`}>
                        {item.clientName}
                      </h4>
                      <p className={`text-base md:text-xs truncate ${isActive ? "text-slate-400" : "text-slate-500"}`}>
                        {item.projectTitle}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </motion.div>

        </div>
      </div>
    </section>
  )
}