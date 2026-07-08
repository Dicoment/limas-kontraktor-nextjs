"use client";

import { motion } from "framer-motion";
import { FaBuilding, FaHelmetSafety, FaCompassDrafting, FaArrowRightLong } from "react-icons/fa6";
import { IconType } from "react-icons";
import Link from "next/link";
import { JSX } from "react";

interface ServiceItem {
  icon: IconType;
  title: string;
  desc: string;
  tag: string;
  href: string;
}

const services: ServiceItem[] = [
  {
    icon: FaBuilding,
    title: "Konstruksi & Bangun Baru",
    desc: "Eksekusi pembangunan infrastruktur dan gedung dari tahap awal landasan hingga serah terima kunci, dengan kendali manajemen struktur komprehensif, estimasi material presisi, serta kepatuhan penuh terhadap standar kelayakan sipil.",
    tag: "Layanan Utama",
    href: "/layanan/konstruksi",
  },
  {
    icon: FaHelmetSafety,
    title: "Renovasi Total & Parsial",
    desc: "Solusi peremajaan properti, penambahan lantai (tingkat), perbaikan kegagalan struktural dinding/atap, hingga rekonstruksi tata ruang komersial guna meningkatkan fungsionalitas dan nilai kapitalisasi aset Anda.",
    tag: "Restrukturisasi",
    href: "/layanan/renovasi",
  },
  {
    icon: FaCompassDrafting,
    title: "Desain Arsitektur & RAB",
    desc: "Pembuatan konsep visual arsitektur 3D eksterior-interior terintegrasi yang dipadukan dengan penyusunan Rencana Anggaran Biaya (RAB) transparan, akurat, jujur, serta berstandar nasional untuk efisiensi investasi proyek.",
    tag: "Perencanaan",
    href: "/layanan/desain",
  },
];

export default function LayananPage(): JSX.Element {
  return (
    <main className="bg-[#F8F9FA] min-h-screen antialiased text-[#1A2B49]">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[65vh] flex items-center justify-center overflow-hidden border-b-4 border-[#E87722]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url('/heroproyek.webp')" }} 
        />
        {/* Overlay korporat deep navy dengan gradasi */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F2340]/95 via-[#0F2340]/80 to-[#0F2340]/90 backdrop-blur-[1px]" />
        
        {/* Ornamen blueprint garis vertikal dekoratif */}
        <div className="absolute inset-y-0 left-1/4 w-px bg-white/5 pointer-events-none" />
        <div className="absolute inset-y-0 right-1/4 w-px bg-white/5 pointer-events-none" />

        <div className="relative z-10 text-center px-6 space-y-6 max-w-5xl">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-md border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#E87722] animate-pulse" />
            <span className="text-white text-[10px] font-extrabold uppercase tracking-[0.25em]">Portfolio &amp; Solusi Konstruksi</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase leading-[1.05]">
            KONTRAKTOR UTAMA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E87722] to-orange-400 font-serif normal-case italic font-medium">Infrastruktur &amp; Bangunan</span>
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Menghadirkan komitmen profesionalitas dalam mentransformasi cetak biru teknis menjadi struktur fisik yang kokoh, fungsional, dan bernilai investasi tinggi.
          </p>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section className="relative py-24 sm:py-32">
        {/* Latar belakang kotak-kotak blueprint tipis sesuai image_47b61a.png */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:3rem_3rem]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Section Header */}
          <div className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-10 border-b border-slate-200">
            <div className="space-y-3">
              <h3 className="text-[#E87722] font-black tracking-[0.25em] uppercase text-xs">Layanan Utama</h3>
              <h2 className="text-3xl sm:text-5xl font-black text-[#0F2340] tracking-tight uppercase leading-none">
                Kompetensi &amp; <br />
                Spesialisasi Kami
              </h2>
            </div>
            <p className="text-slate-500 max-w-md text-sm sm:text-base leading-relaxed">
              Dari perencanaan konsep arsitektur hingga eksekusi struktural akhir di lapangan, kami memastikan seluruh rangkaian manajemen proyek berjalan transparan, aman, dan bergaransi resmi.
            </p>
          </div>

          {/* Grid Konten Utama - Mengikuti arsitektur asimetris kartu di gambar rujukan */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* KIRI: Daftar Layanan Utama (2 Kolom / Mengambil 8 Span) */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.slice(0, 2).map((svc, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -6 }}
                  className="group bg-white rounded-2xl p-8 border border-slate-200/70 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between min-h-[340px]"
                >
                  <div>
                    <div className="mb-6 w-12 h-12 rounded-xl bg-slate-50 text-[#0F2340] flex items-center justify-center border border-slate-100 group-hover:bg-[#0F2340] group-hover:text-white transition-all duration-300">
                      <svc.icon size={22} />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E87722] bg-orange-50 px-2.5 py-1 rounded-md">{svc.tag}</span>
                    <h3 className="text-xl font-bold text-[#0F2340] mt-4 mb-3 tracking-tight group-hover:text-[#E87722] transition-colors">{svc.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-light">{svc.desc}</p>
                  </div>

                  <Link href={svc.href} className="mt-8 inline-flex items-center gap-2.5 text-[#0F2340] font-bold text-xs uppercase tracking-wider hover:text-[#E87722] transition-colors group/link">
                    Selengkapnya <FaArrowRightLong className="transform group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              ))}

              {/* Layanan Ke-3 Memanjang Penuh di bawahnya jika di mobile/tablet */}
              <div className="md:col-span-2">
                <motion.div
                  whileHover={{ y: -6 }}
                  className="group bg-white rounded-2xl p-8 border border-slate-200/70 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="max-w-2xl">
                    <div className="mb-6 w-12 h-12 rounded-xl bg-slate-50 text-[#0F2340] flex items-center justify-center border border-slate-100 group-hover:bg-[#0F2340] group-hover:text-white transition-all duration-300">
                      <FaCompassDrafting size={22} />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E87722] bg-orange-50 px-2.5 py-1 rounded-md">{services[2].tag}</span>
                    <h3 className="text-xl font-bold text-[#0F2340] mt-4 mb-3 tracking-tight group-hover:text-[#E87722] transition-colors">{services[2].title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-light">{services[2].desc}</p>
                  </div>

                  <Link href={services[2].href} className="inline-flex items-center gap-2.5 text-[#0F2340] font-bold text-xs uppercase tracking-wider hover:text-[#E87722] transition-colors group/link whitespace-nowrap self-end md:self-center">
                    Selengkapnya <FaArrowRightLong className="transform group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* KANAN: Blok Penekanan USP Korporat (Mengambil 4 Span) - Terinspirasi dari Sisi Kanan image_47b9fe.jpg */}
            <div className="lg:col-span-4 bg-[#0F2340] rounded-2xl p-8 text-white flex flex-col justify-between relative overflow-hidden border-b-4 border-[#E87722] shadow-md">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(232,119,34,0.15),transparent_60%)]" />
              
              <div className="relative z-10 space-y-6">
                <span className="text-xs font-bold tracking-[0.2em] text-[#E87722] uppercase block">Standar Komitmen</span>
                <h3 className="text-2xl font-black uppercase tracking-tight leading-snug">
                  Transparan, <br /> Akurat &amp; Aman.
                </h3>
                <div className="w-12 h-px bg-white/20" />
                <p className="text-slate-300 text-sm font-light leading-relaxed">
                  Setiap rincian pengerjaan struktur dilaporkan secara berkala melalui sistem manajemen mutu terpadu. Kami memastikan tidak ada biaya siluman (hidden cost) demi menjaga integritas kerja sama jangka panjang.
                </p>
              </div>

              <div className="relative z-10 pt-12">
                <div className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">Sistem Sertifikasi</div>
                <div className="text-xs text-white/90 font-medium mt-1">Sesuai Regulasi Teknis &amp; SNI Terkini</div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}