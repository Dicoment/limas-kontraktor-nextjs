import { z } from "zod"

export const testimonialPlatformEnum = z.enum(["MANUAL", "SOCIAL_MEDIA"])

export const testimonialSchema = z.object({
  clientName: z.string().min(2, "Nama klien minimal 2 karakter"),
  content: z.string().min(10, "Konten testimoni minimal 10 karakter"),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  platform: testimonialPlatformEnum.default("MANUAL"),
  sourceUrl: z.string().url("URL tidak valid").optional().nullable().or(z.literal("")),
  avatar: z.string().url("URL avatar tidak valid").optional().nullable().or(z.literal("")),
  published: z.boolean().default(false),
  projectId: z.string().optional().nullable(),
})

export const testimonialUpdateSchema = testimonialSchema.partial()

export type TestimonialInput = z.infer<typeof testimonialSchema>
export type TestimonialUpdateInput = z.infer<typeof testimonialUpdateSchema>