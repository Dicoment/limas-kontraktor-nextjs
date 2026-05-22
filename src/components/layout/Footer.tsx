"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  Camera,
  Video,
  Share2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
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
  const [form, setForm] = useState({
    nama: "",
    telepon: "",
    layanan: "",
    pesan: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = `Halo Limas Kontraktor, saya ${form.nama} ingin konsultasi mengenai ${form.layanan}. ${form.pesan} (Telepon: ${form.telepon})`
    window.open(`https://wa.me/6282320721150?text=${encodeURIComponent(msg)}`, "_blank")
    setSubmitted(true)
  }

  return (
    <>
      {/* ===== CTA + FORM KONSULTASI ===== */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Kiri — Teks CTA */}
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest text-[#E87722] uppercase mb-4">
              Mulai Proyek Anda
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl text-[#1B3A6B] leading-tight mb-6">
              Wujudkan Bangunan <br />
              <span className="text-[#E87722]">Impian Anda</span> Bersama <br />
              Kami
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-md">
              Tim ahli kami siap membantu dari perencanaan hingga selesai
              pembangunan. Konsultasi pertama gratis, tanpa biaya, tanpa komitmen.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1B3A6B]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[#1B3A6B] text-xs font-bold">01</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Konsultasi & Survey Lokasi</p>
                  <p className="text-sm text-slate-400">Tim kami datang langsung ke lokasi Anda</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1B3A6B]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[#1B3A6B] text-xs font-bold">02</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Perencanaan & RAB</p>
                  <p className="text-sm text-slate-400">Desain dan anggaran biaya yang transparan</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1B3A6B]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[#1B3A6B] text-xs font-bold">03</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Pelaksanaan & Pengawasan</p>
                  <p className="text-sm text-slate-400">Dikerjakan oleh tim profesional berpengalaman</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kanan — Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <Send className="text-green-500" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Pesan Terkirim!</h3>
                <p className="text-slate-400 text-sm">Tim kami akan menghubungi Anda segera via WhatsApp.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-[#1B3A6B] mb-1">Form Konsultasi</h3>
                <p className="text-slate-400 text-sm mb-6">Isi form berikut, kami akan balas via WhatsApp</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        value={form.nama}
                        onChange={(e) => setForm({ ...form, nama: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/20 focus:border-[#1B3A6B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">No. Telepon</label>
                      <input
                        type="tel"
                        required
                        value={form.telepon}
                        onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                        placeholder="08xx-xxxx-xxxx"
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/20 focus:border-[#1B3A6B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Layanan yang Dibutuhkan</label>
                    <select
                      required
                      value={form.layanan}
                      onChange={(e) => setForm({ ...form, layanan: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/20 focus:border-[#1B3A6B] bg-white"
                    >
                      <option value="">Pilih layanan...</option>
                      <option value="Konstruksi Bangunan">Konstruksi Bangunan</option>
                      <option value="Renovasi">Renovasi</option>
                      <option value="Desain & RAB">Desain & RAB</option>
                      <option value="Konsultasi">Konsultasi Umum</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Ceritakan Kebutuhan Anda</label>
                    <textarea
                      rows={4}
                      value={form.pesan}
                      onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                      placeholder="Contoh: Saya ingin membangun rumah 2 lantai di Bekasi, lahan 150m²..."
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/20 focus:border-[#1B3A6B] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#E87722] text-white rounded-xl text-sm font-semibold hover:bg-[#d06a1a] transition-colors flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    Kirim via WhatsApp
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#0F2340] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Kolom 1 — Brand */}
          <div>
            <Image
              src="/logo-putih.png"
              alt="Limas Kontraktor"
              width={140}
              height={52}
              className="object-contain mb-5"
            />
            <p className="text-white/50 text-sm leading-relaxed mb-6">
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
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-colors"
                >
                  <s.icon size={16} />
                </a>
              ))}
              <a
                href="https://tiktok.com/@limaskontraktor"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Kolom 2 — Perusahaan */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">Perusahaan</h4>
            <ul className="space-y-3">
              {footerLinks.perusahaan.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3 — Layanan */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">Layanan Kami</h4>
            <ul className="space-y-3">
              {footerLinks.layanan.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4 — Kontak */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">Informasi Kontak</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#E87722] shrink-0 mt-0.5" />
                <span className="text-sm text-white/50 leading-relaxed">
                  Jl. Mawar IV No.70A, RT.001/RW.007, Kali Baru, Medan Satria, Kota Bekasi, Jawa Barat 17183
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#E87722] shrink-0" />
                <div className="text-sm text-white/50">
                  <a href="tel:+6282320721150" className="hover:text-white transition-colors block">0823-2072-1150</a>
                  <a href="tel:+6281323962699" className="hover:text-white transition-colors block">0813-2396-2699</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#E87722] shrink-0" />
                <a
                  href="mailto:cvlistiyamandirijayasteel70a@gmail.com"
                  className="text-sm text-white/50 hover:text-white transition-colors break-all"
                >
                  cvlistiyamandirijayasteel70a@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={16} className="text-[#E87722] shrink-0" />
                <span className="text-sm text-white/50">Senin – Sabtu, 08.00 – 17.00 WIB</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} Limas Kontraktor — CV Listiya Mandiri Jaya Steel. All rights reserved.
            </p>
            <p className="text-xs text-white/30">
              Jasa Konstruksi & Desain Bangunan Bekasi
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}