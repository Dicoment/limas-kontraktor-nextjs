import { z } from "zod"

export const testimonialPlatformEnum = z.enum(["MANUAL", "SOCIAL_MEDIA"])

export const testimonialSchema = z.object({
  clientName: z.string()
    .min(2, "Nama klien minimal 2 karakter")
    .max(100, "Nama klien maksimal 100 karakter"),
  content: z.string()
    .min(10, "Konten testimoni minimal 10 karakter")
    .max(5000, "Konten testimoni maksimal 5000 karakter"),
  rating: z.number()
    .int("Rating harus berupa bilangan bulat")
    .min(1, "Rating minimal 1")
    .max(5, "Rating maksimal 5")
    .optional()
    .nullable(),
  platform: testimonialPlatformEnum.default("MANUAL"),
  sourceUrl: z.string()
    .url("URL tidak valid")
    .max(500, "URL maksimal 500 karakter")
    .optional()
    .nullable()
    .or(z.literal("")),
  avatar: z.string()
    .url("URL avatar tidak valid")
    .max(500, "URL avatar maksimal 500 karakter")
    .optional()
    .nullable()
    .or(z.literal("")),
  published: z.boolean().default(false),
  projectId: z.string()
    .cuid("Format project ID tidak valid")
    .optional()
    .nullable(),
})

export const testimonialUpdateSchema = testimonialSchema.partial()

export type TestimonialInput = z.infer<typeof testimonialSchema>
export type TestimonialUpdateInput = z.infer<typeof testimonialUpdateSchema>