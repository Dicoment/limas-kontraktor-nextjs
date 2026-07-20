"use client";

import { useState, useEffect, JSX } from "react";
import { motion } from "framer-motion";
import { IoArrowForwardSharp, IoLogoWhatsapp } from "react-icons/io5";
import Link from "next/link";
export const dynamic = "force-dynamic";
const services = [
  {
    no: "01.",
    title: "Konstruksi & Bangun Baru",
    desc: "Layanan kontraktor menyeluruh untuk pembangunan dari nol mulai dari rumah tinggal, ruko komersial, hingga fasilitas umum.",
    href: "/layanan/konstruksi",
    image: "/images/jasa-kontraktor.webp"
  },
  {
    no: "02.",
    title: "Renovasi Total & Parsial",
    desc: "Solusi peremajaan properti, penambahan lantai, perbaikan struktur dinding/atap, hingga rekonstruksi tata ruang.",
    href: "/layanan/renovasi",
    image: "/images/jasa-renovasi.webp"
  },
  {
    no: "03.",
    title: "Desain Arsitektur & RAB",
    desc: "Pembuatan konsep visual arsitektur 3D eksterior-interior terintegrasi dengan penyusunan RAB yang transparan.",
    href: "/layanan/desain",
    image: "/images/jasa-desain.webp"
  }
];

const benefits = ["RAB Transparan", "Bergaransi", "Tukang Berpengalaman", "Tepat Waktu"];

export default function LayananSection(): JSX.Element {
  const [whatsappNumber, setWhatsappNumber] = useState("6282320721150");

  useEffect(() => {
    const fetchNumber = async () => {
      try {
        const res = await fetch("/api/settings", { method: "GET" });
        if (res.ok) {
          const json = await res.json();
          if (json?.data?.contact_phone1) {
            const cleanNumber = json.data.contact_phone1.replace(/[^0-9]/g, "");
            setWhatsappNumber(cleanNumber.startsWith("0") ? `62${cleanNumber.substring(1)}` : cleanNumber);
          }
        }
      } catch (err) {
        console.error("Failed to fetch number for service CTA:", err);
      }
    };
    fetchNumber();
  }, []);

  return (
    <>
      {/* ================= HERO SECTION INTEGRATED ================= */}
      <section className="relative w-full bg-[#0F2340] pt-32 pb-20 px-6 overflow-hidden">
        {/* Soft Overlay Gelap */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F2340]/90 to-[#0F2340]" />

        {/* Animasi Masuk Hero Menggunakan Framer Motion */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-5xl mx-auto relative z-10 text-center space-y-4"
        >
          {/* Tag Kicker */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-[#FFCC00]" />
            <span className="text-white text-xs font-medium uppercase tracking-widest opacity-95">
              Solusi Terintegrasi
            </span>
          </div>
          
          {/* H1 Utama */}
          <h1 className="text-3xl sm:text-5xl md:text-5xl font-bold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Layanan Kontraktor &amp; Manajemen Konstruksi Profesional
          </h1>

          {/* Deskripsi P */}
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl mx-auto font-normal leading-relaxed opacity-90 pt-2">
            CV Listiya Mandiri Jaya Steel melalui <strong className="font-semibold text-white">Limas Kontraktor</strong> menghadirkan 
            ekosistem layanan pembangunan terpadu. Mulai dari perencanaan struktur, konstruksi skala besar, 
            hingga renovasi komersial dan residensial di wilayah Jabodetabek.
          </p>
        </motion.div>
      </section>

      {/* ================= GRID CONTENT LAYANAN ================= */}
      <section className="py-24 bg-[#F8F9FA] text-[#000000] relative overflow-hidden">
        {/* Background Blueprint Decorative */}
        <div className="absolute top-0 right-0 w-80 h-80 opacity-[0.03] pointer-events-none bg-[url('/images/blueprint-lines.svg')] bg-contain bg-no-repeat" />

        <div className="max-w-7xl mx-auto px-6 w-full">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 bg-[#FFCC00]" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500">
                Layanan Utama Kami
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-neutral-900 leading-[1.2]">
              Jasa Konstruksi &amp; Kontraktor Bangunan Berstandar Internasional
            </h2>
          </div>

          {/* Grid 4 Kolom (3 Services + 1 CTA) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
            
            {/* Loop 3 Layanan Utama */}
            {services.map((svc, index) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-2xl p-6 flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.02)] transition-all duration-300 relative border border-transparent hover:shadow-[0_10px_35px_rgba(0,0,0,0.06)]"
              >
                <div className="flex flex-col flex-grow mb-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-[19px] font-bold tracking-tight text-neutral-800 leading-snug">
                      <Link href={svc.href} className="hover:text-[#FFCC00] transition-colors">
                        {svc.title}
                      </Link>
                    </h3>
                    <span className="text-sm font-bold text-neutral-800 tracking-tight mt-1">
                      {svc.no}
                    </span>
                  </div>
                  
                  <div className="w-full h-[1px] bg-gray-100 mb-4" />
                  
                  <p className="text-gray-500 text-[13px] font-normal leading-relaxed">
                    {svc.desc}
                  </p>
                </div>

                <div className="relative aspect-[4/3.2] w-full overflow-hidden rounded-2xl mt-auto">
                  <div 
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${svc.image}')` }}
                  />
                  
                  <Link 
                    href={svc.href}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#FFCC00] text-black flex items-center justify-center shadow-lg opacity-0 scale-70 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 hover:bg-black hover:text-white"
                  >
                    <IoArrowForwardSharp size={18} className="transform -rotate-45" />
                  </Link>
                </div>
              </motion.div>
            ))}

            {/* Slot Ke-4: Card CTA Terintegrasi */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative rounded-2xl overflow-hidden p-6 flex flex-col justify-between bg-[#0F2340] group min-h-[350px] xl:min-h-auto shadow-md shadow-slate-900/10"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-25 transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('/images/heroproyek.webp')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2340] via-[#0F2340]/80 to-transparent" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#FFCC00] animate-pulse" />
                  <span className="text-[#FFCC00] text-[10px] font-bold tracking-widest uppercase block">KONSULTASI</span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase leading-tight">
                  Punya Rencana <br />Pembangunan Proyek?
                </h3>
                
                <div className="w-full h-[1px] bg-white/10" />
                
                <p className="text-gray-300 font-light text-[13px] leading-relaxed">
                  Diskusikan spesifikasi material, kebutuhan tata ruang, dan kalkulasi RAB transparan bersama tim teknis lapangan kami.
                </p>
              </div>

              <div className="relative z-10 pt-4 mt-auto">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 bg-[#FFCC00] text-black font-bold px-5 py-3.5 rounded-xl text-xs tracking-wider uppercase transition-all duration-300 shadow-lg shadow-black/30 hover:bg-white w-full"
                >
                  <IoLogoWhatsapp size={16} />
                  Hubungi WhatsApp
                </a>
              </div>
            </motion.div>
          </div>

          {/* ================= FOOTER BENEFITS & TEXT ================= */}
          <div className="mt-16 flex flex-col items-center justify-center gap-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {benefits.map((benefit) => (
                <span 
                  key={benefit} 
                  className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-xs font-medium text-neutral-700 shadow-[0_2px_10px_rgba(0,0,0,0.01)] border border-gray-50"
                >
                  <span className="w-1.5 h-1.5 bg-[#FFCC00]" />
                  {benefit}
                </span>
              ))}
            </div>

            <div className="text-xs md:text-sm font-medium tracking-wide text-neutral-600 flex items-center flex-wrap justify-center gap-2 mt-2">
              <span className="bg-[#FFCC00] text-black text-[10px] font-black px-2 py-0.5 rounded uppercase font-mono">
                Mari
              </span>
              <span>Kita ciptakan sesuatu yang luar biasa bersama-sama.</span>
              <a 
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="text-neutral-900 font-bold underline hover:text-[#FFCC00] transition-colors decoration-[#FFCC00] decoration-2 underline-offset-4"
              >
                Konsultasi Sekarang
              </a>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}