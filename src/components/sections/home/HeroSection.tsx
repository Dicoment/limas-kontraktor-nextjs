"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Button from "@/components/ui/Button" 
import { FaWhatsapp } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";

interface HeroSectionProps {
  backgroundImage: string
}

const stats = [
  { angka: "150+", label: "Proyek Terselesaikan", sub: "Rumah, ruko, & renovasi komersial" },
  { angka: "98%", label: "Klien Puas", sub: "Rekomendasi & kemitraan sejak 2014" },
]

export default function HeroSection({ backgroundImage }: HeroSectionProps) {
  // State untuk menampung nomor WA dinamis dari database
  const [whatsappNumber, setWhatsappNumber] = useState("6282320721150") // Fallback awal

  useEffect(() => {
    const fetchHeroSettings = async () => {
      try {
        const res = await fetch("/api/settings", { method: "GET" })
        if (res.ok) {
          const json = await res.json()
          // Mengambil contact_phone1 dari database jika ada
          if (json && json.data && json.data.contact_phone1) {
            // Bersihkan karakter non-angka (spasi, strip, dll)
            const cleanNumber = json.data.contact_phone1.replace(/[^0-9]/g, "")
            
            // Jika nomor dimulai dengan '0', ubah ke format internasional '62'
            if (cleanNumber.startsWith("0")) {
              setWhatsappNumber(`62${cleanNumber.substring(1)}`)
            } else {
              setWhatsappNumber(cleanNumber)
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch settings for Hero Section:", err)
      }
    }

    fetchHeroSettings()
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0F2340]">

      {/* Background Image & Layer Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F2340]/90 via-[#0F2340]/70 to-transparent" />
      <div className="absolute inset-0 bg-[#0F2340]/40" />

      {/* Brand Text Raksasa */}
      <div className="absolute bottom-16 left-0 right-0 overflow-hidden pointer-events-none select-none">
        <p className="text-[15vw] font-black text-white/[0.03] tracking-widest uppercase whitespace-nowrap leading-none m-0">
          LIMAS KONTRAKTOR
        </p>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-32 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Sisi Kiri — Konten Utama */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 md:space-y-8">
          
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E87722] animate-pulse" />
            <p className="text-white text-xs font-semibold tracking-widest uppercase">LIMAS KONTRAKTOR</p>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight uppercase">
            Jasa Kontraktor<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E87722] to-orange-400">
              Terpercaya
            </span>
          </h1>

          <p className="text-gray-300 text-base md:text-lg max-w-xl leading-relaxed font-light">
            Jasa kontraktor profesional untuk bangun baru, desain arsitektur, dan renovasi bangunan. Kami pastikan struktur bangunan aman dengan perencanaan RAB transparan di Jabodetabek.
          </p>

<div className="flex flex-wrap items-center gap-4 pt-4">
  <Button
    variant="primary"
    size="lg"
    href={`https://wa.me/${whatsappNumber}`}
    target="_blank"
    rel="noreferrer"
    className="gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white"
  >
    <FaWhatsapp size={20} />
    Mulai Konsultasi
  </Button>

  <Button
    variant="outline"
    size="lg"
    href="/proyek"
    className="gap-2.5 group"
  >
    Lihat Proyek
    <HiArrowRight
      size={18}
      className="transition-transform duration-300 group-hover:translate-x-1"
    />
  </Button>
</div>

          <p className="text-white/80 text-xs max-w-xs leading-relaxed border-l border-white/10 pl-4 mt-8">
            Didukung tukang berpengalaman, pengawasan ketat di lapangan, dan komitmen serah terima kunci tepat waktu sesuai kesepakatan.
          </p>
        </div>

        {/* Sisi Kanan — Stats Cards */}
        <div className="hidden lg:flex lg:col-span-5 flex-col items-end gap-6">
          {stats.map((s, index) => (
            <div
              key={s.label}
              className={`bg-[#0F2340]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-72 text-left shadow-2xl transition-all duration-300 hover:border-[#E87722]/40 ${
                index === 1 ? "transform translate-x-8" : ""
              }`}
            >
              <p className="text-5xl font-black text-white tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {s.angka}
              </p>
              <p className="text-white font-semibold text-md mt-2 leading-tight">
                {s.label}
              </p>
              <p className="text-gray-400 text-xs mt-1 font-light">
                {s.sub}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* Premium Scroll Indicator Animation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none select-none">
        <span className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-medium">Scroll Down</span>
        <div className="w-[24px] h-[40px] rounded-full border-2 border-white/20 flex justify-center p-1.5">
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1.5 h-1.5 rounded-full bg-[#E87722]"
          />
        </div>
      </div>

      {/* Geometrical Decorative Elements */}
      <div className="absolute -top-12 -right-12 w-96 h-96 rounded-full bg-[#E87722]/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full border border-white/5 pointer-events-none" />

    </section>
  )
}