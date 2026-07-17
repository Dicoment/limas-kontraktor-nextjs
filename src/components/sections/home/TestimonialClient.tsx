"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Star, CheckCircle2, ShieldCheck, Building2, Clock3 } from "lucide-react";

export interface TestimonialWithProject {
  id: string;
  clientName: string;
  content: string;
  rating: number;
  sourceUrl: string | null;
  avatar: string | null;
  projectTitle: string | null;
}

interface TestimonialClientProps {
  testimonials: TestimonialWithProject[];
}

export default function TestimonialClient({ testimonials }: TestimonialClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playVideo, setPlayVideo] = useState(false);

  const active = testimonials[activeIndex];

  useEffect(() => {
    setPlayVideo(false); 
  }, [activeIndex]);

  return (
    <section className="relative overflow-hidden bg-white py-24 select-none border-t border-slate-200">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        
        {/* Header Section (Industrial Typography Heavy) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16 space-y-3 text-left"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#E87722]" />
            <span className="text-sm font-medium uppercase tracking-[0.2em] capitalize text-gray-500">
              Testimonial Klien
            </span>
          </div>
          <h2 className="max-w-4xl text-3xl font-black tracking-tight text-[#0F2340] md:text-5xl leading-none">
            Bukti Nyata <span className="text-[#E87722]">Kepuasan Klien</span>
          </h2>
        </motion.div>

        {/* LAYOUT GRID UTAMA */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:h-[580px] items-stretch">
          
          {/* SISI KIRI: Video Player Area */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-8 flex flex-col h-full justify-between"
          >
            <div className="relative w-full h-full overflow-hidden bg-[#0F2340] shadow-md flex-1 border rounded-lg border-slate-200">
              
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
                      className="h-full w-full object-cover grayscale opacity-40"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                    {/* Info Card di Dalam Video (Premium Clean Box dengan Animasi Slide Up) */}
                    <div className="absolute bottom-6 left-6 right-6 z-10">
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="border border-white/10 bg-[#0F2340]/80 p-6 backdrop-blur-md"
                      >
                        <h3 className="text-xl font-bold text-white capitalize tracking-tight">
                          {active.projectTitle}
                        </h3>
                        
                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold capitalize tracking-widest text-slate-300">
                          {[
                            { icon: Building2, text: "Design & Build" },
                            { icon: Clock3, text: "Tepat Waktu" },
                            { icon: ShieldCheck, text: "Bergaransi" },
                          ].map((item, j) => (
                            <div key={j} className="flex items-center gap-2">
                              <item.icon size={14} className="text-[#E87722]" />
                              <span>{item.text}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>

                    {/* Tombol Play */}
                    <button
                      onClick={() => setPlayVideo(true)}
                      className="absolute left-1/2 top-1/2 flex h-20 w-20 md:h-24 md:w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#E87722] text-white shadow-lg hover:bg-orange-600 transition-all transform hover:scale-105 cursor-pointer z-20"
                    >
                      <Play size={28} className="fill-current ml-1" />
                    </button>

                    {/* Dokumentasi Tag Atas */}
                    <div className="absolute left-6 top-6 z-10">
                      <div className="inline-flex items-center gap-2 bg-black/60 px-4 py-2 border border-white/10 backdrop-blur-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#E87722]" />
                        <span className="text-sm font-bold capitalize tracking-widest text-white">
                          Dokumentasi Proyek
                        </span>
                      </div>
                    </div>
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

            {/* Validasi Tag Minimal */}
            <div className="mt-6 flex flex-wrap gap-6 shrink-0">
              {["Klien Asli", "Dokumentasi Nyata", "Serah Terima Bangunan"].map((text, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm font-bold capitalize tracking-wider text-slate-600">
                  <CheckCircle2 size={16} className="text-[#E87722]" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SISI KANAN: Vertical Scroller Cards (Clean Border Layout dengan Staggered Entry) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 flex flex-col gap-4 h-full overflow-y-auto pr-2 scrollbar-none"
          >
            {testimonials.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <motion.div
                  key={item.id}
                  onClick={() => setActiveIndex(index)}
                  whileHover={{ y: isActive ? 0 : -2 }}
                  transition={{ duration: 0.2 }}
                  className={`cursor-pointer border rounded-lg p-6 transition-all duration-300 flex flex-col justify-between shrink-0 ${
                    isActive
                      ? "border-[#0F2340] bg-[#0F2340] text-white shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-400"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      {isActive && (
                        <div className="flex gap-0.5 text-[#E87722] shrink-0">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" className="stroke-none" />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Animasi teks kutipan saat card aktif diklik */}
                    <div className="overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.p 
                          key={isActive ? `active-${item.id}` : `inactive-${item.id}`}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`mt-4 text-sm md:text-base leading-relaxed font-light ${isActive ? "text-slate-200" : "text-slate-600"}`}
                        >
                          "{item.content}"
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className={`mt-6 flex items-center justify-between border-t pt-4 ${isActive ? "border-white/10" : "border-slate-100"}`}>
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={item.avatar || "/avatar-placeholder.png"}
                        alt={item.clientName}
                        className={`h-11 w-11 rounded-full object-cover border transition-colors ${
                          isActive ? "border-white/20" : "border-slate-200"
                        }`}
                      />
                      <div className="min-w-0">
                        <h4 className={`font-black text-sm md:text-base capitalize tracking-tight truncate ${isActive ? "text-white" : "text-[#0F2340]"}`}>
                          {item.clientName}
                        </h4>
                        <p className="text-sm truncate mt-0.5 text-slate-400">
                          {item.projectTitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
}