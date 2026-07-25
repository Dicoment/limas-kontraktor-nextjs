import type { Metadata } from "next";
import db from "@/lib/prisma";
import ServiceHero from "@/components/sections/services/ServiceHero";
import CredibilitySection from "@/components/sections/services/CredibilitySection";
import SeoInfoSection from "@/components/sections/services/SeoInfoSection";
import PortfolioSection from "@/components/sections/services/PortfolioSection";
import WhyChooseUsSection from "@/components/sections/services/WhyChooseUsSection";
import WorkProcessSection from "@/components/sections/services/WorkProcessSection";
import TestimonialSection from "@/components/sections/home/TestimonialSection";
import FaqSection from "@/components/sections/home/FaqSection";
import { FaDraftingCompass, FaComments, FaCalculator } from "react-icons/fa";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jasa Arsitek, Desain Interior & Penyusunan RAB Transparan | Limas Kontraktor",
  description: "Layanan jasa desain arsitektur bangunan, perencanaan interior, gambar kerja teknis (DED), dan penyusunan RAB transparan di Bekasi dan Jabodetabek.",
};

async function getCompletedProjects() {
  const projects = await db.project.findMany({
    where: { status: "COMPLETED" },
    take: 4,
    orderBy: { createdAt: "desc" },
  });
  return projects;
}

export default async function JasaArsitekDesainRabPage() {
  const completedProjects = await getCompletedProjects();

  return (
    <main className="bg-white font-sans antialiased text-[#0F2340]">
      
      {/* ── 1. HERO SECTION ── */}
      <ServiceHero 
        companyTag="Limas Kontraktor Indonesia"
        categoryTags={[
          "VISUALISASI 3D ARSITEKTUR & INTERIOR",
          "PENYUSUNAN RAB TRANSPARAN",
          "DOKUMEN GAMBAR KERJA (DED) LENGKAP",
          "SURVEI LOKASI & KONSULTASI GRATIS"
        ]} 
        titleLine1="Jasa Desain Arsitektur,"
        titleLine2="Interior & Perencanaan RAB Bangunan"
        description="Limas Kontraktor (CV Listiya Mandiri Jaya Steel) melayani perencanaan arsitektur, visualisasi 3D interior-eksterior, gambar kerja teknis, serta penyusunan RAB transparan untuk rumah dan bangunan komersial."
        bgImage="/images/heroabout.webp"
        ctaPortfolioHref="/proyek"
      />

      {/* ── 2. BRIEF EXPLANATION & CREDIBILITY ── */}
      <CredibilitySection 
        subtitle="Tentang Perencanaan Desain"
        title={
          <>
            Limas Kontraktor adalah{" "}
            <span className="font-extrabold text-slate-900">mitra perencanaan terpercaya Anda</span>{" "}
            untuk{" "}
            <span className="font-extrabold text-slate-900">
              desain arsitektur & perhitungan RAB profesional
            </span>{" "}
            di Indonesia. Kami menyediakan{" "}
            <span className="font-extrabold text-slate-900">
              solusi perencanaan bangunan menyeluruh
            </span>{" "}
            dari tahap konsep hingga kesiapan konstruksi.
          </>
        }
        buttonText="Konsultasi Desain & RAB"
        buttonHref="/kontak"
        imageSrc="/images/proyek-limas.webp"
        imageAlt="Proyek Perencanaan Arsitektur Limas Kontraktor"
      />

 {/* ── 3. SEO & BENEFIT SECTION ── */}
      <SeoInfoSection 
        subtitle="Solusi Perencanaan Bangunan"
        title={
          <>
            Layanan <span className="font-extrabold text-slate-900">Jasa Arsitek</span>, Desain Interior & Perencanaan RAB
          </>
        }
        description="Jasa arsitek dan perencanaan bangunan profesional oleh Limas Kontraktor Indonesia (CV Listiya Mandiri Jaya Steel). Kami memadukan estetika arsitektur modern, kekuatan presisi struktur, serta transparansi Rencana Anggaran Biaya."
        benefits={[
          {
            id: 1,
            icon: <FaDraftingCompass />,
            title: "Gambar Kerja DED Presisi",
            description: "Penyusunan dokumen teknis Detail Engineering Design (DED) lengkap meliputi denah arsitektur, detail struktur beton/baja, serta denah MEP (listrik & air).",
          },
          {
            id: 2,
            icon: <FaComments />,
            title: "Konsultasi & Visualisasi 3D",
            description: "Diskusi kebutuhan tata ruang intensif dilengkapi pemodelan visualisasi 3D interior & eksterior realistis sebelum tahap konstruksi dimulai.",
          },
          {
            id: 3,
            icon: <FaCalculator />,
            title: "Jasa Pembuatan RAB Akurat",
            description: "Estimasi Rencana Anggaran Biaya proyek disusun transparan berdasarkan Analisa Harga Satuan Pekerjaan (AHSP) riil untuk mencegah biaya membengkak.",
          }
        ]}
        infoHeading="Jasa Desain Arsitek & Konsultan Perencanaan RAB Profesional"
        infoParagraphs={[
          "Limas Kontraktor melayani jasa arsitek rumah tinggal, desain interior apartemen, renovasi ruko, perencanaan kantor, hingga bangunan komersial di wilayah Jakarta, Bekasi, Depok, Tangerang, dan Bogor (Jabodetabek).",
          "Setiap perancangan difokuskan pada efisiensi tata ruang, pencahayaan alami, serta kelayakan struktur bangunan. Kami menyediakan dokumen gambar kerja teknis (DED) yang memenuhi standar perizinan PBG/IMB serta lampiran RAB transparan agar proses pembangunan berjalan tepat mutu, tepat waktu, dan efisien."
        ]}
        buttonText="Tentang Limas Kontraktor"
        buttonHref="/tentang"
        youtubeUrl="https://www.youtube.com/embed/sYSwjKiAtwQ"
      />
      
      {/* ── 4. PORTFOLIO DYNAMIC GRID ── */}
      <PortfolioSection 
        projects={completedProjects} 
        buttonText="LIHAT SEMUA PORTOFOLIO"
        buttonHref="/proyek"
      />

      {/* ── 5. WHY CHOOSE US ── */}
      <WhyChooseUsSection />

      {/* ── 6. ALUR KERJA ── */}
      <WorkProcessSection />

      {/* ── 7. TESTIMONIALS ── */}
      <TestimonialSection />

      {/* ── 8. FAQ ── */}
      <FaqSection />

    </main>
  );
}