"use client"

import Image from "next/image"
import Link from "next/link"
import CTAFooter from "@/components/layout/footer/cta-footer"
import {
  Camera,
  Video,
  Share2,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react"

const footerLinks = {
  perusahaan: [
    { label: "Tentang Kami", href: "/tentang" },
    { label: "Proyek Kami", href: "/proyek" },
    { label: "Blog & News", href: "/blog" },
    { label: "Kontak", href: "/kontak" },
  ],
  layanan: [
    { label: "Konstruksi Bangunan", href: "/layanan/konstruksi" },
    { label: "Renovasi", href: "/layanan/renovasi" },
    { label: "Desain & RAB", href: "/layanan/desain" },
    { label: "Konsultasi Gratis", href: "/kontak" },
  ],
}

const socialMedia = [
  {
    icon: Camera,
    href: "https://instagram.com/limas.kontraktor",
    label: "Instagram",
  },
  {
    icon: Share2,
    href: "https://facebook.com/Limas-Kontraktor",
    label: "Facebook",
  },
  {
    icon: Video,
    href: "https://youtube.com/@LimasKontraktor",
    label: "YouTube",
  },
]

export default function Footer() {
  return (
    <>
      {/* Bagian Form Konsultasi */}
      <CTAFooter />

      {/* Bagian Informasi Informasi Footer */}
      <footer className="bg-[#0F2340] text-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Kolom 1 — Brand */}
          <div>
            <Image
              src="/logo-putih.png"
              alt="Limas Kontraktor"
              width={200}
              height={52}
              className="object-contain mb-5"
            />
            <p className="text-gray-300 text-md leading-relaxed mb-6">
              Brand dari CV Listiya Mandiri Jaya Steel. Perusahaan jasa desain
              dan konstruksi pembangunan terpercaya di Bekasi.
            </p>
            <div className="flex items-center gap-3">
              {socialMedia.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-gray-300/60 hover:text-orange-300 hover:border-white/50 transition-colors"
                >
                  <s.icon size={16} />
                </a>
              ))}
              <a
                href="https://tiktok.com/@limaskontraktor"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-gray-300/60 hover:text-orange-300 hover:border-white/50 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Kolom 2 — Perusahaan */}
          <div>
            <h4 className="text-xl font-semibold text-gray-300 mb-5 tracking-wide">Perusahaan</h4>
            <ul className="space-y-3">
              {footerLinks.perusahaan.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-md text-gray-300 hover:text-orange-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3 — Layanan */}
          <div>
            <h4 className="text-xl font-semibold text-gray-300 mb-5 tracking-wide">Layanan Kami</h4>
            <ul className="space-y-3">
              {footerLinks.layanan.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-md text-gray-300 hover:text-orange-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4 — Kontak */}
          <div>
            <h4 className="text-xl font-semibold text-gray-300 mb-5 tracking-wide">Informasi Kontak</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#E87722] shrink-0 mt-0.5" />
                <span className="text-md text-gray-300 leading-relaxed">
                  Jl. Mawar IV No.70A, RT.001/RW.007, Kali Baru, Medan Satria, Kota Bekasi, Jawa Barat 17183
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-[#E87722] shrink-0 mt-0.5" />
                <div className="text-md text-gray-300">
                  <a href="tel:+6282320721150" className="hover:text-orange-300 transition-colors block">0823-2072-1150</a>
                  <a href="tel:+6281323962699" className="hover:text-orange-300 transition-colors block">0813-2396-2699</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#E87722] shrink-0" />
                <a
                  href="mailto:cvlistiyamandirijayasteel70a@gmail.com"
                  className="text-md text-gray-300 hover:text-orange-300 transition-colors break-all"
                >
                  cvlistiyamandirijayasteel70a@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={16} className="text-[#E87722] shrink-0" />
                <span className="text-md text-gray-300">Senin – Sabtu, 08.00 – 17.00 WIB</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-md text-gray-200 max-w-sm">
              © {new Date().getFullYear()} Limas Kontraktor | CV. Listiya Mandiri Jaya Steel. All rights reserved.
            </p>
            <p className="text-sm text-gray-300 hover:text-gray-400">
Web Development By <a href="https://dicoment.com">Dicoment Agency</a></p>
            <p className="text-md text-gray-200">
              Jasa Konstruksi & Desain Bangunan Bekasi
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}