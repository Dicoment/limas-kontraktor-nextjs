"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqClientProps {
  faqs: FaqItem[];
}

export default function FaqClient({ faqs }: FaqClientProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default buka item pertama

  return (
    <section className="relative overflow-hidden bg-[#fafafa] py-16 md:py-24 select-none border-t border-slate-100">
      {/* Background Soft Glow Aksen */}
      <div className="absolute right-0 top-1/4 h-[350px] w-[350px] rounded-full bg-slate-100 blur-[120px] opacity-70 pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-4xl px-6">
        
        {/* Header Center */}
        <div className="mb-12 text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full  px-4 py-1.5">
            <span className="h-1.5 w-1.5 bg-[#E87722]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#E87722]">
              Pertanyaan Umum
            </span>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-[#0F2340] md:text-5xl leading-none">
            FAQ <span className="text-[#E87722]">Limas Kontraktor</span>
          </h2>
          <p className="mx-auto max-w-lg text-xs md:text-sm font-medium text-slate-500">
            Punya pertanyaan seputar bangun baru, renovasi, atau legalitas hukum proyek? Temukan jawabannya di bawah ini.
          </p>
        </div>

        {/* Accordion Wrapper */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.id}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-[#0F2340] bg-slate-50 shadow-md"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {/* Tombol Pertanyaan */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3.5">
                    <HelpCircle 
                      size={20} 
                      className={`mt-0.5 shrink-0 transition-colors ${isOpen ? "text-[#E87722]" : "text-slate-400"}`} 
                    />
                    <span className={`text-sm md:text-base font-bold tracking-tight ${isOpen ? "text-[#0F2340]" : "text-slate-700"}`}>
                      {faq.question}
                    </span>
                  </div>
                  
                  {/* Icon Panah dengan Rotasi */}
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all ${
                      isOpen 
                        ? "border-[#0F2340] bg-[#0F2340] text-white rotate-180" 
                        : "border-slate-200 text-slate-400"
                    }`}
                  >
                    <ChevronDown size={14} />
                  </div>
                </button>

                {/* Konten Jawaban dengan Smooth Animate Height */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      {/* FIX: faq.answer sekarang HTML dari Tiptap (list, link, bold),
                          bukan teks polos lagi. Render pakai dangerouslySetInnerHTML +
                          class `prose` biar list/link/bold-nya kebentuk stylingnya,
                          bukan HTML mentah keliatan. */}
                      <div
                        className="prose prose-sm md:prose-base max-w-none border-t border-slate-200/60 bg-white p-5 leading-relaxed font-medium text-slate-600 prose-a:text-[#E87722] prose-strong:text-slate-700"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}