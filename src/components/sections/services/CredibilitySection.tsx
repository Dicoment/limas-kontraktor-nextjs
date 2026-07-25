"use client"

import { ReactNode } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { IoArrowForwardSharp } from "react-icons/io5"
import Button from "@/components/ui/Button"

export interface CredibilitySectionProps {
  subtitle?: string
  title: ReactNode
  buttonText?: string
  buttonHref?: string
  imageSrc: string
  imageAlt?: string
}

export default function CredibilitySection({
  subtitle = "Tentang Kami",
  title,
  buttonText = "Pelajari Selengkapnya",
  buttonHref = "/tentang",
  imageSrc,
  imageAlt = "Architectural Project Limas Kontraktor",
}: CredibilitySectionProps) {
  return (
    <section className="bg-white text-slate-900 font-sans">
      
      {/* ── 1. CLEAN STATEMENT AREA ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-14 md:pt-20 pb-8 md:pb-12 text-center space-y-6 md:space-y-8">
        
        {/* Label Atas (Mobile: text-base | Desktop: text-sm) */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-base md:text-sm font-normal text-slate-400 tracking-wider"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Title Typography (Desktop persis awal: text-3xl lg:text-4xl) */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-light leading-[1.3] md:leading-[1.4] tracking-tight text-slate-800 max-w-5xl mx-auto"
        >
          {title}
        </motion.h2>

        {/* Button */}
        {buttonText && buttonHref && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-2 flex justify-center"
          >
            <Button
              href={buttonHref}
              variant="outline-dark"
              size="md"
              className="rounded-full gap-2.5 text-base md:text-sm normal-case font-normal hover:scale-105 active:scale-95 transition-transform"
            >
              <span>{buttonText}</span>
              <IoArrowForwardSharp className="text-base md:text-sm" />
            </Button>
          </motion.div>
        )}

      </div>

      {/* ── 2. FRAMED ARCHITECTURAL IMAGE ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 pb-14 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full h-[320px] sm:h-[420px] md:h-[600px] lg:h-[650px] overflow-hidden rounded-2xl md:rounded-3xl shadow-sm bg-slate-100"
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover object-center transition-transform duration-1000 ease-out hover:scale-105"
            priority
          />
        </motion.div>
      </div>

    </section>
  )
}