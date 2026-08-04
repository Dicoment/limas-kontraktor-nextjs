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
    "jasa kontraktor bekasi"
  ],
  authors: [{ name: "LIMAS KONTRAKTOR" }],
  creator: "Dicoment Agency",
  openGraph: {
    title: "LIMAS KONTRAKTOR - Jasa Kontraktor Bangunan & Renovasi Profesional di Jabodetabek",
    description: "Wujudkan bangunan kokoh impian Anda di Jabodetabek dengan tim berpengalaman sejak 2014 dan sistem perencanaan RAB jujur tanpa biaya silumen.",
    url: "https://limaskontraktor.com",
    siteName: "Limas Kontraktor",
    images: [
      {
        url: "/images/hero-home.webp",
        width: 1200,
        height: 630,
        alt: "Limas Kontraktor Utama Preview Image",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  alternates: {
    canonical: "https://limaskontraktor.com",
  },
}

async function getSiteImageSettings() {
  const keys = ["service_image_1", "service_image_2", "service_image_3", "homepage_excellence_image"]
  const settings = await prisma.setting.findMany({
    where: { key: { in: keys } },
    select: { key: true, value: true },
  })
  const map: Record<string, string> = {}
  for (const s of settings) map[s.key] = s.value
  return map
}

export default async function HomePage() {
  const latestProject = await prisma.project.findFirst({
    where: { status: "COMPLETED", coverImage: { not: null } },
    orderBy: { createdAt: "desc" },
    select: { coverImage: true },
  })

  const bgImage = latestProject?.coverImage || "/hero-home.webp"
  const siteImages = await getSiteImageSettings()

  return (
    <main>
      {/* 1. Hero Section  */}
      <HeroSection backgroundImage={bgImage} />
      
      {/* 2. Layanan Section */}
      <LayananSection
        images={{
          service_image_1: siteImages.service_image_1,
          service_image_2: siteImages.service_image_2,
          service_image_3: siteImages.service_image_3,
        }}
      />
      {/* 3. Keunggulan Section */}
      <ExcellenceSection imageSrc={siteImages.homepage_excellence_image} />
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