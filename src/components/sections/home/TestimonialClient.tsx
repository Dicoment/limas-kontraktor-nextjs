// src/components/sections/TestimonialClient.tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Star, CheckCircle2, ShieldCheck, Building2, Clock3, Quote } from "lucide-react";

// Definisikan ulang tipe di sini biar gak pusing impor dari file Server
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
    setPlayVideo(false); // Reset video player saat ganti card
  }, [activeIndex]);

  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 md:py-24 select-none border-t border-slate-100">
      
      {/* Glow Blur Background */}
      <div className="absolute left-0 top-0 h-[450px] w-[450px] rounded-full bg-orange-100/70 blur-[150px] opacity-60 pointer-events-none" />
      <div className="absolute right-0 bottom-0 h-[450px] w-[450px] rounded-full bg-blue-100/60 blur-[150px] opacity-50 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        
        {/* Header Section */}
        <div className="mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E87722]/20 bg-[#E87722]/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E87722]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#E87722]">
                Apa Kata Mereka?
            </span>
          </div>
          <h2 className="max-w-4xl text-3xl font-black uppercase tracking-tight text-[#0F2340] md:text-5xl leading-none">
            Bukti Nyata <span className="text-[#E87722]">Kepuasan Klien</span>
          </h2>
        </div>

        {/* LAYOUT GRID UTAMA */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:h-[580px] items-stretch">
          
          {/* SISI KIRI: Video Player Area */}
          <div className="lg:col-span-8 flex flex-col h-full justify-between">
            <div className="relative w-full h-full overflow-hidden rounded-2xl md:rounded-[32px] border border-white/40 bg-slate-950 shadow-2xl flex-1 relative border border-slate-100">
              
              <AnimatePresence mode="wait">
                {!playVideo ? (
                  // Cover preview: THUMBNAIL STATIS DARI FOLDER PUBLIC
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src="/thumbnail.png" // Mengambil file public/thumbnail.png
                      alt={`Thumbnail Proyek ${active.projectTitle}`}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/35" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />

                    {/* Info Card di Dalam Video */}
                    <div className="absolute bottom-6 left-6 right-6 z-10">
                      <div className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-md">
                        <h3 className="text-xl font-bold text-white tracking-tight">
                          {active.projectTitle}
                        </h3>
                        
                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-widest text-white/95">
                          {[
                            { icon: Building2, text: "Design & Build" },
                            { icon: Clock3, text: "Tepat Waktu" },
                            { icon: ShieldCheck, text: "Bergaransi" },
                          ].map((item, j) => (
                            <div key={j} className="flex items-center gap-2">
                              <item.icon size={13} className="text-[#E87722]" />
                              {item.text}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Tombol Play */}
                    <button
                      onClick={() => setPlayVideo(true)}
                      className="absolute left-1/2 top-1/2 flex h-20 w-20 md:h-24 md:w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#E87722] text-white shadow-xl hover:bg-orange-600 transition-all transform hover:scale-105 active:scale-95 cursor-pointer z-20"
                    >
                      <Play size={30} className="fill-current ml-1" />
                    </button>

                    {/* Dokumentasi Tag Atas */}
                    <div className="absolute left-6 top-6 z-10">
                      <div className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3.5 py-2 border border-white/10 backdrop-blur-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#E87722]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                          Dokumentasi Proyek
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  // Iframe YouTube Player
                  <motion.div
                    key="video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
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

            {/* Validasi Tag */}
            <div className="mt-4 flex flex-wrap gap-5 shrink-0">
              {["Klien Asli", "Dokumentasi Nyata", "Serah Terima Bangunan"].map((text, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <CheckCircle2 size={16} className="text-[#E87722]" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* SISI KANAN: Vertical Scroller cards */}
          <div className="lg:col-span-4 flex flex-col gap-5 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {testimonials.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveIndex(index)}
                  className={`cursor-pointer rounded-3xl border p-5 transition-all duration-300 flex flex-col justify-between shrink-0 ${
                    isActive
                      ? "border-[#0F2340] bg-[#0F2340] text-white shadow-xl -translate-y-0.5"
                      : "border-slate-200 bg-white hover:shadow-lg"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      {/* Bintang Rating Muncul Kalo Aktif */}
                      {isActive && (
                        <div className="flex gap-0.5 text-[#E87722] shrink-0">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} size={11} fill="currentColor" className="stroke-none" />
                          ))}
                        </div>
                      )}
                    </div>

                    <p className={`mt-3.5 text-[13px] md:text-sm leading-relaxed ${isActive ? "text-slate-100" : "text-slate-600"}`}>
                      "{item.content}"
                    </p>
                  </div>

                  <div className={`mt-5 flex items-center justify-between border-t pt-4 ${isActive ? "border-white/10" : "border-slate-100"}`}>
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={item.avatar || "/avatar-placeholder.png"}
                        alt={item.clientName}
                        className={`h-10 w-10 rounded-full object-cover border transition-colors ${
                          isActive ? "border-white/20" : "border-slate-200"
                        }`}
                      />
                      <div className="min-w-0">
                        <h4 className={`font-bold text-sm md:text-base truncate ${isActive ? "text-white" : "text-[#0F2340]"}`}>
                          {item.clientName}
                        </h4>
                        <p className={`text-[11px] truncate mt-0.5 ${isActive ? "text-slate-400" : "text-slate-400"}`}>
                          {item.projectTitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}