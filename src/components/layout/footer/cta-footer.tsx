'use client';

import { MapPin, FileText, Hammer } from 'lucide-react';
import ConsultationForm from '../../ui/ConsultationForm'; 
import { motion, Variants } from 'framer-motion';

export default function CTAFooter() {
  // Varian animasi untuk efek masuk staggered yang clean dan profesional
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemLeftVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const itemRightVariants: Variants = {
    hidden: { opacity: 0, x: 30 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section className="relative bg-white overflow-hidden border-t border-slate-100">
      
      {/* Aksen Latar Belakang Geometris Premium */}
      <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-[#E87722]/5 blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-extrabold text-[#0F2340] leading-[1.15] max-w-6xl uppercase tracking-tight"
        >
          KONSULTASI DENGAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E87722] to-orange-500">LIMAS KONTRAKTOR.</span> KONTRAKTOR PROFESIONAL TERPERCAYA
        </motion.h2>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-6 pb-20 pt-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
      >

        {/* ── LEFT: CTA Copy dengan Animasi Masuk ── */}
        <motion.div variants={itemLeftVariants} className="space-y-10">
          <p className="text-slate-600 text-base md:text-lg leading-relaxed lg:max-w-md font-light">
            Kami berkomitmen menerapkan prinsip ramah lingkungan dalam setiap proyek
            untuk menciptakan hasil bangunan yang berkualitas dan berkelanjutan.
            Konsultasikan secara gratis bersama tim kontraktor kami.
          </p>

          <div className="space-y-6">
            {[
              { icon: MapPin, n: '01', title: 'Konsultasi & Survey Lokasi', desc: 'Tim kami datang langsung ke lokasi Anda' },
              { icon: FileText, n: '02', title: 'Perencanaan & RAB', desc: 'Desain dan anggaran biaya yang transparan' },
              { icon: Hammer, n: '03', title: 'Pelaksanaan & Pengawasan', desc: 'Dikerjakan oleh tim profesional berpengalaman' },
            ].map(({ icon: Icon, n, title, desc }) => (
              <div key={n} className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-[#0F2340] text-white flex items-center justify-center shrink-0 text-md font-black tracking-wide transition-colors duration-300 group-hover:bg-[#E87722]">
                  {n}
                </div>
                <div className="pt-0.5 flex items-start gap-3">
                  <Icon size={18} className="text-[#E87722] mt-1 shrink-0" />
                  <div>
                    <p className="text-base md:text-lg font-bold text-[#0F2340] tracking-tight">{title}</p>
                    <p className="text-sm text-slate-500 mt-0.5 font-light leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT: Form Langsung Manggil Komponen dengan Animasi Masuk ── */}
        <motion.div variants={itemRightVariants} className="w-full">
          <ConsultationForm />
        </motion.div>

      </motion.div>
    </section>
  );
}