"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, Clock, HardHat, Send, Building2 } from "lucide-react"

interface ContactClientProps {
  settings: {
    company_name: string;
    company_description: string;
    company_address: string;
    contact_phone1: string;
    contact_phone2: string;
    contact_email: string;
    social_instagram: string;
    social_facebook: string;
    social_tiktok: string;
    social_youtube: string;
  }
}

export default function ContactClient({ settings }: ContactClientProps) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" })

  return (
    <div className="bg-slate-50 min-h-screen font-sans antialiased">
      
      {/* ======================================================= */}
      {/* HERO SECTION: Menggunakan Karakter & Warna Brand Kontraktor */}
      {/* ======================================================= */}
      <section className="relative bg-[#0F2340] text-white pt-36 pb-24 overflow-hidden">
        {/* Blueprint / Grid Pattern Background Effect untuk nuansa arsitektur */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        {/* Aksen Gradasi warna orange brand di pojok kanan untuk kedalaman visual */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#E87722]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Kontainer diselaraskan menggunakan max-w-7xl mx-auto px-6 agar simetris */}
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-4">
            {/* Badge Bertema Kontraktor */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#E87722]/10 text-[#E87722] border border-[#E87722]/20 text-xs font-bold uppercase tracking-wider">
              <HardHat size={14} />
              Hubungi Kami
            </div>
            
            {/* Judul Utama dengan Kombinasi Warna Brand Navy & Orange */}
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Wujudkan Proyek Bangunan Anda Bersama <span className="text-[#E87722]">{settings.company_name}</span>
            </h1>
            
            <p className="text-gray-300 text-base md:text-lg max-w-2xl leading-relaxed">
              Jasa kontraktor terpercaya spesialis desain dan konstruksi pembangunan di wilayah Bekasi, Jakarta, dan Jabodetabek. Konsultasikan rencana Anda gratis tanpa komitmen.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================= */}
      {/* GRID INFORMASI KARTU: Selaras Width dengan Hero & Konten Bawah */}
      {/* ======================================================= */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Alamat Kantor */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/60 flex flex-col justify-between group hover:shadow-md transition-all duration-300">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#0F2340]/5 flex items-center justify-center text-[#0F2340] group-hover:bg-[#0F2340] group-hover:text-white transition-all duration-300">
                <MapPin size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Kantor Kami</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{settings.company_address}</p>
              </div>
            </div>
          </div>

          {/* Card 2: Telepon */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/60 flex flex-col justify-between group hover:shadow-md transition-all duration-300">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#E87722]/5 flex items-center justify-center text-[#E87722] group-hover:bg-[#E87722] group-hover:text-white transition-all duration-300">
                <Phone size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Telepon / WhatsApp</h3>
                <div className="text-sm text-slate-600 space-y-1 font-medium">
                  <a href={`tel:${settings.contact_phone1}`} className="block hover:text-[#E87722] transition-colors">{settings.contact_phone1}</a>
                  {settings.contact_phone2 && (
                    <a href={`tel:${settings.contact_phone2}`} className="block hover:text-[#E87722] transition-colors">{settings.contact_phone2}</a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Email */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/60 flex flex-col justify-between group hover:shadow-md transition-all duration-300">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#0F2340]/5 flex items-center justify-center text-[#0F2340] group-hover:bg-[#0F2340] group-hover:text-white transition-all duration-300">
                <Mail size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Email Resmi</h3>
                <a href={`mailto:${settings.contact_email}`} className="text-sm text-slate-600 block break-all hover:text-[#E87722] transition-colors font-medium">
                  {settings.contact_email}
                </a>
              </div>
            </div>
          </div>

          {/* Card 4: Jam Operasional */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/60 flex flex-col justify-between group hover:shadow-md transition-all duration-300">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#E87722]/5 flex items-center justify-center text-[#E87722] group-hover:bg-[#E87722] group-hover:text-white transition-all duration-300">
                <Clock size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Jam Operasional</h3>
                <div className="text-sm text-slate-600 space-y-1 font-medium">
                  <p>Senin - Jumat: 08.00 - 17.00</p>
                  <p>Sabtu: 08.00 - 13.00</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================= */}
      {/* SEKSI BAWAH: Form Konsultasi & Deskripsi Teknis Perusahaan */}
      {/* ======================================================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sisi Kiri: Informasi Detil Kontraktor */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#E87722] uppercase tracking-widest block">Konsultasi & Pertanyaan</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Kontraktor Profesional Untuk Proyek Anda di Jabodetabek
              </h2>
            </div>
            <p className="text-base text-slate-600 leading-relaxed">
              CV Listiya Mandiri Jaya Steel melalui brand <strong>Limas Kontraktor</strong> hadir sebagai mitra konstruksi terpercaya. Kami menjamin transparansi rencana anggaran biaya (RAB), ketepatan waktu pengerjaan, serta kualitas material bangunan terbaik untuk menjamin kepuasan Anda.
            </p>
            <div className="p-5 bg-[#0F2340]/5 rounded-xl border border-[#0F2340]/10 flex items-start gap-4">
              <Building2 className="text-[#0F2340] shrink-0 mt-1" size={24} />
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                Siap melayani pembangunan rumah tinggal, renovasi parsial maupun menyeluruh, ruko, gedung kantor, hingga pengerjaan konstruksi baja structural.
              </p>
            </div>
          </div>

          {/* Sisi Kanan: Form Pesan / Konsultasi */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200/60 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900">Kirim Pesan Konsultasi</h3>
              <p className="text-sm text-slate-500">Isi formulir di bawah ini, tim teknik kami akan menghubungi Anda kembali dalam kurun waktu 1x24 jam.</p>
            </div>
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Nama Lengkap</label>
                  <input type="text" placeholder="Masukkan nama Anda" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#E87722] focus:ring-1 focus:ring-[#E87722]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Nomor WhatsApp</label>
                  <input type="text" placeholder="Contoh: 0812xxxxxxxx" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#E87722] focus:ring-1 focus:ring-[#E87722]" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Alamat Email</label>
                <input type="email" placeholder="nama@email.com" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#E87722] focus:ring-1 focus:ring-[#E87722]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Detail Rencana Proyek (Lokasi & Jenis Pekerjaan)</label>
                <textarea rows={4} placeholder="Ceritakan rencana renovasi atau pembangunan rumah Anda..." className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#E87722] focus:ring-1 focus:ring-[#E87722] resize-y" />
              </div>
              <button type="submit" className="w-full py-3 bg-[#E87722] hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-sm rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all">
                <Send size={16} />
                Kirim Pengajuan Konsultasi
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  )
}