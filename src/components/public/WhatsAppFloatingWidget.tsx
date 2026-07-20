"use client";

import { useState } from "react";
import { RiWhatsappLine, RiCloseLine } from "react-icons/ri";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface WaContact {
  id: string;
  name: string;
  position: string | null;
  phone: string;
}

interface WhatsAppFloatingWidgetProps {
  title: string;
  hours: string;
  tooltip: string;
  message: string;
  contacts: WaContact[];
}

// Konfigurasi variasi animasi dengan tipe data Variants agar aman dari error TS
const panelVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9, pointerEvents: "none" },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    pointerEvents: "auto",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      when: "beforeChildren",
      staggerChildren: 0.1,
    }
  },
  exit: { 
    opacity: 0, 
    y: 30, 
    scale: 0.95, 
    transition: { duration: 0.2 } 
  }
};

const contactItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const tooltipVariants: Variants = {
  hidden: { opacity: 0, x: 20, scale: 0.8 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1, 
    transition: { delay: 1, type: "spring", stiffness: 500, damping: 15 }
  },
};

export default function WhatsAppFloatingWidget({ title, hours, tooltip, message, contacts }: WhatsAppFloatingWidgetProps) {
  const [open, setOpen] = useState(false);

  if (contacts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-3 font-sans select-none">
      
      {/* PANEL CHAT BOX WA */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="w-[360px] max-w-[calc(100vw-2.5rem)] bg-[#f4f7f5] rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col origin-bottom-right"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelVariants}
          >
            {/* Header Premium Khas Ninja WA */}
            <div className="bg-[#075e54] p-4 relative overflow-hidden shrink-0">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="relative w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center border border-white/20 text-white shrink-0">
                  <RiWhatsappLine size={24} />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] border-2 border-[#075e54] rounded-full"></span>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm leading-tight">{title}</h4>
                  <p className="text-emerald-200 text-xs mt-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse"></span>
                    {hours}
                  </p>
                </div>
              </div>
            </div>

            {/* Area Pesan Pembuka (Mockup Chat Bubble) */}
            <div className="px-4 pt-4 pb-2 bg-[#e5ddd5] shrink-0 relative">
              <div className="absolute left-6 top-3 w-3 h-3 bg-white rotate-45 transform origin-top-left rounded-[2px]"></div>
              <div className="bg-white rounded-xl rounded-tl-none p-3 shadow-sm max-w-[90%] border border-slate-200/50">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Customer Support</p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Halo! Ada yang bisa kami bantu? Silakan pilih salah satu tim kami di bawah untuk mulai mengobrol.
                </p>
              </div>
            </div>

            {/* List Kontak CS dengan Animasi Stagger */}
            <div className="p-4 bg-[#e5ddd5] space-y-2.5 max-h-[280px] overflow-y-auto custom-scrollbar">
              {contacts.map((c) => {
                const cleanPhone = c.phone.replace(/\D/g, "");
                const waUrl = `https://wa.me/${cleanPhone}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
                const initials = c.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

                return (
                  <motion.a
                    key={c.id}
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={contactItemVariants}
                    whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-200/40 transition-colors duration-200 group block"
                  >
                    {/* Avatar Profil dengan Status Online */}
                    <div className="relative w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0 border border-slate-200 group-hover:border-emerald-200 transition-colors">
                      {initials}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25D366] border-2 border-white rounded-full"></span>
                    </div>

                    {/* Info CS */}
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-bold text-slate-800 truncate group-hover:text-emerald-600 transition-colors">
                        {c.name}
                      </h5>
                      {c.position && (
                        <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                          {c.position}
                        </p>
                      )}
                    </div>

                    {/* Tombol Hijau Kanan */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-[#25D366] group-hover:text-white transition-all duration-200 shrink-0">
                      <RiWhatsappLine size={18} />
                    </div>
                  </motion.a>
                );
              })}
            </div>
            
            {/* Footer Widget */}
            <div className="bg-white/80 py-1.5 px-4 text-center border-t border-slate-200/40 text-[10px] text-slate-400 shrink-0">
              Powered by WhatsApp
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BUTTON UTAMA & TOOLTIP */}
      <div className="flex items-center gap-3 relative">
        {/* Tooltip bergaya Speech Bubble */}
        <AnimatePresence>
          {!open && tooltip && (
            <motion.div
              className="absolute right-16 bg-white text-slate-800 shadow-xl px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border border-slate-100 hidden sm:block origin-right"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={tooltipVariants}
            >
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-r border-t border-slate-100"></div>
              {tooltip.split(" ").map((word, i) =>
                i === 0 ? <span key={i} className="text-[#25D366] font-bold">{word} </span> : word + " "
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tombol Utama Bulat */}
        <motion.button
          onClick={() => setOpen((v) => !v)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center relative ${
            open ? "bg-slate-800 text-white" : "bg-[#25D366] text-white"
          }`}
          aria-label="WhatsApp Contact Button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.15 }}
              >
                <RiCloseLine size={26} />
              </motion.div>
            ) : (
              <motion.div
                key="wa"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.15 }}
                className="relative"
              >
                <RiWhatsappLine size={30} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-white animate-bounce">
                  1
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}