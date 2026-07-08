import type { Metadata } from "next";
import db from "@/lib/prisma";
import Link from "next/link";
import { IoArrowForwardSharp } from "react-icons/io5";
import { FaClipboardList, FaRegCheckCircle, FaUsers, FaRegClock, FaRegEye, FaWrench, FaFileContract, FaMapMarkerAlt, FaShieldAlt } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Tentang Kami | Limas Kontraktor",
  description: "Kontraktor terpercaya di Bekasi and Jabodetabek untuk pembangunan, renovasi, dan desain bangunan.",
};

async function getProjects() {
  const projects = await db.project.findMany({
    where: { status: "COMPLETED" }, 
    take: 4,
    orderBy: { createdAt: "desc" },
  });
  return projects;
}

const stats = [
  { value: "10+", label: "Tahun Pengalaman" },
  { value: "150+", label: "Proyek Selesai" },
  { value: "100+", label: "Klien Puas" },
  { value: "5+", label: "Kota Layanan" },
];

const advantages = [
  {
    title: "Transparansi RAB",
    description: "Estimasi biaya yang detail, jujur, dan tanpa biaya tersembunyi.",
    icon: <FaClipboardList size={24} />,
  },
  {
    title: "Material Standar SNI",
    description: "Kami hanya menggunakan material berkualitas yang tersertifikasi SNI.",
    icon: <FaShieldAlt size={24} />,
  },
  {
    title: "Tim Profesional",
    description: "Dikerjakan oleh tenaga ahli berpengalaman di bidang konstruksi.",
    icon: <FaUsers size={24} />,
  },
  {
    title: "Pengerjaan Tepat Waktu",
    description: "Manajemen proyek yang disiplin untuk memastikan target selesai tepat waktu.",
    icon: <FaRegClock size={24} />,
  },
  {
    title: "Pengawasan Ketat",
    description: "Kontrol kualitas di setiap tahapan pengerjaan untuk hasil maksimal.",
    icon: <FaRegEye size={24} />,
  },
  {
    title: "Garansi Pekerjaan",
    description: "Memberikan ketenangan pikiran dengan garansi atas hasil pengerjaan kami.",
    icon: <FaWrench size={24} />,
  },
];

export default async function AboutPage() {
  const projects = await getProjects();
  
  return (
    <main className="bg-white font-sans antialiased text-[#0F2340]">
      
      {/* ── 1. HERO SECTION ── */}
      <section className="relative min-h-[60vh] flex flex-col justify-center px-6 pt-36 pb-20 overflow-hidden">
        <img
          src="/images/heroabout.webp"
          alt="Tentang Kami"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0F2340]/85" />
        <div className="absolute top-8 right-16 w-40 h-40 rounded-full border border-white/10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full border border-white/10 -translate-x-1/2 translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center w-full relative z-10">
          <p className="text-xs font-bold tracking-widest uppercase text-[#E87722] mb-3">Tentang Perusahaan</p>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-5 max-w-4xl leading-[1.15] uppercase">
            Membangun Kepercayaan Melalui Kualitas Konstruksi
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-xl leading-relaxed mb-8">
            Lebih dari satu dekade membantu mewujudkan hunian, bangunan komersial, renovasi, dan proyek konstruksi berkualitas di wilayah Jabodetabek.
          </p>

          {/* Breadcrumb Nav */}
          <nav className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-white/60">
            <Link href="/" className="hover:text-[#E87722] transition-colors">Beranda</Link>
            <span className="text-white/30 text-xs select-none">/</span>
            <span className="text-[#E87722] select-none">Tentang Kami</span>
          </nav>
        </div>
      </section>

      {/* ── 2. FLOATING COUNTER STATS (BALIK MELAYANG DI SINI) ── */}
      <section className="relative z-20 -mt-12 px-6">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-slate-100">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="p-6 sm:p-8 text-center border-b lg:border-b-0 lg:border-r border-slate-100 last:border-r-0"
              >
                <div className="text-3xl sm:text-4xl font-black text-[#0F2340] tracking-tight">
                  {item.value}
                </div>
                <div className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. PROFILE COMPANY (ABOUT SECTION) ── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Sisi Konten Teks */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#E87722]" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500">PROFILE COMPANY</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#0F2340] leading-tight">
              CV Listiya Mandiri Jaya Steel
            </h2>

            <div className="w-12 h-[2px] bg-[#E87722]" />

            <div className="space-y-4 text-slate-600 text-xs md:text-sm leading-relaxed font-normal max-w-2xl">
              <p>
                <span className="font-semibold text-[#0F2340]">LIMAS KONTRAKTOR</span> merupakan brand resmi dari CV Listiya Mandiri Jaya Steel yang bergerak profesional di bidang jasa desain arsitektur, renovasi struktur, dan konstruksi fisik bangunan.
              </p>
              <p>
                Kami menghadirkan manajemen proyek dan proses kerja nyata yang transparan, penggunaan material berkualitas tinggi, serta pengawasan ketat di setiap tahapan pengerjaan untuk memastikan ketepatan struktur bagi kenyamanan jangka panjang setiap klien kami.
              </p>
            </div>

            {/* Lokasi Service */}
            <div className="flex gap-3 pt-4 items-start text-[#0F2340]">
              <FaMapMarkerAlt size={16} className="text-[#E87722] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-medium leading-relaxed max-w-md">
                Bekasi, Jawa Barat — Melayani pengerjaan proyek menyeluruh di area Jabodetabek serta wilayah strategis lainnya di Seluruh Indonesia.
              </p>
            </div>
          </div>

          {/* Sisi Kanan Visual Image */}
          <div className="lg:col-span-5 relative w-full">
            <div className="w-full rounded-2xl overflow-hidden aspect-[4/3.2] lg:aspect-[4/4.5] shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-white relative group">
              <img
                src="/images/heroproyek.webp"
                alt="Project Konstruksi Realisasi Lapangan"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>
            
            {/* Minimal Badge */}
            <div className="absolute -bottom-4 right-4 bg-[#E87722] text-white rounded-xl px-5 py-3.5 shadow-lg shadow-black/5">
              <p className="text-3xl font-black tracking-tight leading-none">150+</p>
              <p className="text-xs font-bold tracking-widest uppercase mt-1">Proyek Diselesaikan</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. BRAND COMMITMENT (DARK SECTION) ── */}
      <section className="relative overflow-hidden bg-[#0F2340] py-24 lg:py-32">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#E87722]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16">
            <div className="space-y-4">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#E87722] animate-pulse" />
                <span className="text-[#E87722] text-xs font-bold tracking-[0.2em] uppercase">KOMITMEN KAMI</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tight">
                Setiap Proyek Dikerjakan Dengan Standar Profesional
              </h2>
            </div>
            <div>
              <p className="text-gray-300 text-xs md:text-sm leading-8 font-light lg:pt-6">
                Kami percaya bahwa bangunan yang baik bukan hanya berdiri kokoh, tetapi juga dibangun melalui proses perencanaan yang transparan, terukur, dan dapat dipertanggungjawabkan secara teknis struktural. Karena itu, setiap proyek kami kawal ketat menggunakan material pilihan, pekerja terampil, serta komitmen penuh terhadap tenggat waktu.
              </p>
            </div>
          </div>

          {/* Cards Row */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition-all duration-300 hover:border-[#E87722]/40 hover:bg-white/[0.06]">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#E87722]/15 text-[#E87722]">
                <FaFileContract size={24} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white tracking-tight">Transparansi Penuh</h3>
              <div className="w-full h-[1px] bg-white/10 my-3" />
              <p className="text-gray-200/90 text-xs md:text-sm leading-relaxed font-light">
                Seluruh proses perencanaan dan spesifikasi volume RAB disusun secara detail agar Anda memahami secara pasti pemakaian biaya sejak awal.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition-all duration-300 hover:border-[#E87722]/40 hover:bg-white/[0.06]">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#E87722]/15 text-[#E87722]">
                <FaRegClock size={24} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white tracking-tight">Tepat Waktu</h3>
              <div className="w-full h-[1px] bg-white/10 my-3" />
              <p className="text-gray-200/90 text-xs md:text-sm leading-relaxed font-light">
                Didukung manajemen penjadwalan kerja (Time Schedule) yang disiplin dan berkala untuk memastikan serah terima kunci tepat waktu sesuai kesepakatan tertulis.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition-all duration-300 hover:border-[#E87722]/40 hover:bg-white/[0.06]">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#E87722]/15 text-[#E87722]">
                <FaShieldAlt size={24} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white tracking-tight">Kualitas Terjamin</h3>
              <div className="w-full h-[1px] bg-white/10 my-3" />
              <p className="text-gray-200/90 text-xs md:text-sm leading-relaxed font-light">
                Kombinasi material berstandar SNI dan pengawasan ketat mandor teknis lapangan demi menciptakan bangunan kokoh, presisi, dan bergaransi resmi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. ADVANTAGES SECTION ── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-left max-w-3xl mb-16 flex flex-col items-start">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="w-1.5 h-1.5 bg-[#E87722]" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500">OUR ADVANTAGES</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#0F2340] leading-[1.2]">
            Mengapa Memilih Kami
          </h2>
           
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((item) => (
            <div 
              key={item.title} 
              className="group rounded-2xl bg-white p-6 flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.02)] transition-all duration-300 border border-transparent hover:shadow-[0_10px_35px_rgba(0,0,0,0.06)]"
            >
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-[#0F2340] transition-colors group-hover:bg-[#E87722] group-hover:text-white">
                  {item.icon}
                </div>
                <h3 className="text-[18px] font-bold text-[#0F2340] tracking-tight">{item.title}</h3>
                <div className="w-full h-[1px] bg-gray-100" />
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-normal">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. COMPLETED PROJECTS (GRID OVERLAY VIEW) ── */}
      <section className="py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-left max-w-3xl mb-16 flex flex-col items-start">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="w-1.5 h-1.5 bg-[#E87722]" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500">PORTFOLIO</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#0F2340] leading-[1.2]">
              Hasil Kami Dalam Konstruksi
            </h2>
             
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/proyek/${project.slug}`}
                className="group relative aspect-[4/4.5] w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-md block"
              >
                {project.coverImage ? (
                  <img 
                    src={project.coverImage} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-105" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-neutral-500 text-xs font-mono">
                    NO IMAGE AVAILABLE
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5 opacity-100 transition-opacity duration-300" />

                <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out pointer-events-none select-none">
                  View
                </div>

                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black text-white flex items-center justify-center border border-white/5 transition-colors duration-300 group-hover:bg-white group-hover:text-black">
                  <IoArrowForwardSharp size={14} className="transform -rotate-45" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1 z-10">
                  <h3 className="font-bold text-[17px] text-white tracking-tight leading-snug line-clamp-1">
                    {project.title}
                  </h3>
                  {project.location && (
                    <p className="text-gray-300/90 text-xs font-light tracking-wide truncate">
                      {project.location}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}