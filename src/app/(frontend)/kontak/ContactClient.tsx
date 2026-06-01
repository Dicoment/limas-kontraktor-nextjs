"use client";

import Button from "@/components/ui/Button";
import ConsultationForm from "@/components/ui/ConsultationForm";

const CONTACT_INFO = [
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
    label: "Kantor Kami",
    value: "Jl. Mawar IV No.70A, RT.001/RW.007\nKali Baru, Medan Satria\nKota Bekasi, Jawa Barat 17183",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
      </svg>
    ),
    label: "Telepon / WhatsApp",
    value: "0823-2072-1150\n0813-2396-2699",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
      </svg>
    ),
    label: "Email",
    value: "cvlistiyamandirijayasteel70a\n@gmail.com",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    label: "Jam Operasional",
    value: "Senin – Jumat: 08.00 – 17.00\nSabtu: 08.00 – 13.00",
  },
];

const SERVICES = [
  "Konstruksi Bangunan",
  "Renovasi",
  "Desain & RAB",
  "Konsultasi Gratis",
  "Mekanikal & Elektrikal",
  "Survey Lokasi",
];

const SOCIAL = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/limas.kontraktor",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/LimasKontraktor",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@limaskontraktor",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.79a4.85 4.85 0 01-1.02-.1z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@LimasKontraktor",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
      </svg>
    ),
  },
];

export default function ContactClient() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* ── HERO ── */}
      <section className="relative max-w-full bg-[#1B3D72] overflow-hidden py-20 pb-28">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#2E9AD0]/10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-50 [clip-path:ellipse(55%_100%_at_50%_100%)]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          {/* Breadcrumb – semantic nav for SEO */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-white/40">
              <li><a href="/" className="hover:text-white/70 transition-colors">Beranda</a></li>
              <li aria-hidden="true">/</li>
              <li className="text-white/70" aria-current="page">Kontak</li>
            </ol>
          </nav>

          <span className="inline-flex items-center gap-2 text-[#2E9AD0] text-xs font-semibold tracking-widest uppercase bg-[#2E9AD0]/10 border border-[#2E9AD0]/25 px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E9AD0]" aria-hidden="true" />
            Hubungi Kami
          </span>

          {/*
            Visible heading – keyword-rich tapi natural.
            sr-only H1 di page.tsx untuk crawler, H2 ini untuk visual.
          */}
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-4">
            Wujudkan Proyek Anda <br />
            Bersama <span className="text-[#2E9AD0]">Limas</span>
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-xl leading-relaxed">
            Jasa kontraktor terpercaya di <strong className="text-white/80 font-medium">Bekasi, Jakarta, dan Jabodetabek</strong>.
            Konsultasi awal gratis, tanpa komitmen.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">

        {/* ── INFO CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 -mt-12 relative z-10 mb-16">
          {CONTACT_INFO.map((item) => (
            <address
              key={item.label}
              className="not-italic bg-white border border-[#1B3D72]/10 rounded-2xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-[#2E9AD0]/10 text-[#2E9AD0] flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#2E9AD0] mb-2">
                {item.label}
              </p>
              <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">
                {item.value}
              </p>
            </address>
          ))}
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">

          {/* Left */}
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-[#2E9AD0] mb-3">
              Konsultasi &amp; Pertanyaan
            </p>
            {/* Keyword-rich subheading */}
            <h2 className="text-3xl font-black text-[#1B3D72] leading-snug tracking-tight mb-4">
              Kontraktor Profesional untuk Proyek Anda di Jabodetabek
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              <strong className="font-medium text-slate-600">CV Listiya Mandiri Jaya Steel</strong> melalui brand{" "}
              <strong className="font-medium text-slate-600">Limas Kontraktor</strong> hadir melayani jasa desain
              dan konstruksi bangunan di Bekasi, Jakarta, Tangerang, Depok, dan Bogor.
              Ceritakan kebutuhan Anda dan tim kami akan segera menindaklanjuti.
            </p>

            {/* WhatsApp CTA */}
            <div className="relative bg-[#1B3D72] rounded-2xl p-7 overflow-hidden mb-8">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#2E9AD0]/15 pointer-events-none" />
              <p className="text-white font-bold text-lg mb-2 relative">Butuh Respons Cepat?</p>
              <p className="text-white/60 text-sm leading-relaxed mb-5 relative">
                Hubungi langsung tim kontraktor kami via WhatsApp untuk konsultasi
                proyek di Bekasi dan sekitarnya.
              </p>
              <a
                href="https://wa.me/6208232072115?text=Halo%20Limas%20Kontraktor%2C%20saya%20ingin%20konsultasi%20proyek"
                target="_blank"
                rel="noreferrer"
                aria-label="Chat WhatsApp Limas Kontraktor"
                className="relative inline-flex items-center gap-2 bg-[#2E9AD0] hover:bg-[#2588ba] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat WhatsApp
              </a>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#1B3D72]/10 mb-8" />

            {/* Service Tags */}
            <p className="text-[11px] font-bold tracking-widest uppercase text-[#2E9AD0] mb-4">
              Layanan Kami
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {SERVICES.map((s) => (
                <span
                  key={s}
                  className="text-xs font-medium text-[#1B3D72] bg-[#1B3D72]/[0.07] border border-[#1B3D72]/[0.12] px-4 py-1.5 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Social Media */}
            <p className="text-[11px] font-bold tracking-widest uppercase text-[#2E9AD0] mb-4">
              Ikuti Kami
            </p>
            <div className="flex gap-3">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${s.label} Limas Kontraktor`}
                  className="w-10 h-10 rounded-xl bg-white border border-[#1B3D72]/10 text-[#1B3D72] flex items-center justify-center hover:bg-[#1B3D72] hover:text-white hover:border-[#1B3D72] transition-all duration-200 shadow-sm"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white border border-[#1B3D72]/10 rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-extrabold text-[#1B3D72] mb-1">Kirim Pesan</h3>
            <p className="text-sm text-slate-400 mb-7">
              Isi formulir di bawah dan kami akan membalas dalam 1×24 jam kerja.
            </p>
            <ConsultationForm />
          </div>
        </div>

        {/* ── MAP ── */}
        <section aria-label="Lokasi Kantor Limas Kontraktor" className="rounded-2xl overflow-hidden flex flex-col md:flex-row mb-20 shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3!2d106.9922!3d-6.1901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTEnMjQuNCJTIDEwNsKwNTknMzEuOSJF!5e0!3m2!1sen!2sid!4v1"
            className="flex-1 h-64 md:h-auto border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Kantor Limas Kontraktor – Jl. Mawar IV No.70A, Kota Bekasi"
          />
          <div className="bg-[#1B3D72] w-full md:w-72 flex-shrink-0 p-8 flex flex-col justify-center gap-5">
            <p className="text-white text-xl font-bold leading-snug">
              Kunjungi Kantor Kami
            </p>
            <address className="not-italic text-white/60 text-sm leading-relaxed">
              Jl. Mawar IV No.70A, RT.001/RW.007{"\n"}
              Kali Baru, Kecamatan Medan Satria{"\n"}
              Kota Bekasi, Jawa Barat 17183
            </address>
            <a
              href="https://maps.google.com/?q=Jl.+Mawar+IV+No.70A+Kali+Baru+Bekasi"
              target="_blank"
              rel="noreferrer"
              aria-label="Petunjuk arah ke kantor Limas Kontraktor di Bekasi"
              className="inline-flex items-center gap-2 bg-[#2E9AD0]/15 hover:bg-[#2E9AD0]/25 text-[#2E9AD0] border border-[#2E9AD0]/30 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors duration-200 w-fit"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              Petunjuk Arah
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}