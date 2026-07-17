"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
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

  // Varian animasi untuk list container agar muncul berurutan (Stagger) dengan tipe data Variants resmi
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, ease: "easeOut" } 
    },
  };

  return (
    <section className="relative overflow-hidden bg-[#fafafa] py-16 md:py-24 select-none border-t border-slate-100">
      {/* Background Soft Glow Aksen */}
      <div className="absolute right-0 top-1/4 h-[350px] w-[350px] rounded-full bg-slate-100 blur-[120px] opacity-70 pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-4xl px-6">
        
        {/* Header Center */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5">
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
        </motion.div>

        {/* Accordion Wrapper dengan Animasi Masuk Staggered */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.id}
                variants={itemVariants}
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
                  
                  {/* Icon Panah dengan Rotasi Mulus via Framer Motion */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isOpen 
                        ? "border-[#0F2340] bg-[#0F2340] text-white" 
                        : "border-slate-200 text-slate-400"
                    }`}
                  >
                    <ChevronDown size={14} />
                  </motion.div>
                </button>

                {/* Konten Jawaban dengan Smooth Animate Height & Fade */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      {/* Render HTML dari Tiptap dengan Rich Text Styling */}
                      <div
                        className="prose prose-sm md:prose-base max-w-none border-t border-slate-200/60 bg-white p-5 leading-relaxed font-medium text-slate-600 prose-a:text-[#E87722] prose-strong:text-slate-700"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}