import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  ArrowRight,
  MapPin,
  User,
  Briefcase,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      projectTeams: {
        include: {
          teamEntry: true,
        },
      },
    },
  });

  if (!project) notFound();

  const relatedProjects = await prisma.project.findMany({
    where: {
      NOT: {
        slug,
      },
    },
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
  });

  const gallery = (project.gallery as string[]) || [];

  return (
    <div className="bg-white text-[#0F2340] overflow-hidden">

      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-end">
        <img
          src={project.coverImage || "/thumbnail.webp"}
          alt={project.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0F2340] via-[#0F2340]/60 to-[#0F2340]/20" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,119,34,0.25),transparent_40%)]" />

        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6 pb-20">

            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-5 py-2 text-xs font-black tracking-[0.25em] uppercase text-[#E87722]">
              Portfolio Proyek
            </span>

            <h1 className="mt-6 max-w-5xl text-5xl md:text-7xl font-black uppercase leading-[0.95] text-white">
              {project.title}
            </h1>

            <div className="mt-8 flex flex-wrap gap-3">

              {project.location && (
                <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 text-sm text-white">
                  <MapPin size={15} />
                  {project.location}
                </div>
              )}

              {project.client && (
                <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 text-sm text-white">
                  <User size={15} />
                  {project.client}
                </div>
              )}

              {project.limasRole && (
                <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 text-sm text-white">
                  <Briefcase size={15} />
                  {project.limasRole}
                </div>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* FLOATING STATS */}
      <section className="-mt-14 relative z-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white rounded-[16px] p-8 shadow-[0_20px_80px_rgba(15,35,64,0.12)]">

            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Status
              </p>
              <p className="font-black text-lg mt-2">
                {project.status}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Klien
              </p>
              <p className="font-black text-lg mt-2">
                {project.client || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Lokasi
              </p>
              <p className="font-black text-lg mt-2">
                {project.location || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Peran Kami
              </p>
              <p className="font-black text-lg mt-2">
                {project.limasRole || "-"}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-24">

        {/* GALLERY */}
        {gallery.length > 0 && (
          <div className="mb-28">

            <div className="mb-10">
              <span className="text-[#E87722] text-xs font-black tracking-[0.25em] uppercase">
                Dokumentasi Proyek
              </span>

              <h2 className="text-4xl md:text-5xl font-black uppercase mt-3">
                Galeri Pekerjaan
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

              {gallery[0] && (
                <div className="lg:col-span-3">
                  <img
                    src={gallery[0]}
                    alt=""
                    className="h-[650px] w-full object-cover rounded-[32px]"
                  />
                </div>
              )}

              <div className="grid gap-4">
                {gallery.slice(1, 4).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className="h-[206px] w-full object-cover rounded-[24px]"
                  />
                ))}
              </div>

            </div>

          </div>
        )}

        {/* PROJECT STORY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-28">

          <div className="lg:col-span-8">

            <span className="text-[#E87722] text-xs font-black tracking-[0.25em] uppercase">
              Project Story
            </span>

            <h2 className="mt-3 text-4xl md:text-5xl font-black uppercase">
              Tentang Proyek
            </h2>

            <div className="mt-8 text-lg leading-relaxed text-slate-600 whitespace-pre-line">
              {project.description}
            </div>

          </div>

          <div className="lg:col-span-4">

            <div className="sticky top-28 bg-white border border-slate-200 rounded-[16px] p-8 shadow-lg">

              <h3 className="font-black uppercase text-xl">
                Informasi Proyek
              </h3>

              <div className="mt-8 space-y-6">

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">
                    Lokasi
                  </p>
                  <p className="font-bold mt-1">
                    {project.location || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">
                    Klien
                  </p>
                  <p className="font-bold mt-1">
                    {project.client || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">
                    Status
                  </p>
                  <p className="font-bold mt-1">
                    {project.status}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">
                    Peran Kami
                  </p>
                  <p className="font-bold mt-1">
                    {project.limasRole || "-"}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* TEAM */}
        {project.projectTeams.length > 0 && (
          <section className="mb-28">

            <div className="mb-10">
              <span className="text-[#E87722] text-xs font-black tracking-[0.25em] uppercase">
                Tim Profesional
              </span>

              <h2 className="text-4xl font-black uppercase mt-3">
                Orang Dibalik Proyek
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {project.projectTeams.map((pt) => (
                <div
                  key={pt.teamId}
                  className="rounded-[28px] border border-slate-200 p-6 bg-gradient-to-br from-white to-slate-50 hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={pt.teamEntry.avatar || "/avatar.png"}
                    alt={pt.teamEntry.name}
                    className="w-24 h-24 rounded-full object-cover border border-slate-200"
                  />

                  <h3 className="mt-5 font-black text-lg">
                    {pt.teamEntry.name}
                  </h3>

                  <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-[#E87722] font-bold">
                    {pt.role || pt.teamEntry.position}
                  </p>
                </div>
              ))}

            </div>

          </section>
        )}

        {/* CTA */}
        <section className="mb-28">

          <div className="relative overflow-hidden rounded-[40px] bg-[#0F2340] p-10 md:p-16">

            <div className="absolute top-0 right-0 h-full w-[400px] bg-[#E87722]/10 blur-[120px]" />

            <div className="relative z-10 max-w-3xl">

              <span className="text-[#E87722] text-xs font-black uppercase tracking-[0.25em]">
                Konsultasi
              </span>

              <h2 className="mt-4 text-4xl md:text-5xl font-black uppercase text-white">
                Punya Rencana Membangun Proyek Serupa?
              </h2>

              <p className="mt-5 text-white/70 text-lg">
                Diskusikan kebutuhan proyek Anda bersama tim profesional kami.
              </p>

              <div className="mt-8">
                <Button
                  href="/kontak"
                  variant="primary"
                  size="lg"
                  className="gap-2"
                >
                  Konsultasi Sekarang
                  <ArrowRight size={18} />
                </Button>
              </div>

            </div>

          </div>

        </section>

        {/* RELATED PROJECT */}
        <section>

          <div className="mb-10">
            <span className="text-[#E87722] text-xs font-black tracking-[0.25em] uppercase">
              Portfolio Lainnya
            </span>

            <h2 className="text-4xl font-black uppercase mt-3">
              Proyek Terkait
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {relatedProjects.map((proj) => (
              <Link
                key={proj.id}
                href={`/portfolio/${proj.slug}`}
                className="group relative overflow-hidden rounded-[28px] h-[420px]"
              >
                <img
                  src={proj.coverImage || "/placeholder.jpg"}
                  alt={proj.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute bottom-0 p-6 text-white">

                  <p className="text-[11px] uppercase tracking-[0.25em] text-[#E87722] font-bold">
                    {proj.status}
                  </p>

                  <h3 className="mt-2 text-xl font-black uppercase">
                    {proj.title}
                  </h3>

                </div>
              </Link>
            ))}

          </div>

        </section>

        {/* BACK BUTTON */}
        <div className="text-center mt-20">
          <Button
            href="/portfolio"
            variant="primary"
            size="lg"
          >
            Lihat Semua Portfolio
          </Button>
        </div>

      </section>

    </div>
  );
}