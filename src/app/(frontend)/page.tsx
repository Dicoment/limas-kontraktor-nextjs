import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import HeroSection from "@/components/sections/home/HeroSection"
import LayananSection from "@/components/sections/home/LayananSection"
import ExcellenceSection from "@/components/sections/home/ExcellenceSection"
import PortfolioSection from "@/components/sections/home/PortfolioSection"
import AlurKerjaSection from "@/components/sections/home/AlurKerjaSection"
import TestimonialSection from "@/components/sections/home/TestimonialSection"
import FaqSection from "@/components/sections/home/FaqSection"
export const dynamic = "force-dynamic"
// ==========================================
// CONFIGURASI META TAG UNTUK SEO MAXIMAL
// ==========================================
export const metadata: Metadata = {
  title: "Jasa Kontraktor Rumah & Renovasi Jabodetabek | LIMAS KONTRAKTOR",
  description: "Jasa kontraktor profesional untuk bangun baru, desain arsitektur, dan renovasi rumah/ruko di Bekasi, Jakarta, dan Jabodetabek. Perencanaan RAB transparan, amanah, dan bergaransi resmi.",
  keywords: [
    "jasa kontraktor rumah", 
    "kontraktor bangun baru", 
    "jasa renovasi rumah bekasi", 
    "kontraktor jakarta", 
    "desain arsitektur", 
    "kontraktor jabodetabek", 
    "rab transparan"
  ],
  authors: [{ name: "LIMAS KONTRAKTOR" }],
  creator: "Dicoment Agency",
  
  // OpenGraph (Untuk tampilan maksimal saat link dibagikan di WA, FB, LinkedIn)
  openGraph: {
    title: "LIMAS KONTRAKTOR | Jasa Bangun Baru & Renovasi Rumah Profesional",
    description: "Wujudkan bangunan kokoh impian Anda di Jabodetabek dengan tim berpengalaman sejak 2014 dan sistem perencanaan RAB jujur tanpa biaya silumen.",
    url: "https://limaskontraktor.com", // Ganti dengan domain asli nanti
    siteName: "Limas Kontraktor",
    images: [
      {
        url: "/hero-home.webp",
        width: 1200,
        height: 630,
        alt: "Limas Kontraktor Utama Preview Image",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  
  // Mencegah robot index menduplikasi halaman secara tidak sengaja
  alternates: {
    canonical: "https://limaskontraktor.com",
  },
}

export default async function HomePage() {
  // Menarik data portfolio proyek terbaru yang sukses diselesaikan untuk dijadikan background
  const latestProject = await prisma.project.findFirst({
    where: { status: "COMPLETED", coverImage: { not: null } },
    orderBy: { createdAt: "desc" },
    select: { coverImage: true },
  })

  // Menggunakan cover image proyek terbaru, jika database kosong maka lari ke local asset
  const bgImage = latestProject?.coverImage || "/hero-home.webp"

  return (
    <main>
      {/* 1. Hero Section  */}
      <HeroSection backgroundImage={bgImage} />
      
      {/* 2. Layanan Section */}
      <LayananSection />
      {/* 3. Keunggulan Section */}
      <ExcellenceSection />
      {/* 4. Portfolio Section */}
      <PortfolioSection />
      {/* 5. Alur Kerja Section */}
      <AlurKerjaSection />
      {/* 6. Testimonial Section */}
      <TestimonialSection />
      {/* 7. FAQ Section */}
      <FaqSection />
    </main>
  )
}
