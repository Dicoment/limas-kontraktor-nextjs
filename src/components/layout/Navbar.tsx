"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown, Phone } from "lucide-react"

const navLinks = [
  { label: "Beranda", href: "/" },
  {
    label: "Layanan",
    href: "/layanan",
    children: [
      { label: "Konstruksi Bangunan", href: "/layanan/konstruksi" },
      { label: "Renovasi", href: "/layanan/renovasi" },
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/">
          <Image
            src={scrolled ? "/logo-biru.png" : "/logo-putih.png"}
            alt="Limas Kontraktor"
            width={130}
            height={48}
            className="object-contain transition-all duration-300"
            priority
          />
        </Link>

        {/* Menu Desktop */}
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
                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                      scrolled
                        ? "text-slate-700 hover:text-[#1B3A6B]"
                        : "text-white/90 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <ChevronDown size={14} />
                  </button>

                  {openDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#1B3A6B] transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-slate-700 hover:text-[#1B3A6B]"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center">
          <a
            href="https://wa.me/628xxxxxxxxxx"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              scrolled
                ? "bg-[#E87722] text-white hover:bg-[#d06a1a]"
                : "bg-white text-[#1B3A6B] hover:bg-white/90"
            }`}
          >
            <Phone size={15} />
            Konsultasi
          </a>
        </div>

        {/* Hamburger Mobile */}
        <button
          className={`md:hidden ${scrolled ? "text-slate-700" : "text-white"}`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <div key={link.label}>
              <Link
                href={link.href}
                className="block py-2.5 text-sm font-medium text-slate-700 hover:text-[#1B3A6B]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
              {link.children && (
                <div className="pl-4 space-y-1">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block py-2 text-sm text-slate-500 hover:text-[#1B3A6B]"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a
            href="https://wa.me/628xxxxxxxxxx"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-3 px-5 py-2.5 bg-[#E87722] text-white text-sm font-semibold rounded-xl text-center"
          >
            Konsultasi
          </a>
        </div>
      )}
    </header>
  )
}