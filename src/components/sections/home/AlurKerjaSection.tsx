"use client"

import { useRef, useEffect, useState } from "react"
import Button from "@/components/ui/Button"
import { FiPhone, FiMapPin, FiFileText, FiCheckSquare, FiTool } from "react-icons/fi"

const alur = [
  {
    nomor: "01",
    icon: <FiPhone size={24} />,
    title: "Konsultasi Awal",
    desc: "Hubungi tim spesialis kami via WhatsApp. Kita bedah visi proyek, kebutuhan ruang, estimasi budget, hingga timeline pengerjaan.",
    detail: "Respons Cepat & Solutif",
  },
  {
    nomor: "02",
    icon: <FiMapPin size={24} />,
    title: "Survei Lapangan",
    desc: "Tim teknik dan estimator kami terjun langsung ke lokasi untuk mengukur akurasi lahan dan memetakan kondisi struktur tanah.",
    detail: "Data Lapangan Presisi",
  },
  {
    nomor: "03",
    icon: <FiFileText size={24} />,
    title: "Penyusunan RAB",
    desc: "Kami menyusun Rencana Anggaran Biaya secara komprehensif dan jujur. Detail material tanpa biaya tersembunyi.",
    detail: "Akurat & Transparan",
  },
  {
    nomor: "04",
    icon: <FiCheckSquare size={24} />,
    title: "Penandatanganan Kontrak",
    desc: "Ikatan kerja sama diresmikan melalui kesepakatan tertulis yang menjamin perlindungan hak dan kewajiban kedua belah pihak.",
    detail: "Berkekuatan Hukum Tetap",
  },
  {
    nomor: "05",
    icon: <FiTool size={24} />,
    title: "Eksekusi & Pengawasan",
    desc: "Proyek dikawal ketat oleh pengawas lapangan profesional dengan laporan progres berkala hingga serah terima kunci.",
    detail: "Garansi Kualitas Struktur",
  },
]

export default function AlurKerjaSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [translateX, setTranslateX] = useState(0)
  
  // FIX HYDRATION MISMATCH: State pengunci agar Client & Server merender output awal yang sama presisi
  const [hasMounted, setHasMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    
    const handleScroll = () => {
      // Ambil width asli di client browser secara aman
      const mobileView = window.innerWidth < 768
      setIsDesktop(!mobileView)

      if (mobileView) {
        setTranslateX(0)
        return
      }

      if (!containerRef.current || !trackRef.current) return

      const container = containerRef.current
      const track = trackRef.current
      const rect = container.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const totalScrollable = rect.height - windowHeight

      const trackWidth = track.scrollWidth
      const visibleWidth = window.innerWidth
      const maxMove = trackWidth - visibleWidth

      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        const scrolled = Math.abs(rect.top)
        const progress = Math.min((scrolled / totalScrollable) * 1.4, 1)
        if (maxMove > 0) setTranslateX(-progress * maxMove)
      } else if (rect.top > 0) {
        setTranslateX(0)
      } else {
        if (maxMove > 0) setTranslateX(-maxMove)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)
    
    // Trigger kalkulasi awal saat client selesai mounting
    handleScroll()
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  return (
    // md:h-[260vh] diaktifkan hanya di desktop, di mobile tinggi mengikuti isi konten (auto)
    <section ref={containerRef} className="relative h-auto md:h-[260vh] bg-[#0a1628] select-none">

      {/* Sticky Viewport Container (Hanya mengunci h-screen di Desktop) */}
      <div className="relative md:sticky md:top-0 h-auto md:h-screen overflow-hidden flex flex-col justify-between py-16 md:py-20 gap-10 md:gap-0">

        {/* Background Premium Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0F2340] to-[#0a1628] pointer-events-none" />
        <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#E87722]/10 blur-[120px] pointer-events-none" />
        <div className="absolute -right-40 bottom-0 w-[400px] h-[400px] rounded-full bg-blue-900/20 blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E87722]/40 to-transparent" />

        {/* 1. HEADER SECTION */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#E87722]/10 border border-[#E87722]/20 px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E87722] animate-pulse" />
              <p className="text-[#E87722] text-xs font-bold tracking-widest uppercase">Alur Kerja Kami</p>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight">
              PROSES KERJA<br />
              <span className="text-[#E87722]">SISTEMATIS</span>
            </h2>
          </div>
          <p className="text-slate-200 text-sm md:text-base max-w-md leading-relaxed font-light">
            Kami memutus birokrasi kontraktor konvensional melalui tahapan terukur demi efisiensi budget pengerjaan dan akurasi mutu bangunan Anda.
          </p>
        </div>

        {/* 2. CARDS TRACK SECTION */}
        <div className="relative z-10 w-full my-auto overflow-x-auto md:overflow-x-visible no-scrollbar">
          <div
            ref={trackRef}
            // FIX TERBAIK: Selama SSR/Server render, dipaksa 'none'. Begitu terpasang di client browser (hasMounted) dan layar desktop aktif, baru jalankan nilai translateX.
            style={{ transform: hasMounted && isDesktop ? `translateX(${translateX}px)` : 'none' }}
            className="flex gap-6 w-max will-change-transform transition-transform duration-75 ease-out py-4 px-6 md:pl-[calc((100vw-min(80rem,100vw))/2+1.5rem)] md:pr-12"
          >
            {alur.map((step) => (
              <div
                key={step.nomor}
                className="group relative w-[285px] md:w-[360px] lg:w-[384px] shrink-0 rounded-2xl p-6 md:p-8 overflow-hidden transition-all duration-500 cursor-default"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)"
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: "linear-gradient(135deg, rgba(232,119,34,0.08) 0%, transparent 60%)" }}
                />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E87722]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Nomor Aksen Latar Raksasa */}
                <div
                  className="absolute right-5 bottom-1 text-[100px] font-black leading-none select-none pointer-events-none"
                  style={{ color: "rgba(255,255,255,0.03)" }}
                >
                  {step.nomor}
                </div>

                {/* Bagian Icon */}
                <div
                  className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-[#E87722]/20 group-hover:-translate-y-1"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <span className="text-[#E87722] group-hover:scale-105 transition-transform duration-300 block">
                    {step.icon}
                  </span>
                </div>

                {/* Informasi Judul & Detail */}
                <div className="relative z-10 space-y-3">
                  <p className="text-[#E87722] text-[10px] font-black tracking-widest uppercase">Tahap {step.nomor}</p>
                  <h3 className="text-white font-extrabold text-lg md:text-xl leading-snug tracking-tight group-hover:text-[#E87722] transition-colors duration-300 uppercase">
                    {step.title}
                  </h3>
                  <p className="text-slate-200 font-normal text-xs md:text-sm leading-relaxed min-h-[72px] pt-1">
                    {step.desc}
                  </p>
                  
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E87722]/20"
                    style={{ background: "rgba(232,119,34,0.08)" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E87722]" />
                    <span className="text-[#E87722] text-[10px] font-extrabold tracking-wider uppercase">{step.detail}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. BOTTOM CTA BANNER */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full shrink-0">
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl px-8 py-6"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)"
            }}
          >
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-white font-black text-lg md:text-xl uppercase tracking-tight">
                Mulai Rencana Konstruksi Anda
              </h3>
              <p className="text-slate-300 font-light text-xs md:text-sm">
                Konsultasikan kebutuhan material, struktur bangunan, and kalkulasi RAB bersama tim estimator lapangan kami.
              </p>
            </div>
            
            <Button
              href="https://wa.me/6282320721150"
              target="_blank"
              rel="noreferrer"
              variant="primary"
              size="lg"
              className="w-full md:w-auto font-black text-xs uppercase tracking-wider bg-[#E87722] border-none text-white hover:bg-orange-600 inline-flex items-center justify-center gap-2"
            >
              <FiPhone size={14} className="animate-pulse" />
              <span>Konsultasi Proyek</span>
            </Button>
          </div>
        </div>

      </div>
    </section>
  )
}