"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { FiPhone, FiMapPin, FiFileText, FiCheckSquare, FiTool } from "react-icons/fi";

export interface AlurStep {
  id: string;
  nomor: string;
  icon: ReactNode;
  title: string;
  description: string;
  detail: string;
}

const defaultAlur: AlurStep[] = [
  {
    id: "01",
    nomor: "01",
    icon: <FiPhone size={22} />,
    title: "Konsultasi Awal",
    description: "Hubungi tim spesialis kami via WhatsApp. Kita bedah visi proyek, kebutuhan ruang, estimasi budget, hingga timeline pengerjaan.",
    detail: "Respons Cepat & Solutif",
  },
  {
    id: "02",
    nomor: "02",
    icon: <FiMapPin size={22} />,
    title: "Survei Lapangan",
    description: "Tim teknik dan estimator kami terjun langsung ke lokasi untuk mengukur akurasi lahan dan memetakan kondisi struktur tanah.",
    detail: "Data Lapangan Presisi",
  },
  {
    id: "03",
    nomor: "03",
    icon: <FiFileText size={22} />,
    title: "Penyusunan RAB",
    description: "Kami menyusun Rencana Anggaran Biaya secara komprehensif dan jujur. Detail material tanpa biaya tersembunyi.",
    detail: "Akurat & Transparan",
  },
  {
    id: "04",
    nomor: "04",
    icon: <FiCheckSquare size={22} />,
    title: "Penandatanganan Kontrak",
    description: "Ikatan kerja sama diresmikan melalui kesepakatan tertulis yang menjamin perlindungan hak dan kewajiban kedua belah pihak.",
    detail: "Berkekuatan Hukum Tetap",
  },
  {
    id: "05",
    nomor: "05",
    icon: <FiTool size={22} />,
    title: "Eksekusi & Pengawasan",
    description: "Proyek dikawal ketat oleh pengawas lapangan profesional dengan laporan progres berkala hingga serah terima kunci.",
    detail: "Garansi Kualitas Struktur",
  },
];

// Gradasi Glassmorphism Presisi (Terang -> Low -> Mid -> Dark -> Ultra Dark)
const glassStyles = [
  "bg-slate-100/90 text-slate-900 border-slate-300/80 backdrop-blur-md shadow-lg",
  "bg-[#1A3258]/90 text-white border-white/20 backdrop-blur-lg shadow-xl",
  "bg-[#0F2340]/95 text-white border-white/15 backdrop-blur-xl shadow-2xl",
  "bg-slate-950/95 text-white border-white/10 backdrop-blur-2xl shadow-2xl",
  "bg-[#080E18]/98 text-white border-white/10 backdrop-blur-2xl shadow-2xl",
];

export default function AlurKerjaSection() {
  return (
    <section className="bg-white text-slate-900 font-sans py-24 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* ── 1. LEFT COLUMN (STICKY HEADER) ── */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6 pt-4">
            <p className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-[#E87722]">
              ALUR KERJA KAMI
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-800 leading-[1.15] tracking-tight">
              Proses Kerja <br />
              <strong className="font-extrabold text-slate-900">Sistematis & Presisi</strong>
            </h2>

            <p className="text-sm md:text-base text-slate-500 leading-relaxed font-normal pt-2 max-w-xl">
              Kami memutus birokrasi kontraktor konvensional melalui tahapan terukur demi efisiensi budget pengerjaan dan akurasi mutu bangunan Anda.
            </p>
          </div>

          {/* ── 2. RIGHT COLUMN (STACKING CARDS) ── */}
          <div className="lg:col-span-7 space-y-12 relative pb-32">
            {defaultAlur.map((step, index) => {
              const glassClass = glassStyles[index % glassStyles.length];
              const isLight = index === 0;

              // Offset bertingkat pas di-scroll
              const topOffset = 112 + index * 36;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className={`sticky w-full p-8 md:p-10 rounded-2xl border transition-all duration-300 ${glassClass}`}
                  style={{
                    top: `${topOffset}px`,
                    zIndex: index + 1,
                  }}
                >
                  <div className="space-y-6 flex flex-col justify-between min-h-[210px]">
                    
                    {/* Header Card: Icon & Nomor Monospace */}
                    <div className="flex items-start justify-between">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                        isLight 
                          ? "bg-white border-slate-300/80 text-[#E87722]" 
                          : "bg-white/10 border-white/15 text-[#E87722]"
                      }`}>
                        {step.icon}
                      </div>

                      <span className={`text-4xl md:text-5xl font-mono font-light tracking-tight ${
                        isLight ? 'text-slate-400' : 'text-slate-400/60'
                      }`}>
                        {step.nomor}
                      </span>
                    </div>

                    {/* Content: Title & Desc */}
                    <div className="space-y-3">
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                        {step.title}
                      </h3>
                      <p className={`text-xs md:text-sm leading-relaxed font-normal ${
                        isLight ? 'text-slate-600' : 'text-slate-300'
                      }`}>
                        {step.description}
                      </p>
                    </div>

                    {/* Footer Detail Label (Clean Tanpa Titik) */}
                    <div className={`pt-4 border-t ${
                      isLight ? 'border-slate-200' : 'border-white/10'
                    }`}>
                      <span className={`text-[11px] font-mono uppercase tracking-widest font-semibold ${
                        isLight ? 'text-[#E87722]' : 'text-[#E87722]'
                      }`}>
                        {step.detail}
                      </span>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}