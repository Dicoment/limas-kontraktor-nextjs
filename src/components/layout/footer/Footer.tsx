"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import CTAFooter from "@/components/layout/footer/CTAFooter"
import { FaPhone, FaEnvelope, FaInstagram, FaFacebookF, FaYoutube, FaTiktok, FaAsterisk } from "react-icons/fa6"

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

const footerLinks = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/tentang" },
  { label: "Layanan", href: "/layanan" },
  { label: "Proyek", href: "/proyek" },
  { label: "Kontak", href: "/kontak" },
]

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
    { type: "instagram", name: "Instagram", icon: <FaInstagram size={16} />, value: settings.social_instagram, href: `https://instagram.com/${settings.social_instagram?.replace("@", "")}` },
    { type: "facebook", name: "Facebook", icon: <FaFacebookF size={14} />, value: settings.social_facebook, href: `https://facebook.com/${settings.social_facebook}` },
    { type: "youtube", name: "YouTube", icon: <FaYoutube size={16} />, value: settings.social_youtube, href: `https://youtube.com/@${settings.social_youtube?.replace("@", "")}` },
    { type: "tiktok", name: "TikTok", icon: <FaTiktok size={14} />, value: settings.social_tiktok, href: `https://tiktok.com/@${settings.social_tiktok?.replace("@", "")}` },
  ]

  return (
    <>
      <CTAFooter />

      <footer className="bg-slate-900 text-white antialiased relative">
        
        {/* ── 1. TICKER TEXT BERJALAN (CSS KEYFRAMES INLINE - FULL FIXED INFINITE LOOP) ── */}
        <div className="w-full bg-[#E87722] py-8 overflow-hidden select-none flex relative z-10">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes footerMarquee {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
            .marquee-inner-container {
              display: flex;
              whitespace: nowrap;
              gap: 3rem;
              animation: footerMarquee 25s linear infinite;
              width: max-content;
            }
          `}} />
          
          <div className="marquee-inner-container">
            {/* Set 1 */}
            <span className="flex items-center gap-2 shrink-0"><FaAsterisk size={12} /> Jasa Konstruksi Bangunan</span>
            <span className="flex items-center gap-2 shrink-0"><FaAsterisk size={12} /> Kontraktor Bekasi & Jakarta</span>
            <span className="flex items-center gap-2 shrink-0"><FaAsterisk size={12} /> Renovasi Rumah & Ruko</span>
            <span className="flex items-center gap-2 shrink-0"><FaAsterisk size={12} /> Desain Arsitektur Premium</span>
            <span className="flex items-center gap-2 shrink-0"><FaAsterisk size={12} /> Perencanaan RAB Transparan</span>
            
            {/* Set 2 (Duplikasi presisi untuk loop infinity tanpa patah secara visual) */}
            <span className="flex items-center gap-2 shrink-0"><FaAsterisk size={12} /> Jasa Konstruksi Bangunan</span>
            <span className="flex items-center gap-2 shrink-0"><FaAsterisk size={12} /> Kontraktor Bekasi & Jakarta</span>
            <span className="flex items-center gap-2 shrink-0"><FaAsterisk size={12} /> Renovasi Rumah & Ruko</span>
            <span className="flex items-center gap-2 shrink-0"><FaAsterisk size={12} /> Desain Arsitektur Premium</span>
            <span className="flex items-center gap-2 shrink-0"><FaAsterisk size={12} /> Perencanaan RAB Transparan</span>
          </div>
        </div>

        {/* ── 2. FOOTER MAIN CONTENT AREA ── */}
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-20">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
            
            {/* [SISI KIRI]: LOGO & WORKING HOURS */}
            <div className="xl:col-span-4 space-y-6">
              <div className="footer-logo">
                <Image
                  src="/images/logo-putih.png"
                  alt={settings.company_name || "Limas Kontraktor"}
                  width={250}
                  height={48}
                  className="object-contain"
                />
              </div>
              
              <div className="footer-working-hours space-y-2 pt-4 border-t border-white/5 max-w-[280px]">
                <h3 className="text-lg font-bold tracking-wider capitalize text-white">Working Hours:</h3>
                <ul className="text-sm text-slate-200 space-y-1 font-medium">
                  <li>Senin - Sabtu: 09:00 WIB - 18:00 WIB</li>
                </ul>
              </div>
            </div>

            {/* [SISI KANAN]: DATA UTAMA BERJEJER */}
            <div className="xl:col-span-8 space-y-12">
              
              {/* Row Atas: Grid Informasi Alamat & Kontak */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="footer-links footer-location-info space-y-3">
                  <h3 className="text-lg font-bold capitalize tracking-widest text-white">Contact Information</h3>
                  <p className="text-md font-medium text-slate-200 leading-relaxed max-w-sm">
                    {settings.company_address || "123 Maplewood Drive, Pinehill, CA 90210"}
                  </p>
                </div>

                <div className="footer-links footer-contact-links space-y-3">
                  <h3 className="text-lg font-bold capitalize tracking-widest text-white">Get in Touch</h3>
                  <ul className="space-y-2 text-md font-medium text-slate-200">
                    {settings.contact_phone1 && (
                      <li className="flex items-center gap-2">
                        <FaPhone size={14} className="text-slate-300" />
                        <span>Phone: <a href={`tel:${settings.contact_phone1.replace(/[^0-9]/g, "")}`} className="text-white hover:text-[#E87722] transition-colors">{settings.contact_phone1}</a></span>
                      </li>
                    )}
                    {settings.contact_email && (
                      <li className="flex items-center gap-2">
                        <FaEnvelope size={14} className="text-slate-300" />
                        <span>Email: <a href={`mailto:${settings.contact_email}`} className="text-white hover:text-[#E87722] transition-colors break-all">{settings.contact_email}</a></span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Row Bawah: Kapsul Abu-Abu Sosmed */}
              <div className="footer-links footer-social-links space-y-4 pt-6 border-t border-white/5">
                <h3 className="text-lg font-bold capitalize tracking-widest text-white">Ikuti Kami di Media Sosial:</h3>
                <div className="flex flex-wrap gap-2.5">
                  {socials.filter(s => s.value).map((s) => (
                    <a
                      key={s.type}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] border border-white/5 rounded-lg text-sm font-bold text-slate-300 hover:text-white hover:bg-[#E87722] transition-all duration-200"
                    >
                      <span className="text-slate-200">{s.icon}</span>
                      <span>{s.name}</span>
                    </a>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ── 3. BOTTOM FOOTER COPYRIGHT BAR ── */}
        <div className="border-t border-white/5 bg-black/15">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="footer-menu">
              <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-bold capitalize tracking-wider">
                {footerLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-slate-200 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="footer-copyright-text flex flex-col items-center md:items-end text-center md:text-right gap-1 text-sm text-slate-500 font-medium">
              <p>Copyright © {new Date().getFullYear()} All Rights Reserved.</p>
              <p className="text-sm text-slate-400 font-light">
                Web Development by{" "}
                <a href="https://dicoment.com" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-white transition-colors font-medium underline">
                  Dicoment Agency
                </a>
              </p>
            </div>

          </div>
        </div>

      </footer>
    </>
  )
}