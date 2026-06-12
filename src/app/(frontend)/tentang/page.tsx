import type { Metadata } from "next";
import { ArrowRight, Award, Building2, CheckCircle2, Clock, FileCheck, MapPin, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami | Limas Kontraktor",
  description: "Kontraktor terpercaya di Bekasi dan Jabodetabek untuk pembangunan, renovasi, dan desain bangunan.",
};

const stats = [
  { value: "10+", label: "Tahun Pengalaman" },
  { value: "150+", label: "Proyek Selesai" },
  { value: "100+", label: "Klien Puas" },
  { value: "5+", label: "Kota Layanan" },
];

const advantages = [
  "Transparansi RAB",
  "Material Standar SNI",
  "Tim Profesional",
  "Pengerjaan Tepat Waktu",
  "Pengawasan Ketat",
  "Garansi Pekerjaan",
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="relative min-h-[100svh] lg:min-h-[90vh] overflow-hidden">

  <img
    src="/heroabout.webp"
    alt="Tentang Kami"
    className="absolute inset-0 h-full w-full object-cover"
  />

  <div className="absolute inset-0 bg-[#0F2340]/80" />

  <div className="relative z-10 mx-auto flex min-h-[100svh] lg:min-h-[90vh] max-w-7xl items-center px-6">

    <div className="max-w-3xl">

      <span className="inline-flex rounded-full bg-[#E87722]/20 px-4 py-2 text-xs sm:text-sm font-semibold text-[#E87722]">
        Tentang Limas Kontraktor
      </span>

      <h1
        className="
          mt-5
          text-[42px]
          sm:text-5xl
          lg:text-7xl
          font-bold
          leading-[1.05]
          tracking-tight
          text-white
        "
      >
        Membangun Kepercayaan
        Melalui Kualitas
        Konstruksi
      </h1>

      <p
        className="
          mt-6
          max-w-xl
          text-base
          sm:text-lg
          leading-8
          text-slate-200
        "
      >
        Lebih dari satu dekade membantu mewujudkan hunian,
        bangunan komersial, renovasi, dan proyek konstruksi
        berkualitas di wilayah Jabodetabek.
      </p>

    </div>

  </div>

</section>
<section className="relative z-20 mt-0 lg:-mt-16 px-6">
  <div className="mx-auto max-w-6xl rounded-3xl bg-white shadow-2xl">
    <div className="grid grid-cols-2 lg:grid-cols-4">

      {stats.map((item) => (
        <div
          key={item.label}
          className="
            p-6
            sm:p-8
            text-center
            border-b
            lg:border-b-0
            lg:border-r
            border-slate-100
            last:border-r-0
          "
        >
          <div className="text-3xl sm:text-4xl font-bold text-[#0F2340]">
            {item.value}
          </div>

          <div className="mt-2 text-sm text-slate-500">
            {item.label}
          </div>
        </div>
      ))}

    </div>
  </div>
</section>
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-semibold uppercase tracking-widest text-[#E87722]">Tentang Perusahaan</p>
            <h2 className="mt-4 text-4xl font-bold text-[#0F2340] md:text-5xl">
              CV Listiya Mandiri Jaya Steel
            </h2>

            <p className="mt-8 text-slate-600 leading-8">
              LIMAS KONTRAKTOR merupakan brand dari CV Listiya Mandiri Jaya Steel yang
              bergerak di bidang jasa desain, renovasi, dan konstruksi bangunan.
            </p>

            <p className="mt-6 text-slate-600 leading-8">
              Kami menghadirkan proses kerja yang transparan, penggunaan material
              berkualitas, serta pengawasan proyek yang terukur untuk memastikan hasil
              terbaik bagi setiap klien.
            </p>

            <div className="mt-8 flex gap-3 rounded-2xl bg-slate-50 p-5">
              <MapPin className="text-[#E87722]" />
              <p className="text-sm text-slate-600">
                Bekasi, Jawa Barat - Melayani seluruh wilayah Jabodetabek dan Seluruh Indonesia.
              </p>
            </div>
          </div>

          <div className="relative">
            <img
              src="/heroproyek.webp"
              alt="Project"
              className="rounded-3xl shadow-xl"
            />

            <div className="absolute bottom-2 left-2 rounded-2xl bg-white p-6 shadow-xl">
              <div className="text-4xl font-bold text-[#E87722]">150+</div>
              <div className="text-slate-500">Proyek Diselesaikan</div>
            </div>
          </div>
        </div>
      </section>
<section className="relative overflow-hidden bg-[#0F2340] py-28 lg:py-36">
  {/* Accent */}
  <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#E87722]/10 blur-3xl" />
  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl" />

  <div className="relative z-10 mx-auto max-w-7xl px-6">

    {/* Header */}
    <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">

      <div>
        <span className="inline-flex items-center rounded-full border border-[#E87722]/30 bg-[#E87722]/10 px-4 py-2 text-sm font-semibold tracking-wider text-[#E87722] uppercase">
          Komitmen Kami
        </span>

        <h2 className="mt-8 text-4xl md:text-5xl font-bold text-white leading-[1.05] tracking-tight">
          Setiap Proyek
          <br />
          Dikerjakan Dengan
          <br />
          Standar Profesional.
        </h2>
      </div>

      <div>
        <p className="text-md leading-9 text-gray-200">
          Kami percaya bahwa bangunan yang baik bukan hanya berdiri kokoh,
          tetapi juga dibangun melalui proses yang transparan, terukur,
          dan dapat dipertanggungjawabkan. Karena itu setiap proyek kami
          dikerjakan dengan pengawasan ketat, material berkualitas,
          serta komitmen penuh terhadap waktu pengerjaan.
        </p>
      </div>

    </div>

    {/* Cards */}
    <div className="grid gap-6 md:grid-cols-3">

      <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl transition-all duration-300 hover:border-[#E87722]/40 hover:bg-white/[0.08]">

        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E87722]/15">
          <FileCheck
            size={32}
            className="text-[#E87722]"
          />
        </div>

        <div className="mb-4 text-2xl font-bold text-white">
          Transparansi Penuh
        </div>

        <p className="leading-8 text-gray-200">
          Seluruh proses perencanaan dan RAB disusun secara detail sehingga
          klien memahami setiap tahapan pekerjaan dan biaya yang dikeluarkan.
        </p>

      </div>

      <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl transition-all duration-300 hover:border-[#E87722]/40 hover:bg-white/[0.08]">

        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E87722]/15">
          <Clock
            size={32}
            className="text-[#E87722]"
          />
        </div>

        <div className="mb-4 text-2xl font-bold text-white">
          Tepat Waktu
        </div>

        <p className="leading-8 text-gray-200">
          Dengan sistem monitoring yang terstruktur, setiap proyek berjalan
          sesuai timeline yang telah disepakati sejak awal.
        </p>

      </div>

      <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl transition-all duration-300 hover:border-[#E87722]/40 hover:bg-white/[0.08]">

        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E87722]/15">
          <Shield
            size={32}
            className="text-[#E87722]"
          />
        </div>

        <div className="mb-4 text-2xl font-bold text-white">
          Kualitas Terjamin
        </div>

        <p className="leading-8 text-gray-200">
          Menggunakan material pilihan dan tenaga ahli berpengalaman untuk
          menghasilkan bangunan yang kuat, aman, dan bernilai jangka panjang.
        </p>

      </div>

    </div>

  </div>
</section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <p className="font-semibold uppercase tracking-widest text-[#E87722]">Keunggulan</p>
          <h2 className="mt-4 text-4xl font-bold text-[#0F2340]">Mengapa Memilih Kami</h2>
        </div>

        <div className="mt-16 space-y-6">
          {advantages.map((item, i) => (
            <div key={item} className="flex items-center gap-8 border-b pb-6">
              <div className="text-5xl font-bold text-[#E87722]/25">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="text-xl font-semibold text-[#0F2340]">{item}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-4xl font-bold text-[#0F2340]">Project Showcase</h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[1,2,3,4].map((item)=>(
              <div key={item} className="overflow-hidden rounded-3xl bg-white shadow-lg">
                <img src={`/project-${item}.jpg`} alt="" className="h-72 w-full object-cover" />
                <div className="p-6">
                  <h3 className="font-bold text-[#0F2340]">Project #{item}</h3>
                  <p className="mt-2 text-slate-500">Deskripsi singkat proyek.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl rounded-[32px] bg-[#0F2340] p-12 text-center">
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Siap Membangun Proyek Anda?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-white/70">
            Konsultasikan kebutuhan pembangunan atau renovasi Anda bersama tim kami.
          </p>

          <a
            href="https://wa.me/6282320721150"
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#E87722] px-8 py-4 font-semibold text-white"
          >
            Konsultasi Gratis
            <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}
