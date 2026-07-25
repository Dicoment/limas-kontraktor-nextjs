'use client';

import ConsultationForm from '@/components/ui/ConsultationForm'; 
import { motion, Variants } from 'framer-motion';

export default function CTAFooter({ waPhone }: { waPhone: string }) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section className="bg-white text-slate-900 font-sans border-t border-slate-200/80 py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* ── 1. HEADER SECTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 space-y-4 max-w-4xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            KONSULTASI PROYEK
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-800 leading-[1.25] tracking-tight">
            Wujudkan Visi Bangunan Anda Bersama <span className="font-extrabold text-slate-900">Limas Kontraktor</span>
          </h2>
        </motion.div>

        {/* ── 2. MAIN GRID LAYOUT ── */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
        >

          {/* ── LEFT COLUMN: Pure Typography Steps (Tanpa Ikon) ── */}
          <motion.div variants={itemVariants} className="lg:col-span-5 space-y-10">
            <p className="text-sm md:text-base text-slate-500 leading-relaxed font-normal max-w-md">
              Kami menerapkan standar teknis tinggi serta prinsip keberlanjutan dalam setiap proyek untuk melahirkan hunian dan bangunan komersial yang presisi, kokoh, dan bernilai investasi tinggi.
            </p>

            <div className="space-y-10 pt-4">
              {[
                { n: '01', title: 'Konsultasi & Survey Lokasi', desc: 'Tim teknis kami melakukan inspeksi fisik dan pemetaan tapak lokasi Anda secara akurat.' },
                { n: '02', title: 'Perencanaan & RAB Detail', desc: 'Penyusunan desain arsitektur dan Rencana Anggaran Biaya yang transparan tanpa biaya siluman.' },
                { n: '03', title: 'Pelaksanaan & Pengawasan', desc: 'Eksekusi konstruksi fisik oleh tukang terampil dengan pengawasan mandor teknis berkala.' },
              ].map(({ n, title, desc }) => (
                <div key={n} className="group flex items-start gap-6">
                  <span className="text-2xl font-mono font-light text-slate-300 group-hover:text-slate-900 transition-colors duration-300">
                    {n}
                  </span>

                  <div className="space-y-1.5 pt-0.5">
                    <h3 className="text-base md:text-lg font-bold text-slate-800 tracking-tight leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-normal">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN: Dark Canvas Form ── */}
          <motion.div variants={itemVariants} className="lg:col-span-7 w-full">
            
              <ConsultationForm waPhone={waPhone} />
         
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}