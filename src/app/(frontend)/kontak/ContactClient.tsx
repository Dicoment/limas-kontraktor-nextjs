"use client"

import { useEffect, useState } from "react"
import { MapPin, Phone, Mail } from "lucide-react"
import Image from "next/image"
import { FaWhatsapp } from "react-icons/fa"
import Button from "@/components/ui/Button"

interface Settings {
  company_name?: string
  company_address?: string
  contact_phone1?: string
  contact_phone2?: string
  contact_email?: string
  whatsapp?: string
  whatsapp_number?: string
}

export default function ContactClient() {
  const [settings, setSettings] = useState<Settings>({})

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings")
        if (res.ok) {
          const json = await res.json()
          const data = json?.data?.data
          if (data) setSettings(data)
        }
      } catch (e) {
        console.error("Gagal fetch settings:", e)
      }
    }
    fetchSettings()
  }, [])

  const rawWa = settings.whatsapp || settings.whatsapp_number || settings.contact_phone1 || ""
  const waNumber = rawWa.replace(/[^0-9]/g, "").replace(/^0/, "62")

  return (
    <main className="min-h-screen bg-white font-sans antialiased">

      {/* ── HERO ── */}
      <section
        className="relative min-h-[420px] flex flex-col items-center justify-center text-center px-6 py-36 overflow-hidden"
        style={{ backgroundImage: "url('/images/heroproyek.webp')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-[#0F2340]/85" />
        <div className="absolute top-8 left-16 w-32 h-32 rounded-full border border-white/10" />
        <div className="absolute top-14 left-24 w-16 h-16 rounded-full border border-white/10" />
        <div className="absolute bottom-8 right-16 w-40 h-40 rounded-full border border-white/10" />
        <div className="absolute bottom-14 right-28 w-20 h-20 rounded-full border border-white/10" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <p className="text-xs font-bold tracking-widest uppercase text-[#E87722]">Kontak</p>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">Hubungi Kami</h1>
          <p className="text-white/80 text-base md:text-lg leading-relaxed">
            Jasa kontraktor terpercaya di Bekasi, Jakarta, dan Jabodetabek.<br />
            Konsultasikan proyek konstruksi Anda dengan tim profesional kami sekarang juga.
          </p>
        </div>
      </section>

      {/* ── GET IN TOUCH ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest uppercase text-[#E87722] mb-2">Kontak</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Hubungi Kami Sekarang</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Tim teknik kami siap membantu mewujudkan proyek konstruksi Anda di seluruh wilayah Jabodetabek.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: <Phone size={28} />,
              label: "Telepon",
              value: settings.contact_phone1 ?? "—",
              sub: settings.contact_phone2 ?? "",
            },
            {
              icon: <Mail size={28} />,
              label: "Email",
              value: settings.contact_email ?? "—",
              sub: "",
            },
            {
              icon: <MapPin size={28} />,
              label: "Kantor Pusat",
              value: settings.company_address ?? "—",
              sub: "",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-[#0F2340] rounded-2xl p-10 flex flex-col items-center gap-4 hover:bg-[#1a3560] transition-colors duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-[#E87722]/20 flex items-center justify-center text-[#E87722]">
                {item.icon}
              </div>
              <p className="text-white font-bold text-lg">{item.label}</p>
              <div className="text-white/80 text-sm text-center leading-relaxed">
                <p>{item.value}</p>
                {item.sub && <p>{item.sub}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden shadow-lg h-96 w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3!2d106.9922!3d-6.1901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTEnMjQuNCJTIDEwNsKwNTknMzEuOSJF!5e0!3m2!1sen!2sid!4v1"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Kantor Limas Kontraktor"
          />
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="relative bg-[#0F2340] rounded-2xl px-10 py-16 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full border border-white/10 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full border border-white/10 translate-x-1/2 translate-y-1/2" />
          <p className="text-xs font-bold tracking-widest uppercase text-[#E87722] mb-3 relative">Mari Bicara</p>
          <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4 relative">
            Siap mewujudkan proyek konstruksi Anda?
          </h2>
          <p className="text-white/80 text-sm max-w-lg mx-auto mb-8 relative">
            Hubungi tim kami sekarang dan dapatkan konsultasi gratis untuk proyek bangunan di Bekasi dan sekitarnya.
          </p>
          
          <Button
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noreferrer"
            className="relative inline-flex items-center gap-2 bg-[#E87722] hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full text-sm transition-colors"
          >
            Mulai Konsultasi<FaWhatsapp size={18} />
          </Button>
        </div>
      </section>

    </main>
  )
}