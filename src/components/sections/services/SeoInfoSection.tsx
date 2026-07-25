"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { IoArrowForwardSharp, IoPlay } from "react-icons/io5";
import Button from "@/components/ui/Button";

export interface SeoBenefitItem {
  id?: string | number;
  numberTag?: string;
  icon?: ReactNode;
  title: string;
  description: string;
}

export interface SeoInfoSectionProps {
  subtitle?: string;
  title?: ReactNode;
  description?: string;
  benefits?: SeoBenefitItem[];
  infoHeading?: string;
  infoParagraphs?: string[];
  buttonText?: string;
  buttonHref?: string;
  youtubeUrl?: string;
  thumbnailSrc?: string;
}

const defaultBenefits: SeoBenefitItem[] = [
  {
    id: 1,
    numberTag: "01",
    title: "Jasa Arsitek & Gambar Kerja DED",
    description:
      "Perencanaan visual 3D hingga Dokumen Gambar Kerja (DED) presisi yang siap dieksekusi tim lapangan tanpa hambatan teknis.",
  },
  {
    id: 2,
    numberTag: "02",
    title: "Transparansi Penyusunan RAB",
    description:
      "Rencana Anggaran Biaya disusun detail berdasarkan Analisa Harga Satuan Pekerjaan (AHSP) untuk mencegah risiko pembengkakan budget.",
  },
  {
    id: 3,
    numberTag: "03",
    title: "Konsultasi & Layout Ruang Optima",
    description:
      "Setiap sudut denah dirancang efisien, memadukan fungsi tata ruang, pencahayaan alami, dan standar estetika bangunan modern.",
  },
];

export default function SeoInfoSection({
  subtitle = "Solusi Perencanaan",
  title = (
    <>
      Layanan <span className="font-extrabold text-slate-900">Jasa Arsitek</span> & Perencanaan RAB
    </>
  ),
  description = "Limas Kontraktor menyediakan layanan perencanaan arsitektur menyeluruh untuk rumah tinggal, ruko, dan bangunan komersial. Kami memastikan setiap konsep desain memiliki dasar perhitungan struktur yang kuat dan estimasi anggaran yang terukur.",
  benefits = defaultBenefits,
  infoHeading = "Jasa Desain Arsitek & Perencanaan RAB",
  infoParagraphs = [
    "Limas Kontraktor melayani jasa arsitek, desain interior, dan pembuatan RAB profesional untuk rumah tinggal, ruko, kantor, serta bangunan komersial.",
    "Dengan dokumen DED yang presisi dan Rencana Anggaran Biaya yang transparan, seluruh proses pembangunan Anda dapat berjalan terukur, tepat mutu, dan efisien.",
  ],
  buttonText = "Tentang Limas Kontraktor",
  buttonHref = "/tentang",
  youtubeUrl = "https://www.youtube.com/embed/sYSwjKiAtwQ",
  thumbnailSrc = "/images/thumbnail.png",
}: SeoInfoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const embedUrlWithAutoplay = youtubeUrl.includes("?")
    ? `${youtubeUrl}&autoplay=1`
    : `${youtubeUrl}?autoplay=1`;

  return (
    <section className="bg-white text-slate-900 font-sans py-14 md:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 space-y-14 md:space-y-24">
        
        {/* ── 1. HEADER & BENEFIT COLUMNS ── */}
        <div className="space-y-10 md:space-y-16">
          <div className="max-w-3xl space-y-4">
            {subtitle && (
              <p className="text-base md:text-xs font-normal text-slate-400 tracking-wider uppercase">
                {subtitle}
              </p>
            )}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-slate-800 leading-[1.25] tracking-tight">
              {title}
            </h2>
            <p className="text-base md:text-sm lg:text-base text-slate-500 leading-relaxed font-normal pt-2">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {benefits.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="space-y-3"
              >
                {item.icon ? (
                  <div className="text-[#E87722] text-xl pb-1">
                    {item.icon}
                  </div>
                ) : item.numberTag ? (
                  <span className="text-base md:text-xs font-mono font-medium text-[#E87722] tracking-widest block pb-1">
                    [{item.numberTag}]
                  </span>
                ) : null}

                <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-base md:text-xs lg:text-sm text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── 2. SEO CONTENT BLOCK & VIDEO FACADE (PORSI 50:50) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Custom Video Thumbnail / Play State */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 group shadow-sm"
          >
            {!isPlaying ? (
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="w-full h-full relative flex items-center justify-center cursor-pointer focus:outline-none"
                aria-label="Play Video"
              >
                <Image
                  src={thumbnailSrc}
                  alt={infoHeading}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                />
                
                {/* Overlay Soft Dark */}
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors" />

                {/* Minimalist Architectural Play Button */}
                <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/90 backdrop-blur-md text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#E87722] group-hover:text-white transition-all duration-300">
                  <IoPlay className="text-xl ml-1" />
                </div>
              </button>
            ) : (
              <iframe
                src={embedUrlWithAutoplay}
                title={infoHeading}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </motion.div>

          {/* Clean SEO Content */}
          <div className="space-y-6">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-slate-900 leading-snug tracking-tight">
              {infoHeading}
            </h3>

            <div className="space-y-4 text-base md:text-sm lg:text-base text-slate-600 leading-relaxed font-normal">
              {infoParagraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {buttonText && buttonHref && (
              <div className="pt-2">
                <Button
                  href={buttonHref}
                  variant="outline-dark"
                  size="md"
                  className="rounded-full gap-2.5 text-base md:text-sm normal-case font-normal hover:scale-105 active:scale-95 transition-transform"
                >
                  <span>{buttonText}</span>
                  <IoArrowForwardSharp className="text-base md:text-sm" />
                </Button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}