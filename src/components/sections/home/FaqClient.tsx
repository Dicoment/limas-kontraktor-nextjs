"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqClientProps {
  faqs: FaqItem[];
}

export default function FaqClient({ faqs }: FaqClientProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
    hidden: { opacity: 0, y: 12 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.35, ease: "easeOut" } 
    },
  };

  {/* Reusable CTA Block tanpa border divider */}
  const CtaBlock = () => (
    <div className="pt-2 space-y-3">
      <p className="text-base md:text-xs font-mono text-slate-400 uppercase tracking-wider">
        Punya pertanyaan spesifik?
      </p>
      <div>
        <a 
          href="https://api.whatsapp.com/send?phone=6282320721150" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-slate-900 hover:bg-[#E87722] text-white rounded-lg text-base md:text-xs font-mono uppercase tracking-widest font-semibold transition-all duration-300 group"
        >
          <HiOutlineChatBubbleLeftRight size={18} className="text-slate-300 group-hover:text-white transition-colors" />
          <span>Tanya Tim Teknis</span>
        </a>
      </div>
    </div>
  );

  return (
    <section className="bg-[#fcfcfc] text-slate-900 font-sans py-12 md:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        
        {/* LAYOUT 2 KOLOM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* KOLOM KIRI: Header & CTA Desktop */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 lg:sticky lg:top-28 space-y-6"
          >
            <div className="space-y-3">
              <p className="text-base md:text-xs font-mono font-semibold uppercase tracking-[0.2em] text-[#E87722]">
                FAQ & Informasi
              </p>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-slate-800 tracking-tight leading-[1.15]">
                Pertanyaan <br className="hidden sm:inline" />
                <strong className="font-extrabold text-slate-900">Sering Diajukan</strong>
              </h2>

              <p className="text-base md:text-sm lg:text-base text-slate-500 font-normal leading-relaxed pt-1 max-w-md">
                Transparansi adalah kunci kerja kami. Temukan jawaban komprehensif mengenai alur kerja, estimasi anggaran, garansi, hingga legalitas proyek Anda.
              </p>
            </div>

            {/* CTA Hanya Muncul di DESKTOP (lg:block) */}
            <div className="hidden lg:block pt-2">
              <CtaBlock />
            </div>
          </motion.div>

          {/* KOLOM KANAN: Accordion List & CTA Mobile */}
          <div className="lg:col-span-7 flex flex-col">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="border-t border-b border-slate-200 divide-y divide-slate-200"
            >
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                const numberString = String(index + 1).padStart(2, '0');

                return (
                  <motion.div
                    key={faq.id}
                    variants={itemVariants}
                    className="transition-colors duration-200"
                  >
                    {/* Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-start justify-between gap-4 sm:gap-6 py-5 sm:py-6 text-left cursor-pointer group focus:outline-none"
                    >
                      <div className="flex items-start gap-3.5 sm:gap-6">
                        <p className={`text-base md:text-xs lg:text-sm font-mono font-medium pt-0.5 transition-colors duration-200 shrink-0 ${
                          isOpen ? "text-[#E87722]" : "text-slate-400 group-hover:text-slate-600"
                        }`}>
                          {numberString}
                        </p>

                        <h3 className={`text-base sm:text-lg tracking-tight leading-snug transition-colors duration-200 ${
                          isOpen ? "text-slate-900 font-bold" : "text-slate-700 font-medium group-hover:text-slate-900"
                        }`}>
                          {faq.question}
                        </h3>
                      </div>

                      <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen 
                          ? "border-[#E87722] bg-[#E87722] text-white rotate-180" 
                          : "border-slate-200 bg-slate-50 text-slate-400 group-hover:border-slate-400 group-hover:text-slate-800"
                      }`}>
                        {isOpen ? <FiMinus size={14} /> : <FiPlus size={14} />}
                      </div>
                    </button>

                    {/* Body Jawaban */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pl-7 sm:pl-12 pr-4 sm:pr-6 pb-6">
                            <div
                              className="prose prose-base md:prose-sm lg:prose-base max-w-none text-slate-600 leading-relaxed font-normal prose-a:text-[#E87722] prose-strong:text-slate-900 prose-p:my-1.5"
                              dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CTA Hanya Muncul di MOBILE (lg:hidden) di Bawah FAQ */}
            <div className="block lg:hidden mt-8">
              <CtaBlock />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}