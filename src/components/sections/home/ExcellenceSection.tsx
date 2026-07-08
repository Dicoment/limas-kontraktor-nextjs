"use client"

import Image from "next/image"
import Button from "@/components/ui/Button"
import { FiCheckCircle } from "react-icons/fi"
import { HiOutlineBuildingOffice2 } from "react-icons/hi2"
import { MdOutlineVerified } from "react-icons/md"

const keunggulan = [
  {
    title: "Transparansi Anggaran (RAB)",
    desc: "Rencana Anggaran Biaya disusun detail sebelum proyek berjalan. Garansi jujur tanpa ada biaya siluman di tengah jalan.",
  },
  {
    title: "Material Konstruksi Standar SNI",
    desc: "Kami hanya menggunakan material bangunan berkualitas tinggi yang memenuhi standar nasional demi kekuatan struktur jangka panjang.",
  },
  {
    title: "Serah Terima Tepat Waktu",
    desc: "Manajemen waktu yang ketat dan terstruktur menjamin proyek bangunan Anda selesai tepat waktu sesuai kesepakatan tertulis.",
  },
]

export default function ExcellenceSection() {
  return (
    <section className="bg-white py-16 md:py-24 overflow-hidden relative border-t border-slate-50">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Grid Layout — Urutan ditata menggunakan `order-` agar rapi di HP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* SISI VISUAL (Foto): Di HP tampil duluan (order-1), di Laptop pindah ke kanan (order-2) */}
          <div className="grid-cols-1 lg:col-span-5 order-1 lg:order-2 relative w-full mb-6 lg:mb-0 lg:sticky lg:top-28">
            {/* aspect-[4/3] di mobile biar tidak terlalu tinggi, lg:aspect-[4/5] di desktop */}
            <div className="w-full rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[4/5] shadow-xl relative group">
              <Image
                src="/heroabout.webp"
                alt="Proyek Konstruksi dan Renovasi Bangunan oleh Tim Limas Kontraktor"
                fill
                priority
                className="object-cover object-center transition-transform duration-700 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2340]/20 via-transparent to-transparent pointer-events-none" />
            </div>
            
            {/* Floating Stats Card — Di HP posisinya disesuaikan agar tidak tabrakan */}
            <div className="absolute -bottom-4 right-4 lg:right-auto lg:-left-4 bg-[#E87722] text-white rounded-xl px-5 py-3.5 md:px-6 md:py-4 shadow-xl shadow-orange-950/20">
              <p className="text-3xl md:text-4xl font-black tracking-tight">150+</p>
              <p className="text-[9px] md:text-[10px] font-bold tracking-wider uppercase mt-0.5">Proyek Selesai</p>
              <p className="text-white/80 text-[9px] md:text-[10px] font-light">Area Jabodetabek</p>
            </div>
          </div>

          {/* SISI KONTEN: Di HP tampil setelah foto (order-2), di Laptop di kiri (order-1) */}
          <div className="grid-cols-1 lg:col-span-7 order-2 lg:order-1 space-y-8">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="w-1.5 h-1.5 bg-[#FFCC00]" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500">
              Kenapa Memilih Limas Kontraktor
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F2340] leading-[1.2] md:leading-[1.15] tracking-tight uppercase max-w-4xl mx-auto">
            Jasa Kontraktor Bangunan <span className="text-[#E87722]"><br></br>& Renovasi Profesional</span>
          </h2>
            {/* Teks Deskripsi */}
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-[#0F2340] leading-snug tracking-tight">
                Mitra Konstruksi Terpercaya untuk Semua Jenis Bangunan
              </h3>
              <p className="text-gray-700 font-light text-base leading-relaxed max-w-2xl">
                CV Listiya Mandiri Jaya Steel melalui brand <span className="font-semibold text-[#0F2340]">Limas Kontraktor</span> hadir melayani jasa konstruksi bangunan baru dan renovasi berkualitas komersial maupun residensial di Jabodetabek.
              </p>
            </div>

            {/* List Keunggulan */}
            <div className="space-y-5 pt-2">
              {keunggulan.map((k) => (
                <div key={k.title} className="flex gap-3 md:gap-4 items-start">
                  <FiCheckCircle size={18} className="text-[#E87722] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#0F2340] text-base mb-0.5 md:mb-1 tracking-tight">{k.title}</h4>
                    <p className="text-gray-700 text-sm md:text-sm leading-relaxed font-light max-w-2xl">{k.desc}</p>
                  </div>
                </div>
              ))}
            </div>
           {/* Action & Legalitas — Responsif dari Kolom ke Baris */}
<div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-6 border-t border-gray-200/60">
  <Button href="/tentang" variant="secondary" size="md" className="gap-2 shrink-0 w-full sm:w-auto justify-center bg-neutral-900 text-white hover:bg-neutral-800 border-none px-5 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors">
    <HiOutlineBuildingOffice2 size={16} />
    Tentang Kami
  </Button>

  <div className="w-[1px] h-8 bg-gray-200 hidden sm:block" />

  <div className="flex items-center gap-3">
    <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block w-full sm:w-auto">Legalitas Resmi:</span>
    <div className="flex items-center gap-3 text-[11px] font-bold text-neutral-700">
      {["SIUJK", "NIB", "OSS"].map((item, idx, arr) => (
        <span key={item} className="flex items-center gap-1.5">
          <MdOutlineVerified size={13} className="text-[#FFCC00]" />
          {item}
          {idx < arr.length - 1 && <span className="text-gray-300 ml-1.5">•</span>}
        </span>
      ))}
    </div>
  </div>
</div>
          </div>

        </div>
      </div>
    </section>
  )
}