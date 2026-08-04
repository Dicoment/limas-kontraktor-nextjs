"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown, Phone, ShieldCheck } from "lucide-react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import Button from "@/components/ui/Button"

const tigaLayanan = [
  { 
    label: "Konstruksi & Bangun Baru", 
    href: "/layanan/konstruksi", 
    desc: "Pembangunan dari nol untuk rumah tinggal, ruko komersial, kantor, hingga fasilitas umum dengan manajemen struktur presisi." 
  },
  { 
    label: "Renovasi Total & Parsial", 
    href: "/layanan/renovasi", 
    desc: "Solusi peremajaan properti, penambahan lantai, perbaikan struktur dinding/atap, hingga rekonstruksi tata ruang." 
  },
  { 
    label: "Desain Arsitektur & RAB", 
    href: "/layanan/desain", 
    desc: "Pembuatan konsep visual arsitektur 3D eksterior-interior terintegrasi dengan penyusunan RAB yang jujur dan transparan." 
  },
]

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Layanan", href: "/layanan", isMega: true },
  { label: "Proyek", href: "/proyek" },
  { label: "VR 360", href: "/vr-360" },
  { label: "Tentang", href: "/tentang" },
  { label: "Blog", href: "/blog" },
  { label: "Kontak", href: "/kontak" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null)
  const [whatsappNumber, setWhatsappNumber] = useState("6282320721150")

  useEffect(() => {
    async function fetchWhatsappSetting() {
      try {
        const res = await fetch("/api/settings")
        if (res.ok) {
          const json = await res.json()
          const settings = json?.data?.data
          if (settings) {
            const waNumber = settings.whatsapp || settings.whatsapp_number || settings.contact_phone1
            if (waNumber) {
              const cleanNumber = waNumber.replace(/[^0-9]/g, "")
              setWhatsappNumber(cleanNumber)
            }
          }
        }
      } catch (error) {
        console.error("Gagal memuat nomor WhatsApp dari dashboard:", error)
      }
    }
    fetchWhatsappSetting()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Lock scroll body saat menu mobile terbuka
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [mobileOpen])

  const menuVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "bg-slate-950 border-b border-white/10 py-4 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-50">
        
        {/* LOGO BRANDING */}
        <Link href="/" onClick={() => setMobileOpen(false)} className="relative block">
          <Image
            src="/images/logo-putih.png"
            alt="Limas Kontraktor"
            width={145}
            height={55}
            className="object-contain"
            priority
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            if (link.isMega) {
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <button className="flex items-center gap-1 text-sm font-semibold capitalize tracking-wider text-white hover:text-[#E87722] transition-colors py-2 cursor-pointer">
                    <span>{link.label}</span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${megaOpen ? "rotate-180 text-[#E87722]" : ""}`} />
                  </button>

                  {/* DESKTOP MEGA MENU */}
                  <AnimatePresence>
                    {megaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[720px] bg-slate-900 border border-white/15 p-6 rounded-2xl shadow-2xl z-50 grid grid-cols-12 gap-6"
                      >
                        {/* Kiri - 3 Layanan Utama */}
                        <div className="col-span-7 space-y-4">
                          <p className="text-xs font-black capitalize text-slate-400 tracking-widest border-b border-white/10 pb-2">Layanan Utama</p>
                          <div className="space-y-3">
                            {tigaLayanan.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="block p-3 rounded-xl hover:bg-white/[0.05] transition-all group"
                              >
                                <p className="text-base font-bold text-white group-hover:text-[#E87722] transition-colors">{item.label}</p>
                                <p className="text-sm text-slate-200 font-light mt-1.5 leading-relaxed">{item.desc}</p>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Kanan - Card Tambahan */}
                        <div className="col-span-5 bg-white/[0.03] border border-white/10 rounded-xl p-5 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="text-[#E87722]"><ShieldCheck size={26} /></div>
                            <p className="text-base font-bold text-white capitalize tracking-tight">Transparan & Aman</p>
                            <p className="text-sm text-slate-200 font-light leading-relaxed">
                              Dari perencanaan konsep hingga eksekusi struktural akhir, kami memastikan proyek Anda bergaransi resmi.
                            </p>
                          </div>
                          <Link href="/layanan" className="text-sm font-bold text-[#E87722] capitalize tracking-wider hover:underline block">Selengkapnya →</Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            }
            return (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-semibold capitalize tracking-wider text-white hover:text-[#E87722] transition-colors py-2"
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* DESKTOP CTA */}
        <div className="hidden md:flex items-center">
          <Button
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            className=""
          >
            <Phone size={13} className="mr-2 inline" />
            <span>Konsultasi Proyek</span>
          </Button>
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          className="md:hidden p-2 text-white hover:text-[#E87722] active:text-[#E87722] transition-colors cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE FULLSCREEN OVERLAY */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-slate-950 text-white z-40 px-6 pt-28 pb-10 flex flex-col justify-between md:hidden"
          >
            {/* Navigasi Utama Mobile */}
            <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 no-scrollbar flex-1 mt-4">
              {navLinks.map((link) => (
                <motion.div variants={itemVariants} key={link.label} className="border-b border-white/10 pb-1">
                  {link.isMega ? (
                    <>
                      <button
                        onClick={() => setMobileDropdownOpen(mobileDropdownOpen === link.label ? null : link.label)}
                        className="flex items-center justify-between w-full py-4 text-2xl font-black text-white capitalize tracking-wide text-left"
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          size={24}
                          className={`text-slate-400 transition-transform duration-300 ${mobileDropdownOpen === link.label ? "rotate-180 text-[#E87722]" : ""}`}
                        />
                      </button>
                      
                      {/* Sub-menu Dropdown Mobile */}
                      <AnimatePresence>
                        {mobileDropdownOpen === link.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden my-2"
                          >
                            <div className="py-2 px-1 space-y-1">
                              {tigaLayanan.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className="block py-4 px-4 text-lg font-bold text-slate-200 hover:text-[#E87722] border-b border-white/5 last:border-none"
                                  onClick={() => setMobileOpen(false)}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className="block py-4 text-2xl font-black text-white capitalize tracking-wide"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            {/* CTA FIXED BOTTOM DI MOBILE */}
            <motion.div variants={itemVariants} className="pt-6 mt-auto">
              <Button
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                fullWidth
                className="flex items-center justify-center gap-2.5"
                onClick={() => setMobileOpen(false)}
              >
                <Phone size={18} className="animate-pulse" />
                <span>Konsultasi Proyek Anda</span>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}