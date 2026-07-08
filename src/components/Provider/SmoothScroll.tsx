"use client"

import { useEffect } from "react"
import Lenis from "lenis"

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inisialisasi Lenis dengan konfigurasi efek kinetik/berat
    const lenis = new Lenis({
      duration: 1.5,     // Durasi scroll (makin tinggi angka, makin lama & empuk efek remnya)
      lerp: 0.07,        // Mengatur tingkat kelembutan rem (0.05 - 0.1 adalah sweet spot untuk efek berat)
      smoothWheel: true, // Mengaktifkan smooth scroll untuk mouse wheel
    })

    // Loop animasi menggunakan RequestAnimationFrame (RAF)
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Bersihkan instance saat komponen di-unmount
    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}