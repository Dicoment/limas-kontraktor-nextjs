import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import TestimonialSection from "@/components/sections/home/TestimonialSection";
import PortfolioSection from "@/components/sections/services/PortfolioSection";
import FaqSection from "@/components/sections/home/FaqSection";
import ProjectGalleryLightbox from "@/components/ui/ProjectGalleryLightbox";

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

  const completedProjects = await prisma.project.findMany({
    where: {
      NOT: { slug },
    },
    take: 6,
    orderBy: {
      createdAt: "desc",
    },
  });

  const gallery: string[] = Array.isArray(project.gallery)
    ? (project.gallery as string[])
    : typeof project.gallery === "string"
    ? (() => {
        try {
          const parsed = JSON.parse(project.gallery as string);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      })()
    : [];

  const restGallery = gallery.slice(1);

  return (
    <div className="bg-white text-[#111111] min-h-screen font-sans tracking-tight">

      {/* 1. HERO FULL SCREEN */}
      <div className="relative w-full h-[70vh] sm:h-[75vh] min-h-[480px] overflow-hidden bg-slate-900">
        <img
          src={project.coverImage || "/thumbnail.webp"}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient gelap di atas biar navbar transparan tetap terbaca */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />
      </div>

      {/* CONTAINER UTAMA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 2. TITLE & METADATA BAR */}
        <div className="py-8 sm:py-12 border-b border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#111111] tracking-tight">
              {project.title}
            </h1>
          </div>

          <div className="md:col-span-6 flex flex-wrap justify-between md:justify-end gap-6 sm:gap-8 text-xs sm:text-sm text-[#111111]">
            <div>
              <p className="text-slate-400 font-light mb-1">Klien</p>
              <p className="font-medium">{project.client || "-"}</p>
            </div>
            <div>
              <p className="text-slate-400 font-light mb-1">Location</p>
              <p className="font-medium">{project.location || "-"}</p>
            </div>
            <div>
              <p className="text-slate-400 font-light mb-1">Status</p>
              <p className="font-medium flex items-center gap-1.5 uppercase">
                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                {project.status}
              </p>
            </div>
          </div>
        </div>

        {/*
          3. KONTEN GAMBAR & DESKRIPSI
          Mobile (flex-col): Gambar Utama -> Galeri -> Deskripsi (seperti online shop)
          Desktop (md:grid): Deskripsi (kiri) | Gambar Utama (kanan) -- baris pertama
                              Galeri (full width) -- baris kedua
          w-full wajib di tiap child supaya tidak menyusut mengikuti konten saat flex-col (mobile)
        */}
        <div className="py-12 sm:py-16 flex flex-col md:grid md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Gambar Utama */}
          <div className="order-1 md:order-2 w-full md:col-span-7">
            <div className="w-full aspect-[4/3] bg-slate-100 overflow-hidden">
              <img
                src={gallery[0] || project.coverImage || "/thumbnail.webp"}
                alt="Featured Detail"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Galeri Slider (sisa gambar) */}
          {restGallery.length > 0 && (
            <div className="order-2 md:order-3 w-full md:col-span-12">
              <ProjectGalleryLightbox images={restGallery} />
            </div>
          )}

          {/* Deskripsi */}
          <div className="order-3 md:order-1 w-full md:col-span-5 md:row-start-1 pr-0 md:pr-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 md:hidden">Deskripsi</p>
            <div
              className="prose prose-slate max-w-none text-slate-600 font-light text-sm sm:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: project.description || "" }}
            />
          </div>

        </div>
      </div>

      {/* 4. GLOBAL SECTIONS */}
      <div className="border-t border-slate-200 pt-12">
        <PortfolioSection
          projects={completedProjects}
          buttonText="LIHAT SEMUA PORTOFOLIO"
          buttonHref="/proyek"
        />

        <TestimonialSection />

        <FaqSection />
      </div>
    </div>
  );
}