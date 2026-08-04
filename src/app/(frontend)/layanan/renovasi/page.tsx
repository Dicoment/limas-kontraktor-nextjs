import type { Metadata } from "next";
import db from "@/lib/prisma";
import { FaClipboardList, FaShieldAlt, FaHammer } from "react-icons/fa";
import ServiceHero from "@/components/sections/services/ServiceHero";
import CredibilitySection from "@/components/sections/services/CredibilitySection";
import SeoInfoSection from "@/components/sections/services/SeoInfoSection";
import PortfolioSection from "@/components/sections/services/PortfolioSection";
import WhyChooseUsSection from "@/components/sections/services/WhyChooseUsSection";
import WorkProcessSection from "@/components/sections/services/WorkProcessSection";
import TestimonialSection from "@/components/sections/home/TestimonialSection";
import FaqSection from "@/components/sections/home/FaqSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jasa Renovasi Rumah & Bangunan Terpercaya Jabodetabek | Limas Kontraktor",
  description: "Layanan jasa renovasi rumah, ruko, dan gedung profesional di Bekasi & Jabodetabek. Melayani renovasi total, penambahan lantai, perbaikan struktur, hingga peremajaan fasad dengan RAB transparan.",
};

async function getCompletedProjects() {
  const projects = await db.project.findMany({
    where: { status: "COMPLETED" },
    take: 4,
    orderBy: { createdAt: "desc" },
  });
  return projects;
}

async function getServiceImageSettings() {
  const keys = [
    "service_renovasi_hero_image",
    "service_renovasi_body_image",
    "service_renovasi_youtube_url",
  ]
  const settings = await db.setting.findMany({
    where: { key: { in: keys } },
    select: { key: true, value: true },
  })
  const map: Record<string, string> = {}
  for (const s of settings) map[s.key] = s.value
  return {
    heroImage: map["service_renovasi_hero_image"] || "",
    bodyImage: map["service_renovasi_body_image"] || "",
    youtubeUrl: map["service_renovasi_youtube_url"] || "",
  }
}

export default async function JasaRenovasiPage() {
  const completedProjects = await getCompletedProjects();
  const serviceImages = await getServiceImageSettings();

  return (
    <main className="bg-white font-sans antialiased text-[#0F2340]">
      
      {/* ── 1. HERO SECTION ── */}
      <ServiceHero 
        companyTag="Limas Kontraktor Indonesia"
        categoryTags={[
          "RENOVASI TOTAL & PARSIAL",
          "SURVEI LOKASI & KONSULTASI GRATIS",
          "RAB TRANSPARAN TANPA HIDDEN FEE",
          "GARANSI PEMELIHARAAN STRUKTUR"
        ]} 
        titleLine1="Jasa Renovasi Rumah"
        titleLine2="& Peremajaan Properti Jabodetabek"
        description="Solusi ahli untuk renovasi rumah tinggal, ruko, dan bangunan komersial. Mulai dari penambahan lantai (tingkat), rekonstruksi denah, hingga perbaikan struktur bergaransi."
        bgImage={serviceImages.heroImage || "/images/heroabout.webp"}
        ctaPortfolioHref="/proyek"
      />

      {/* ── 2. BRIEF EXPLANATION & CREDIBILITY ── */}
      <CredibilitySection 
        subtitle="Tentang Kami"
        title={
          <>
            Limas Kontraktor adalah{" "}
            <span className="font-extrabold text-slate-900">spesialis renovasi bangunan</span>{" "}
            yang siap mewujudkan{" "}
            <span className="font-extrabold text-slate-900">
              hunian yang lebih modern, kokoh, dan fungsional
            </span>. Kami memastikan proses peremajaan properti Anda berjalan{" "}
            <span className="font-extrabold text-slate-900">
              rapi, tepat waktu, dan aman secara struktur
            </span>.
          </>
        }
        buttonText="Konsultasi Renovasi Gratis"
        buttonHref="/kontak"
        imageSrc={serviceImages.bodyImage || "/images/proyek-limas.webp"}
        imageAlt="Proyek Renovasi Limas Kontraktor"
      />

      {/* ── 3. SEO & BENEFIT SECTION ── */}
      <SeoInfoSection 
        subtitle="Solusi Peremajaan Properti"
        title={
          <>
            Layanan <span className="font-extrabold text-slate-900">Jasa Renovasi</span> Total & Parsial
          </>
        }
        description="Ubah tampilan dan fungsi properti lama Anda menjadi lebih bernilai tinggi bersama Limas Kontraktor. Didukung inspeksi kondisi fisik eksisting, perencanaan teknis matang, dan pelaksanaan kerja yang rapi."
        benefits={[
          {
            id: 1,
            icon: <FaHammer />,
            title: "Renovasi Total & Penambahan Lantai",
            description: "Pengerjaan peninggian bangunan, pembongkaran sekat ruangan, pembuatan dak beton, hingga renovasi fasad tampak depan berkonsep modern.",
          },
          {
            id: 2,
            icon: <FaClipboardList />,
            title: "RAB Renovasi Terukur & Jujur",
            description: "Perhitungan anggaran disusun mendalam berdasarkan survei teknis lapangan untuk menghindari pembengkakan dana atau perubahan harga di tengah jalan.",
          },
          {
            id: 3,
            icon: <FaShieldAlt />,
            title: "Penguatan Struktur & Garansi",
            description: "Perbaikan kerusakan fondasi, dinding retak struktur, maupun atap bocor dikerjakan dengan standar teknik sipil serta dilengkapi jaminan garansi.",
          }
        ]}
        infoHeading="Jasa Kontraktor Renovasi Rumah & Ruko Profesional"
        infoParagraphs={[
          "Limas Kontraktor melayani jasa renovasi rumah minimalis, peremajaan ruko komersial, perbaikan atap baja ringan, penambahan kamar tidur, hingga penataan ulang tata ruang interior/eksterior untuk wilayah Bekasi, Jakarta, Depok, Tangerang, dan Bogor.",
          "Setiap proyek renovasi diawali dengan analisis kekuatan bangunan eksisting oleh tim engineer kami, sehingga setiap perubahan fungsi atau penambahan lantai dipastikan aman dari risiko pergeseran struktur."
        ]}
        buttonText="Tentang Limas Kontraktor"
        buttonHref="/tentang"
        youtubeUrl={serviceImages.youtubeUrl || "https://www.youtube.com/embed/sYSwjKiAtwQ"}
        thumbnailSrc={serviceImages.bodyImage || "/images/thumbnail.png"}
      />

      {/* ── 4. PORTFOLIO DYNAMIC GRID ── */}
      <PortfolioSection 
        projects={completedProjects} 
        buttonText="LIHAT HASIL RENOVASI"
        buttonHref="/proyek"
      />

      {/* ── 5. WHY CHOOSE US ── */}
      <WhyChooseUsSection />

      {/* ── 6. ALUR KERJA ── */}
      <WorkProcessSection />

      {/* ── 7. TESTIMONIALS ── */}
      <TestimonialSection />

      {/* ── 8. FAQ SECTION ── */}
      <FaqSection />

    </main>
  );
}