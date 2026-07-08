import type { Metadata } from "next";
import Link from "next/link";
import db from "@/lib/prisma";
import { FaBuilding, FaCompass, FaFileInvoiceDollar, FaClipboardList, FaUsers } from "react-icons/fa6";
import { FaHardHat, FaShieldAlt } from "react-icons/fa";
import { IoArrowForwardSharp } from "react-icons/io5";
import TestimonialSection from "@/components/sections/home/TestimonialSection";

export const metadata: Metadata = {
  title: "Jasa Kontraktor Bangunan Profesional Bekasi | Limas Kontraktor",
  description: "Layanan kontraktor bangunan terpercaya di Bekasi dan Jabodetabek. Spesialis konstruksi rumah tinggal, ruko komersial, gudang baja WF, dan penyusunan RAB transparan.",
};

async function getCompletedProjects() {
  const projects = await db.project.findMany({
    where: { status: "COMPLETED" }, 
    take: 4,
    orderBy: { createdAt: "desc" },
  });
  return projects;
}

const alurKerja = [
  {
    langkah: "01",
    nama: "Konsultasi & Survei Lapangan",
    deskripsi: "Tim teknis sipil kami melakukan peninjauan lokasi proyek untuk mengukur luasan tanah, analisis topografi, dan pemetaan struktur awal bangunan Anda.",
  },
  {
    langkah: "02",
    nama: "Penyusunan RAB Detail",
    deskripsi: "Kami menyusun Rencana Anggaran Biaya (RAB) rumah atau ruko secara transparan, merinci setiap item pekerjaan tanpa ada biaya siluman.",
  },
  {
    langkah: "03",
    nama: "Penandatanganan SPK Resmi",
    deskripsi: "Ikatan komitmen kerja sama legal melalui Surat Perjanjian Kerja (SPK) hitam di atas putih yang menjamin harga borongan mengikat dan tidak membengkak.",
  },
  {
    langkah: "04",
    nama: "Eksekusi & Konstruksi Fisik",
    deskripsi: "Proses pembangunan fisik dikerjakan oleh tukang terampil dengan pengawasan mandor teknis berkala demi menjaga presisi struktur sipil.",
  },
];

const subLayanan = [
  {
    judul: "Kontraktor Rumah Tinggal",
    deskripsi: "Jasa pembangunan rumah minimalis, modern, hingga mewah dari pondasi awal hingga serah terima kunci (all-in) dengan spesifikasi struktur tahan gempa.",
    icon: <FaBuilding size={24} />,
  },
  {
    judul: "Konstruksi Ruko & Komersial",
    deskripsi: "Pembangunan gedung komersial, ruko, kantor, dan ruang usaha dengan efisiensi tata ruang maksimal guna menunjang produktivitas bisnis Anda.",
    icon: <FaHardHat size={24} />,
  },
  {
    judul: "Pembangunan Gudang & Baja WF",
    deskripsi: "Spesialis konstruksi baja berat bentang lebar untuk bangunan pabrik, gudang logistik, dan fasilitas industrial dengan standar safety tingkat tinggi.",
    icon: <FaCompass size={24} />,
  },
  {
    judul: "Pekerjaan Struktur & Beton Sipil",
    deskripsi: "Melayani pengerjaan pembesian, pengecoran beton ready mix kualitas tinggi, sloof pondasi, kolom praktis, hingga dak lantai bertingkat.",
    icon: <FaFileInvoiceDollar size={24} />,
  },
];

const advantages = [
  {
    title: "Transparansi Biaya RAB",
    description: "Rincian spesifikasi material dan harga borongan kontraktor disusun jujur sejak awal, mencegah pembengkakan dana di tengah jalan.",
    icon: <FaClipboardList size={24} />,
  },
  {
    title: "Material Berstandar SNI",
    description: "Kami hanya menggunakan material bangunan berkualitas yang lolos uji kelayakan SNI resmi demi ketahanan bangunan jangka panjang.",
    icon: <FaShieldAlt size={24} />,
  },
  {
    title: "Tenaga Teknik Sipil Ahli",
    description: "Seluruh manajemen proyek dikawal langsung oleh tim engineer berpengalaman dan tukang bangunan terspesialisasi di bidangnya.",
    icon: <FaUsers size={24} />,
  },
];

export default async function JasaKontraktorPage() {
  const completedProjects = await getCompletedProjects();

  return (
    <main className="bg-white font-sans antialiased text-[#0F2340]">
      
      {/* ── 1. HERO SECTION (SEO KEYWORD HEAVY) ── */}
      <section className="relative min-h-[75vh] flex flex-col justify-end px-6 pb-20 pt-44 bg-[#0F2340] overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-cover bg-center" style={{ backgroundImage: `url('/images/heroabout.webp')` }} />
        <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-6 text-left">
            <span className="text-sm font-bold tracking-[0.3em] uppercase text-[#E87722]">KONTRAKTOR UTAMA // BEKASI & JABODETABEK</span>
            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight uppercase leading-[0.95]">
              JASA KONTRAKTOR <br />& KONSTRUKSI BANGUNAN
            </h1>
          </div>
          <div className="lg:col-span-4 text-left border-l border-white/20 pl-6 pb-2">
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              Mewujudkan proyek pembangunan hunian, gedung ruko komersial, hingga gudang industrial. Menjamin legalitas, transparansi budget, dan kekuatan struktural prima.
            </p>
            <nav className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-[#E87722] mt-6">
              <Link href="/">HOME</Link>
              <span className="text-white/20 select-none">/</span>
              <span>JASA KONTRAKTOR</span>
            </nav>
          </div>
        </div>
      </section>

      {/* ── 2. BRIEF EXPLANATION & KEYWORDS INTEGRATION ── */}
      <section className="mx-auto max-w-7xl px-6 py-32 border-b border-slate-100">
        <div className="grid gap-16 lg:grid-cols-12 items-start">
          <div className="lg:col-span-4 space-y-4">
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-[#E87722]">CV LISTIYA MANDIRI JAYA STEEL</span>
            <h2 className="text-4xl font-black tracking-tight text-[#0F2340] uppercase leading-none">
              KREDIBILITAS LIMAS KONTRAKTOR
            </h2>
          </div>

          <div className="lg:col-span-8 grid md:grid-cols-2 gap-10 text-sm md:text-base leading-relaxed text-slate-600 font-normal">
            <p>
              Sebagai penyedia <span className="font-semibold text-[#0F2340]">jasa kontraktor bangunan terpercaya</span>, Limas Kontraktor menerapkan standarisasi teknik sipil modern di setiap eksekusi lapangan. Kami mengerti bahwa bangunan yang kokoh berawal dari kalkulasi pembebanan besi beton yang akurat, pengawasan mandor yang disiplin, serta penggunaan material bersertifikasi SNI.
            </p>
            <p>
              Kami mengeliminasi risiko pembengkakan anggaran dengan menyusun draf RAB rumah secara komprehensif. Melalui sistem tata kelola proyek yang terukur, kami memastikan target *time schedule* serah terima kunci dapat tercapai tepat waktu dengan kualitas fisik bangunan yang memuaskan.
            </p>
          </div>
        </div>

        {/* ── 3. THREE VALUE ADVANTAGES ── */}
        <div className="grid gap-0 md:grid-cols-3 border-t border-slate-200 mt-24">
          {advantages.map((item, idx) => (
            <div key={item.title} className={`py-12 px-6 space-y-4 ${idx !== 2 ? 'md:border-r border-slate-200' : ''}`}>
              <div className="text-[#E87722]">{item.icon}</div>
              <h3 className="text-lg font-black uppercase tracking-tight text-[#0F2340]">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. CAKUPAN LAYANAN (SEO KEYWORDS SPESIFIK) ── */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div className="space-y-3">
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-[#E87722]">OUR CAPABILITIES</span>
            <h2 className="text-4xl font-black text-[#0F2340] uppercase tracking-tight">LAYANAN JASA KONSTRUKSI SURVEI</h2>
          </div>
        </div>

        <div className="grid gap-x-12 gap-y-16 md:grid-cols-2">
          {subLayanan.map((item) => (
            <div key={item.judul} className="group flex gap-6 items-start border-b border-slate-100 pb-10">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0F2340] text-white transition-colors group-hover:bg-[#E87722]">
                {item.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#0F2340] tracking-tight uppercase">{item.judul}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. PORTFOLIO DYNAMIC GRID ── */}
      <section className="py-32 bg-[#0F2340] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-[#E87722]">DOKUMENTASI PORTFOLIO</span>
          <h2 className="text-4xl font-black uppercase tracking-tight mt-2 text-white">PROYEK KONSTRUKSI YANG BERHASIL DISELESAIKAN</h2>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {completedProjects.map((project) => (
            <Link
              key={project.id}
              href={`/proyek/${project.slug}`}
              className="group relative aspect-[4/4.5] w-full overflow-hidden bg-neutral-900 block"
            >
              {project.coverImage ? (
                <img 
                  src={project.coverImage} 
                  alt={project.title} 
                  className="w-full h-full object-cover grayscale opacity-40 transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100" 
                />
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-500 text-sm font-mono">NO IMAGE</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
              
              <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold uppercase tracking-wider flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none">
                View
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1 z-10">
                <h3 className="font-bold text-base text-white tracking-tight leading-snug uppercase line-clamp-1">{project.title}</h3>
                {project.location && <p className="text-slate-400 text-sm tracking-wide truncate">{project.location}</p>}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 6. ALUR TAHAPAN KERJA ── */}
      <section className="max-w-7xl mx-auto px-6 py-32 border-b border-slate-100">
        <div className="max-w-3xl mb-24">
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-[#E87722]">MANAGEMENT SYSTEM</span>
          <h2 className="text-4xl font-black text-[#0F2340] uppercase tracking-tight mt-2">TAHAPAN PROSES KONTRAKTOR BORONGAN</h2>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {alurKerja.map((step) => (
            <div key={step.langkah} className="space-y-4 pt-6 border-t border-slate-200 relative">
              <div className="text-5xl font-black text-slate-200 tracking-tight font-mono absolute -top-8 left-0">{step.langkah}</div>
              <h3 className="text-lg font-bold text-[#0F2340] tracking-tight uppercase pt-2">{step.nama}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.deskripsi}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. TESTIMONIAL GLOBAL COMPONENT (MEMANGGIL KOMPONEN UTAMAMU) ── */}
      <TestimonialSection />


    </main>
  );
}