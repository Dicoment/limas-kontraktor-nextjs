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

  useEffect(() => {
    if (categoryTags.length <= 1) return

    const interval = setInterval(() => {
      setCurrentTagIndex((prevIndex) => (prevIndex + 1) % categoryTags.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [categoryTags])

  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`

  return (
    <section className="relative min-h-[100dvh] md:min-h-screen flex flex-col justify-between px-5 sm:px-8 md:px-12 pt-28 sm:pt-32 pb-12 bg-[#0F2340] overflow-hidden text-white font-sans">
      
      {/* Background Image with Zoom-in Animation & Overlay */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto space-y-4 sm:space-y-6 pt-4">
        
        {/* Company Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base sm:text-lg font-light tracking-wide text-slate-200"
        >
          {companyTag}
        </motion.p>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.2] md:leading-[1.1] max-w-4xl text-white"
        >
          {titleLine1} <br />
          {titleLine2 && (
            <span className="font-extrabold text-white">{titleLine2}</span>
          )}
        </motion.h1>

        {/* Category Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-2"
        >
          <div className="h-7 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentTagIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="inline-block text-base md:text-lg font-bold tracking-[0.2em] text-slate-300 uppercase absolute left-0 top-0"
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
        className="relative z-10 max-w-7xl mx-auto w-full flex flex-col md:grid md:grid-cols-12 gap-6 items-start md:items-end pt-6 mt-6"
      >
        {/* Description */}
        <div className="w-full md:col-span-5">
          <p className="text-base sm:text-lg font-normal text-slate-200 leading-relaxed max-w-md">
            {description}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="w-full md:col-span-4 flex items-center gap-3">
          <Link
            href={ctaPortfolioHref}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#0F2340] text-base font-bold uppercase tracking-wider hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <span>Inquire Now</span>
            <IoArrowForwardSharp size={18} />
          </Link>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Konsultasi WhatsApp"
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-[#0F2340] hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            <FaWhatsapp size={22} />
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden md:flex md:col-span-3 justify-end items-center gap-2 text-base font-semibold tracking-widest text-slate-300">
          <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
          <span>SCROLL</span>
        </div>
      </motion.div>

    </section>
  )
}