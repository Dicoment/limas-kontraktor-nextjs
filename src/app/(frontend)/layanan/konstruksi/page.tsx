import type { Metadata } from "next";
import db from "@/lib/prisma";
import { FaClipboardList, FaShieldAlt, FaUsers } from "react-icons/fa";
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
  title: "Jasa Kontraktor Bangunan Profesional Bekasi & Jabodetabek | Limas Kontraktor",
  description: "Layanan Jasa kontraktor bangunan terpercaya di Bekasi dan Jabodetabek. Spesialis pembangunan rumah tinggal, ruko komersial, gedung, dan konstruksi baja WF dengan RAB transparan.",
};

async function getCompletedProjects() {
  const projects = await db.project.findMany({
    where: { status: "COMPLETED" },
    take: 4,
    orderBy: { createdAt: "desc" },
  });
  return projects;
}

export default async function JasaKontraktorPage() {
  const completedProjects = await getCompletedProjects();

  return (
    <main className="bg-white font-sans antialiased text-[#0F2340]">
      
      {/* ── 1. HERO SECTION ── */}
      <ServiceHero 
        companyTag="Limas Kontraktor Indonesia"
        categoryTags={[
          "RAB TRANSPARAN & BERGARANSI",
          "SURVEI LOKASI & KONSULTASI GRATIS",
          "TENAGA AHLI & ENGINEER PROFESIONAL",
          "MATERIAL STANDAR SNI"
        ]} 
        titleLine1="Jasa Kontraktor Bangunan"
        titleLine2="& Konstruksi Profesional Bekasi & Jabodetabek"
        description="Limas Kontraktor (CV Listiya Mandiri Jaya Steel) melayani jasa pembangunan rumah, ruko, gedung komersial, dan konstruksi baja WF berpengalaman dengan RAB transparan."
        bgImage="/images/heroabout.webp"
        ctaPortfolioHref="/proyek"
      />

      {/* ── 2. BRIEF EXPLANATION & CREDIBILITY ── */}
      <CredibilitySection 
        subtitle="Tentang Kami"
        title={
          <>
            Limas Kontraktor adalah{" "}
            <span className="font-extrabold text-slate-900">mitra terpercaya Anda</span>{" "}
            untuk{" "}
            <span className="font-extrabold text-slate-900">
              konstruksi bangunan baru profesional
            </span>{" "}
            di Indonesia. Kami menyediakan{" "}
            <span className="font-extrabold text-slate-900">
              solusi pelaksanaan konstruksi end-to-end
            </span>{" "}
            dalam mewujudkan bangunan impian Anda.
          </>
        }
        buttonText="Konsultasi Konstruksi"
        buttonHref="/kontak"
        imageSrc="/images/proyek-limas.webp"
        imageAlt="Proyek Konstruksi Limas Kontraktor"
      />

      {/* ── 3. SEO & BENEFIT SECTION ── */}
      <SeoInfoSection 
        subtitle="Solusi Konstruksi Bangunan"
        title={
          <>
            Layanan <span className="font-extrabold text-slate-900">Jasa Kontraktor</span> & Pelaksana Konstruksi
          </>
        }
        description="Jasa kontraktor bangunan dan pemborong konstruksi terpercaya oleh Limas Kontraktor Indonesia (CV Listiya Mandiri Jaya Steel). Kami menghadirkan hasil fisik bangunan presisi, pengawasan tim teknik sipil ahli, dan garansi pemeliharaan struktur."
        benefits={[
          {
            id: 1,
            icon: <FaClipboardList />,
            title: "RAB Transparan & Tanpa Hidden Fee",
            description: "Spesifikasi bahan bangunan dan biaya borongan jasa kontraktor dirinci transparan sesuai AHSP riil untuk mencegah pembengkakan budget di tengah jalan.",
          },
          {
            id: 2,
            icon: <FaShieldAlt />,
            title: "Material Berstandar SNI & Garansi",
            description: "Penggunaan material bangunan lolos uji kelayakan SNI didukung jaminan garansi pemeliharaan struktur pasca serah terima kunci.",
          },
          {
            id: 3,
            icon: <FaUsers />,
            title: "Manajemen Proyek & Tim Engineer",
            description: "Pengawasan berkala oleh tim teknisi sipil profesional dan mandor berpengalaman untuk memastikan hasil presisi sesuai gambar kerja teknis DED.",
          }
        ]}
        infoHeading="Jasa Kontraktor Bangunan & Pemborong Konstruksi Profesional"
        infoParagraphs={[
          "Limas Kontraktor melayani jasa pembangunan rumah mewah, konstruksi ruko komersial, pembangunan gudang struktur baja WF, hingga gedung kantor di area Bekasi, Jakarta, Depok, Tangerang, dan Bogor.",
          "Dengan skema kontrak kerja yang transparan, manajemen waktu terukur, serta pendampingan legalitas perizinan PBG/IMB, kami memastikan seluruh proses pelaksanaan fisik bangunan berjalan lancar, aman secara legalitas, dan berstandar mutu tinggi."
        ]}
        buttonText="Tentang Limas Kontraktor"
        buttonHref="/tentang"
        youtubeUrl="https://www.youtube.com/embed/sYSwjKiAtwQ"
        thumbnailSrc="/images/thumbnail.png"
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

      {/* ── 8. FAQ SECTION ── */}
      <FaqSection />

    </main>
  );
}