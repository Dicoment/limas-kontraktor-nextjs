"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import CTAFooter from "@/components/layout/footer/cta-footer"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

const EMPTY_SETTINGS = {
  company_name: "",
  company_description: "",
  company_address: "",
  contact_phone1: "",
  contact_phone2: "",
  contact_email: "",
  social_instagram: "",
  social_facebook: "",
  social_tiktok: "",
  social_youtube: "",
}

const footerLinks = {
  perusahaan: [
    { label: "Tentang Kami", href: "/tentang" },
    { label: "Proyek Kami", href: "/proyek" },
    { label: "Blog & News", href: "/blog" },
    { label: "Kontak", href: "/kontak" },
  ],
layanan: [
  { label: "Jasa Konstruksi Bangunan", href: "/layanan/konstruksi" },
  { label: "Jasa Renovasi Bangunan", href: "/layanan/renovasi" },
  { label: "Jasa Desain Bangunan", href: "/layanan/desain" },
  { label: "Jasa Pembuatan RAB", href: "/layanan/rab" },
  { label: "Konsultasi Gratis", href: "/kontak" },
],
}

const SocialIcon = ({ type }: { type: string }) => {
  if (type === "instagram") return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
  if (type === "facebook") return (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  )
  if (type === "youtube") return (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  )
  if (type === "tiktok") return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.79a4.85 4.85 0 01-1.02-.1z" />
    </svg>
  )
  return null
}

export default function Footer() {
  const [settings, setSettings] = useState(EMPTY_SETTINGS)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings")
        if (res.ok) {
          const json = await res.json()
          const data = json?.data?.data
          if (data) setSettings(prev => ({ ...prev, ...data }))
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err)
      }
    }
    fetchSettings()
  }, [])

  const socials = [
    { type: "instagram", value: settings.social_instagram, href: `https://instagram.com/${settings.social_instagram?.replace("@", "")}` },
    { type: "facebook", value: settings.social_facebook, href: `https://facebook.com/${settings.social_facebook}` },
    { type: "youtube", value: settings.social_youtube, href: `https://youtube.com/@${settings.social_youtube?.replace("@", "")}` },
    { type: "tiktok", value: settings.social_tiktok, href: `https://tiktok.com/@${settings.social_tiktok?.replace("@", "")}` },
  ]

  return (
    <>
      <CTAFooter />

      <footer className="bg-[#0F2340] text-white">

        {/* Main Footer */}
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

            {/* Kolom 1 — Brand */}
            <div className="md:col-span-4 space-y-5">
              <Image
                src="/logo-putih.png"
                alt={settings.company_name || "Limas Kontraktor"}
                width={160}
                height={48}
                className="object-contain"
              />
              <p className="text-white/80 text-base leading-relaxed">
                {settings.company_description || "Jasa konstruksi dan desain semua jenis bangunan terpercaya di Bekasi dan Jabodetabek."}
              </p>
              <div className="flex items-center gap-2 pt-2">
                {socials.filter(s => s.value).map((s) => (
                  
                    <a key={s.type}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.type}
                    className="w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center text-white/60 hover:text-[#E87722] hover:border-[#E87722]/50 transition-all duration-200"
                  >
                    <SocialIcon type={s.type} />
                  </a>
                ))}
              </div>
            </div>

            {/* Kolom 2 — Perusahaan */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-sm font-bold tracking-widest uppercase text-[#E87722]">Perusahaan</h4>
              <ul className="space-y-3">
                {footerLinks.perusahaan.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-base text-white/80 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolom 3 — Layanan */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-sm font-bold tracking-widest uppercase text-[#E87722]">Layanan</h4>
              <ul className="space-y-3">
                {footerLinks.layanan.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-base text-white/80 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolom 4 — Kontak */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="text-sm font-bold tracking-widest uppercase text-[#E87722]">Kontak</h4>
              <ul className="space-y-4">
                {settings.company_address && (
                  <li className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#E87722] shrink-0 mt-0.5" />
                    <span className="text-base text-white/80 leading-relaxed">{settings.company_address}</span>
                  </li>
                )}
                {(settings.contact_phone1 || settings.contact_phone2) && (
                  <li className="flex items-start gap-3">
                    <Phone size={18} className="text-[#E87722] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      {settings.contact_phone1 && (
                        <a href={`tel:${settings.contact_phone1.replace(/[^0-9]/g, "")}`} className="text-base text-white/80 hover:text-white transition-colors block">
                          {settings.contact_phone1}
                        </a>
                      )}
                      {settings.contact_phone2 && (
                        <a href={`tel:${settings.contact_phone2.replace(/[^0-9]/g, "")}`} className="text-base text-white/80 hover:text-white transition-colors block">
                          {settings.contact_phone2}
                        </a>
                      )}
                    </div>
                  </li>
                )}
                {settings.contact_email && (
                  <li className="flex items-center gap-3">
                    <Mail size={18} className="text-[#E87722] shrink-0" />
                    <a href={`mailto:${settings.contact_email}`} className="text-base text-white/80 hover:text-white transition-colors break-all">
                      {settings.contact_email}
                    </a>
                  </li>
                )}
                <li className="flex items-center gap-3">
                  <Clock size={18} className="text-[#E87722] shrink-0" />
                  <span className="text-base text-white/80">Senin – Sabtu, 08.00 – 17.00 WIB</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-sm text-white/60">
              © {new Date().getFullYear()} {settings.company_name || "Limas Kontraktor"}. All rights reserved.
            </p>
            <p className="text-sm text-white/60">
              Jasa Konstruksi & Desain Semua Jenis Bangunan Bekasi
            </p>
            <p className="text-sm text-white/60">
              Web Development by{" "}
              <a href="https://dicoment.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Dicoment Agency
              </a>
            </p>
          </div>
        </div>

      </footer>
    </>
  )
}