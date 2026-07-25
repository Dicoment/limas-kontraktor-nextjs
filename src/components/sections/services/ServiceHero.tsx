"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { FaWhatsapp } from "react-icons/fa6"
import { IoArrowForwardSharp } from "react-icons/io5"

export interface ServiceHeroProps {
  companyTag?: string
  categoryTags?: string[]
  titleLine1: string
  titleLine2?: string
  description: string
  bgImage?: string
  whatsappNumber?: string
  whatsappText?: string
  ctaPortfolioHref?: string
}

export default function ServiceHero({
  companyTag = "Limas Kontraktor Indonesia",
  categoryTags = ["CONTRACTOR & BUILDER", "ARCHITECT & DESIGN", "CIVIL ENGINEERING"],
  titleLine1,
  titleLine2,
  description,
  bgImage = "/images/heroabout.webp",
  whatsappNumber = "6282320721150",
  whatsappText = "Halo Limas Kontraktor, saya ingin konsultasi mengenai proyek bangunan.",
  ctaPortfolioHref = "/proyek",
}: ServiceHeroProps) {
  const [currentTagIndex, setCurrentTagIndex] = useState(0)

  // Logic berganti teks tiap 3 detik
  useEffect(() => {
    if (categoryTags.length <= 1) return

    const interval = setInterval(() => {
      setCurrentTagIndex((prevIndex) => (prevIndex + 1) % categoryTags.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [categoryTags])

  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`

  return (
    <section className="relative min-h-screen flex flex-col justify-between px-6 md:px-12 pt-32 pb-10 bg-[#0F2340] overflow-hidden text-white font-sans">
      
      {/* Background Image with Zoom-in Animation & Overlay */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto space-y-6">
        
        {/* Company Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-sm md:text-base font-light tracking-wide text-slate-200"
        >
          {companyTag}
        </motion.p>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1] max-w-4xl text-white"
        >
          {titleLine1} <br />
          {titleLine2 && (
            <span className="font-extrabold text-white">{titleLine2}</span>
          )}
        </motion.h1>

        {/* Category Label (DYNAMIC SLIDING ANIMATION) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-2"
        >
          <div className="w-8 h-[2px] bg-white/40 mb-3" />
          
          <div className="h-6 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentTagIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="inline-block text-xs md:text-sm font-bold tracking-[0.25em] text-slate-300 uppercase absolute left-0 top-0"
              >
                {categoryTags[currentTagIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

      </div>

      {/* Bottom Bar Area */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-end pt-8 border-t border-white/10"
      >
        <div className="md:col-span-5">
          <p className="text-base font-medium text-slate-200 leading-relaxed max-w-md">
            {description}
          </p>
        </div>

        <div className="md:col-span-4 flex items-center gap-3">
          <Link
            href={ctaPortfolioHref}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#0F2340] text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <span>Inquire Now</span>
            <IoArrowForwardSharp size={16} />
          </Link>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Konsultasi WhatsApp"
            className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-[#0F2340] hover:scale-105 active:scale-95 transition-all"
          >
            <FaWhatsapp size={20} />
          </a>
        </div>

        <div className="md:col-span-3 flex justify-start md:justify-end items-center gap-2 text-xl font-semibold tracking-widest text-slate-300">
          <span className="w-4 h-4 rounded-full bg-white animate-pulse" />
          <span>SCROLL</span>
        </div>
      </motion.div>

    </section>
  )
}