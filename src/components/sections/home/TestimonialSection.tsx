// src/components/sections/TestimonialSection.tsx
import prisma from "@/lib/prisma"; 
import TestimonialClient, { TestimonialWithProject } from "./TestimonialClient"; 
import { TestimonialPlatform } from "@prisma/client";

export default async function TestimonialSection() {
  // Ambil data asli database
  const testimonialData = await prisma.testimonial.findMany({
    where: {
      published: true, 
      platform: TestimonialPlatform.SOCIAL_MEDIA, 
      sourceUrl: { not: null }, 
    },
    orderBy: {
      createdAt: "desc", 
    },
    include: {
      project: {
        select: {
          title: true, // Ambil judul proyek terkait
        },
      },
    },
  });

  // Format data
  const formattedTestimonials: TestimonialWithProject[] = testimonialData.map((testi) => ({
    id: testi.id,
    clientName: testi.clientName,
    content: testi.content,
    rating: testi.rating,
    sourceUrl: testi.sourceUrl,
    avatar: testi.avatar,
    projectTitle: testi.project?.title || "Proyek Selesai",
  }));

  if (formattedTestimonials.length === 0) {
    return null;
  }

  // Oper data ke Client Component
  return <TestimonialClient testimonials={formattedTestimonials} />;
}