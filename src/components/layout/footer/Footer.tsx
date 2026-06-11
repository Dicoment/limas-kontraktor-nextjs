"use client"

import { useState, useEffect } from "react"
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

// Nilai default jika API gagal dimuat atau data masih kosong
const DEFAULT_SETTINGS = {
  company_name: "LIMAS KONTRAKTOR",
  company_description: "LIMAS KONTRAKTOR merupakan bagian dari CV. Listiya Mandiri Jaya Steel, perusahaan yang bergerak di bidang jasa desain dan konstruksi pembangunan.",
  company_address: "Jl. Mawar IV No.70A, RT.001/RW.007, Kali Baru, Kecamatan Medan Satria, Kota Bekasi, Jawa Barat 17183.",
  contact_phone1: "0823-2072-1150",
  contact_phone2: "0812-8767-2654",
  contact_email: "cvlistiyamandirijayasteel70a@gmail.com",
  social_instagram: "limas.kontraktor",
  social_facebook: "Limas Kontraktor",
  social_tiktok: "LIMAS KONTRAKTOR",
  social_youtube: "Limas Kontraktor",
}

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

export default function Footer() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings")
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setSettings(prev => ({
              ...prev,
              ...json.data,
            }))
          }
        }
      } catch (err) {
        console.error("Failed to fetch settings in footer:", err)
      }
    }

    fetchSettings()
  }, [])

  // Fungsi helper untuk membersihkan karakter non-angka saat digunakan di href="tel:..."
  const formatPhoneForLink = (phone: string) => {
    return phone.replace(/[^0-9+]/g, "")
  }

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
              alt={settings.company_name}
              width={200}
              height={52}
              className="object-contain mb-5"
            />
            <p className="text-gray-300 text-md leading-relaxed mb-6">
              {settings.company_description}
            </p>
            
            {/* Social Media Links */}
            <div className="flex items-center gap-3">
              {/* Instagram */}
              {settings.social_instagram && (
                <a
                  href={`https://instagram.com/${settings.social_instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-gray-300/60 hover:text-orange-300 hover:border-white/50 transition-colors"
                >
                  <Camera size={16} />
                </a>
              )}

              {/* Facebook */}
              {settings.social_facebook && (
                <a
                  href={`https://facebook.com/${settings.social_facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-gray-300/60 hover:text-orange-300 hover:border-white/50 transition-colors"
                >
                  <Share2 size={16} />
                </a>
              )}

              {/* YouTube */}
              {settings.social_youtube && (
                <a
                  href={`https://youtube.com/${settings.social_youtube.startsWith("@") ? settings.social_youtube : `@${settings.social_youtube}`}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-gray-300/60 hover:text-orange-300 hover:border-white/50 transition-colors"
                >
                  <Video size={16} />
                </a>
              )}

              {/* TikTok */}
              {settings.social_tiktok && (
                <a
                  href={`https://tiktok.com/@${settings.social_tiktok.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-gray-300/60 hover:text-orange-300 hover:border-white/50 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
                  </svg>
                </a>
              )}
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
              {/* Alamat */}
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#E87722] shrink-0 mt-0.5" />
                <span className="text-md text-gray-300 leading-relaxed">
                  {settings.company_address}
                </span>
              </li>
              
              {/* Nomor Telepon */}
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-[#E87722] shrink-0 mt-0.5" />
                <div className="text-md text-gray-300">
                  {settings.contact_phone1 && (
                    <a href={`tel:+62${formatPhoneForLink(settings.contact_phone1).substring(1)}`} className="hover:text-orange-300 transition-colors block">
                      {settings.contact_phone1}
                    </a>
                  )}
                  {settings.contact_phone2 && (
                    <a href={`tel:+62${formatPhoneForLink(settings.contact_phone2).substring(1)}`} className="hover:text-orange-300 transition-colors block">
                      {settings.contact_phone2}
                    </a>
                  )}
                </div>
              </li>
              
              {/* Email */}
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#E87722] shrink-0" />
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="text-md text-gray-300 hover:text-orange-300 transition-colors break-all"
                >
                  {settings.contact_email}
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
              © {new Date().getFullYear()} {settings.company_name} | Jasa Konstruksi & Desain Bangunan. All rights reserved.
            </p>
            <p className="text-sm text-gray-300 hover:text-gray-400">
              Web Development By <a href="https://dicoment.com" target="_blank" rel="noopener noreferrer">Dicoment Agency</a>
            </p>
            <p className="text-md text-gray-200">
              Jasa Konstruksi & Desain Bangunan Bekasi
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}