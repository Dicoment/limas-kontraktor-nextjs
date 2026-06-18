"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaBuilding, FaHelmetSafety, FaCompassDrafting } from "react-icons/fa6"
import { IoArrowForwardSharp, IoLogoWhatsapp } from "react-icons/io5"
import Link from "next/link"

const services = [
  {
    icon: FaBuilding, // Diganti ke ikon gedung komersial/umum agar lebih luas
    title: "Konstruksi & Bangun Baru",
    desc: "Layanan kontraktor menyeluruh untuk pembangunan dari nol mulai dari rumah tinggal, ruko komersial, kantor, hingga fasilitas umum dengan manajemen struktur beton dan baja yang presisi.",
    href: "/layanan/konstruksi",
  },
  {
    icon: FaHelmetSafety,
    title: "Renovasi Total & Parsial",
    desc: "Solusi peremajaan properti, penambahan lantai (tingkat), perbaikan kegagalan struktur dinding/atap, hingga rekonstruksi tata ruang bangunan agar kembali fungsional.",
    href: "/layanan/renovasi",
  },
  {
    icon: FaCompassDrafting,
    title: "Desain Arsitektur & RAB",
    desc: "Pembuatan konsep visual arsitektur 3D eksterior-interior terintegrasi dengan penyusunan Rencana Anggaran Biaya (RAB) yang jujur, transparan, dan berstandar nasional.",
    href: "/layanan/desain",
  },
]

export default function LayananSection() {
  const [whatsappNumber, setWhatsappNumber] = useState("6282320721150")

  useEffect(() => {
    const fetchNumber = async () => {
      try {
        const res = await fetch("/api/settings", { method: "GET" })
        if (res.ok) {
          const json = await res.json()
          if (json?.data?.contact_phone1) {
            const cleanNumber = json.data.contact_phone1.replace(/[^0-9]/g, "")
            setWhatsappNumber(cleanNumber.startsWith("0") ? `62${cleanNumber.substring(1)}` : cleanNumber)
          }
        }
      } catch (err) {
        console.error("Failed to fetch number for service CTA:", err)
      }
    }
    fetchNumber()
  }, [])

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Dekorasi Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f234005_1px,transparent_1px),linear-gradient(to_bottom,#0f234005_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-xl">
<div className="inline-flex items-center gap-2 bg-[#0F2340]/5 backdrop-blur-md border border-[#0F2340]/10 px-4 py-1.5 rounded-full w-fit">
      <span className="w-1.5 h-1.5 rounded-full bg-[#E87722] animate-pulse" />
      <p className="text-[#0F2340] text-xs font-semibold tracking-widest uppercase">Layanan Kami</p>
    </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F2340] tracking-tight uppercase leading-none">
    Jasa Konstruksi & <br />
    <span className="text-[#E87722]">Kontraktor Bangunan</span>
  </h2>
          </div>
          <p className="text-gray-700 font-normal max-w-md leading-relaxed md:pb-1 text-sm md:text-base">
            Dari perencanaan konsep arsitektur hingga eksekusi struktural akhir di lapangan, kami memastikan proyek pembangunan berjalan transparan, aman, dan bergaransi.
          </p>
        </div>

        {/* Grid Layout 2x2 Asimetris */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* 3 Kotak Layanan Utama */}
          {services.map((svc, index) => {
            const IconComponent = svc.icon
            return (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white border border-slate-100 rounded-2xl p-8 md:p-10 flex flex-col justify-between shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-[#0f234006] hover:-translate-y-1.5 hover:border-[#E87722]/30 relative"
              >
                <div>
                  <div className="w-14 h-14 rounded-xl bg-slate-50 text-[#0F2340] flex items-center justify-center mb-6 border border-slate-100 transition-colors duration-300 group-hover:bg-[#E87722] group-hover:text-white group-hover:border-transparent">
                    <IconComponent size={24} />
                  </div>

                  <h3 className="text-2xl font-bold text-[#0F2340] mb-4 tracking-tight group-hover:text-[#E87722] transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed font-light mb-8">
                    {svc.desc}
                  </p>
                </div>

                <Link 
                  href={svc.href}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0F2340] tracking-wider uppercase group-hover:text-[#E87722] transition-colors mt-auto w-fit"
                >
                  Selengkapnya 
                  <IoArrowForwardSharp size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            )
          })}

          {/* Slot Ke-4: Premium Visual CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative rounded-2xl overflow-hidden p-8 md:p-10 flex flex-col justify-between bg-[#0F2340] group min-h-[320px] md:min-h-auto shadow-md"
          >
            {/* Background Image Project Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('/heroproyek.webp')` }} // Gambar proyek lapangan
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F2340] via-[#0F2340]/80 to-transparent" />

            <div className="relative z-10 space-y-4">
              <span className="text-[#E87722] text-xs font-bold tracking-widest uppercase block">Konsultasi</span>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase leading-tight">
                Punya Rencana <br />Pembangunan Proyek?
              </h3>
              <p className="text-gray-300 font-light text-sm max-w-sm leading-relaxed">
                Diskusikan spesifikasi material, kebutuhan ruang, dan kalkulasi RAB transparan bersama tim teknis lapangan kami.
              </p>
            </div>

            <div className="relative z-10 pt-6 mt-auto">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#E87722] text-white font-bold px-6 py-3.5 rounded-xl text-xs tracking-wider uppercase transition-all duration-300 shadow-lg shadow-orange-950/40 hover:bg-orange-600 transform hover:-translate-y-0.5 w-full sm:w-auto"
              >
                <IoLogoWhatsapp size={16} />
                Hubungi WhatsApp
              </a>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}