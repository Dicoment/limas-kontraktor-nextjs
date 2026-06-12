"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown, Phone } from "lucide-react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import Button from "@/components/ui/Button"

const navLinks = [
  { label: "Beranda", href: "/" },
  {
    label: "Layanan",
    href: "/layanan",
    children: [
      { label: "Jasa Bangun Rumah", href: "/layanan/bangun-rumah" },
      { label: "Jasa Bangun Interior", href: "/layanan/bangun-interior" },
      { label: "Jasa Bangun Lainnya", href: "/layanan/bangun-lainnya" },
      { label: "Jasa Renovasi Rumah", href: "/layanan/renovasi-rumah" },
      { label: "Jasa Desain Rumah", href: "/layanan/desain-rumah" },
      { label: "Jasa Desain Interior", href: "/layanan/desain-interior" },
      { label: "Jasa Desain Rumah + Interior", href: "/layanan/desain-all" },
      { label: "Jasa Desain Bangunan Lainnya", href: "/layanan/desain-lainnya" },
      { label: "Jasa Pembuatan RAB", href: "/layanan/rab" },
      { label: "Jasa Pembuatan IMB/PBG", href: "/layanan/imb-pbg" },
    ],
  },
  { label: "Proyek", href: "/proyek" },
  { label: "Tentang", href: "/tentang" },
  { label: "Blog", href: "/blog" },
  { label: "Kontak", href: "/kontak" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null)
  const [whatsappNumber, setWhatsappNumber] = useState("628123456789")

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
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [mobileOpen])

  const menuVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.25, ease: "easeInOut" } }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  }

  const dropdownVariants: Variants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: { opacity: 1, height: "auto", marginTop: 4, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, height: 0, marginTop: 0, transition: { duration: 0.2, ease: "easeInOut" } }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        <Link href="/" onClick={() => setMobileOpen(false)}>
          <Image
            src={scrolled || mobileOpen ? "/logo-biru.png" : "/logo-putih.png"}
            alt="Limas Kontraktor"
            width={120}
            height={48}
            className="object-contain transition-all duration-300"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            if (link.children) {
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 text-md font-medium transition-colors ${
                      scrolled ? "text-slate-700 hover:text-[#1B3A6B]" : "text-white/90 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform duration-300 ${openDropdown === link.label ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 max-h-[400px] overflow-y-auto"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#1B3A6B] transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
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
                className={`text-md font-medium transition-colors ${
                  scrolled ? "text-slate-700 hover:text-[#1B3A6B]" : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:flex items-center">
          <Button
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            variant={scrolled ? "primary" : "white"}
          >
            <Phone size={15} className="mr-1" />
            Konsultasi
          </Button>
        </div>

        <button
          className={`md:hidden p-1 z-50 relative transition-colors ${scrolled || mobileOpen ? "text-slate-700" : "text-white"}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-x-0 top-[57px] bottom-0 bg-white z-40 px-6 py-6 flex flex-col justify-between overflow-y-auto md:hidden shadow-inner border-t border-slate-50"
          >
            <div className="space-y-2">
              {navLinks.map((link) => (
                <motion.div variants={itemVariants} key={link.label} className="border-b border-slate-100/60 pb-1">
                  {link.children ? (
                    <>
                      <button
                        onClick={() => setMobileDropdownOpen(mobileDropdownOpen === link.label ? null : link.label)}
                        className="flex items-center justify-between w-full py-3 text-base font-semibold text-slate-800 hover:text-[#1B3A6B]"
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          size={18}
                          className={`text-slate-400 transition-transform duration-300 ${mobileDropdownOpen === link.label ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileDropdownOpen === link.label && (
                          <motion.div
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="pl-4 pr-2 bg-slate-50 rounded-xl overflow-hidden mb-2"
                          >
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block py-3 text-sm font-medium text-slate-600 hover:text-[#1B3A6B] border-b border-slate-200/40 last:border-0"
                                onClick={() => setMobileOpen(false)}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className="block py-3 text-base font-semibold text-slate-800 hover:text-[#1B3A6B]"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
            <motion.div variants={itemVariants} className="pt-6 mt-auto">
              <Button
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                fullWidth
              >
                <Phone size={16} className="mr-2" />
                Konsultasi Gratis
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}