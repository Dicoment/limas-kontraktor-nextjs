"use client";

import { useState, useEffect, JSX } from "react";
import { motion } from "framer-motion";
import LayananSection from "@/components/sections/home/LayananSection";

export default function LayananPage(): JSX.Element {
  const [whatsappNumber, setWhatsappNumber] = useState("6282320721150");
  const [serviceImages, setServiceImages] = useState<{
    service_image_1?: string
    service_image_2?: string
    service_image_3?: string
  }>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings", { method: "GET" });
        if (res.ok) {
          const json = await res.json();
          // FIX: successResponse() ngebungkus payload jadi { success, data },
          // dan payload aslinya sendiri sudah { data: settingsObject, meta }.
          // Jadi nilai settingnya ada di json.data.data, bukan json.data
          // langsung — sebelumnya ini yang bikin service_image_1/2/3 &
          // contact_phone1 selalu undefined, jatuh ke fallback.
          const data = json?.data?.data;
          if (data?.contact_phone1) {
            const cleanNumber = data.contact_phone1.replace(/[^0-9]/g, "");
            setWhatsappNumber(cleanNumber.startsWith("0") ? `62${cleanNumber.substring(1)}` : cleanNumber);
          }
          setServiceImages({
            service_image_1: data?.service_image_1,
            service_image_2: data?.service_image_2,
            service_image_3: data?.service_image_3,
          });
        }
      } catch (err) {
        console.error("Failed to fetch settings for Layanan page:", err);
      }
    };
    fetchSettings();
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
      <LayananSection images={serviceImages} />
    </>
  );
}