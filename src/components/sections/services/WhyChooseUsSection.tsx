"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"

export interface AdvantageCard {
  id: string | number
  statNumber?: string
  title: string
  description: string
}

export interface WhyChooseUsProps {
  subtitle?: string
  title?: ReactNode
  description?: string
  cards?: AdvantageCard[]
}

const defaultCards: AdvantageCard[] = [
  {
    id: 1,
    statNumber: "12+",
    title: "Tim Profesional Dedicated",
    description: "Arsitek, insinyur sipil, dan pengawas proyek berpengalaman yang fokus menjaga presisi detail struktur bangunan Anda.",
  },
  {
    id: 2,
    statNumber: "100%",
    title: "Transparansi Anggaran (RAB)",
    description: "Perhitungan Rencana Anggaran Biaya yang adil dan terbuka. Bebas dari biaya tersembunyi selama proses konstruksi berjalan.",
  },
  {
    id: 3,
    statNumber: "ISO",
    title: "Standar Operasional Presisi",
    description: "Setiap tahap pengerjaan mengacu pada manajemen mutu teknis tinggi untuk memastikan bangunan kokoh dan aman jangka panjang.",
  },
  {
    id: 4,
    statNumber: "Garansi",
    title: "Jaminan Pemeliharaan Paska-Serah Terima",
    description: "Komitmen kenyamanan Anda tidak berhenti saat kunci diserahkan. Kami memberikan garansi pemeliharaan struktur secara berkala.",
  },
]

// Gradasi Glassmorphism (Terang -> Medium -> Dark -> Ultra Dark)
const glassStyles = [
  "bg-slate-100/90 text-slate-800 border-slate-300/80 backdrop-blur-md shadow-lg",
  "bg-[#1A3258]/85 text-white border-white/20 backdrop-blur-lg shadow-xl",
  "bg-[#0F2340]/90 text-white border-white/15 backdrop-blur-xl shadow-2xl",
  "bg-slate-950/95 text-white border-white/10 backdrop-blur-2xl shadow-2xl",
]

export default function WhyChooseUsSection({
  subtitle = "Keunggulan Utama",
  title = (
    <>
      Mengapa <span className="font-extrabold text-slate-900">Memilih</span> Limas Kontraktor
    </>
  ),
  description = "Bagi kami, membangun proyek bukan sekadar mengolah material—ini adalah proses menerjemahkan ide dan visi Anda menjadi struktur nyata yang fungsional, estetik, dan bernilai tinggi. Dengan pendekatan kolaboratif serta transparansi penuh, kami memastikan eksekusi yang disiplin dari perencanaan hingga serah terima.",
  cards = defaultCards,
}: WhyChooseUsProps) {
  return (
    // PENTING: Jangan gunakan overflow-hidden di section utama ini agar sticky tidak mati
    <section className="bg-white text-slate-900 font-sans py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* ── 1. LEFT COLUMN (STICKY CONTENT) ── */}
          <div className="lg:col-span-6 lg:sticky lg:top-28 space-y-6 pt-4">
            {subtitle && (
              <p className="text-xs md:text-sm font-normal text-slate-400 tracking-wider">
                {subtitle}
              </p>
            )}

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-800 leading-[1.25] tracking-tight">
              {title}
            </h2>

            <p className="text-sm md:text-base text-slate-500 leading-relaxed font-normal pt-2 max-w-xl">
              {description}
            </p>
          </div>

          {/* ── 2. RIGHT COLUMN (STACKING CARDS) ── */}
          {/* PENTING: 'space-y-12' atau 'pb-32' memberikan jarak & ruang bagi card untuk menumpuk saat di-scroll */}
          <div className="lg:col-span-6 space-y-12 relative pb-32">
            {cards.map((card, index) => {
              const glassClass = glassStyles[index % glassStyles.length]
              const isLight = index === 0

              // Offset bertingkat: Base top 112px (28 x 4) + 36px offset tiap card
              const topOffset = 112 + index * 36

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`sticky w-full p-8 md:p-12 rounded-3xl border transition-all duration-300 ${glassClass}`}
                  style={{
                    top: `${topOffset}px`,
                    zIndex: index + 1,
                  }}
                >
                  <div className="space-y-8 flex flex-col justify-between min-h-[250px]">
                    {card.statNumber && (
                      <span className={`text-5xl md:text-7xl font-extralight tracking-tight ${isLight ? 'text-slate-400' : 'text-slate-200/80'}`}>
                        {card.statNumber}
                      </span>
                    )}

                    <div className="space-y-3">
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                        {card.title}
                      </h3>
                      <p className={`text-xs md:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                        {card.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

        </div>

      </div>
    </section>
  )
}