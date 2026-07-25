"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"

export interface WorkStepItem {
  langkah: string
  nama: string
  deskripsi: string
}

export interface WorkProcessProps {
  subtitle?: string
  title?: ReactNode
  description?: string
  steps?: WorkStepItem[]
}

const defaultSteps: WorkStepItem[] = [
  {
    langkah: "01",
    nama: "Konsultasi & Survei Lapangan",
    deskripsi: "Tim teknis sipil kami melakukan peninjauan lokasi proyek untuk mengukur luasan tanah, analisis topografi, dan pemetaan struktur awal bangunan Anda.",
  },
  {
    langkah: "02",
    nama: "Penyusunan RAB Detail",
    deskripsi: "Kami menyusun Rencana Anggaran Biaya (RAB) rumah atau ruko secara transparan, merinci setiap item pekerjaan tanpa ada biaya siluman.",
  },
  {
    langkah: "03",
    nama: "Penandatanganan SPK Resmi",
    deskripsi: "Ikatan komitmen kerja sama legal melalui Surat Perjanjian Kerja (SPK) hitam di atas putih yang menjamin harga borongan mengikat dan tidak membengkak.",
  },
  {
    langkah: "04",
    nama: "Eksekusi & Konstruksi Fisik",
    deskripsi: "Proses pembangunan fisik dikerjakan oleh tukang terampil dengan pengawasan mandor teknis berkala demi menjaga presisi struktur sipil.",
  },
]

export default function WorkProcessSection({
  subtitle = "TAHAPAN EKSEKUSI PROYEK",
  title = (
    <>
      Alur Kerja <span className="font-extrabold text-slate-900">Terstruktur & Presisi</span>
    </>
  ),
  description = "Setiap proyek konstruksi kami jalankan dengan skema kerja yang sistematis demi menjamin kepastian waktu, transparansi anggaran, serta eksekusi mutu bangunan terbaik.",
  steps = defaultSteps,
}: WorkProcessProps) {
  return (
    <section className="bg-white text-slate-900 font-sans py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* ── 1. HEADER SECTION ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-4"
          >
            {subtitle && (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {subtitle}
              </p>
            )}

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-800 leading-[1.25] tracking-tight">
              {title}
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 lg:pl-6"
          >
            {description && (
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-normal">
                {description}
              </p>
            )}
          </motion.div>
        </div>

        {/* ── 2. ARCHITECTURAL PROCESS TIMELINE (NO CARDS) ── */}
        <div className="border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {steps.map((item, index) => (
              <motion.div
                key={item.langkah}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative pt-8 pb-10 md:py-10 md:px-8 first:pl-0 last:pr-0 flex flex-col justify-between transition-colors duration-500 hover:bg-slate-50/60"
              >
                <div className="space-y-8">
                  {/* Step Number Jumbo & Indicator Dot */}
                  <div className="flex items-center justify-between">
                    <span className="text-5xl md:text-6xl font-extralight tracking-tight font-mono text-slate-300 group-hover:text-slate-900 transition-colors duration-500">
                      {item.langkah}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-slate-900 transition-colors duration-500" />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-3">
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight leading-snug group-hover:text-slate-900 transition-colors">
                      {item.nama}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-normal">
                      {item.deskripsi}
                    </p>
                  </div>
                </div>

                {/* Bottom Active Line Accent */}
                <div className="mt-10 pt-4">
                  <div className="w-full h-[1px] bg-slate-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}