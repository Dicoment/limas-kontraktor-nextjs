import { z } from "zod"

export const pageSchema = z.object({
  title: z.string()
    .min(3, "Title minimal 3 karakter")
    .max(200, "Title maksimal 200 karakter"),
  slug: z.string()
    .min(2, "Slug minimal 2 karakter")
    .max(100, "Slug maksimal 100 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip"),
  content: z.string()
    .min(10, "Konten minimal 10 karakter")
    .max(100000, "Konten maksimal 100.000 karakter"),
  seoTitle: z.string()
    .max(60, "SEO title maksimal 60 karakter")
    .optional()
    .nullable(),
  seoDescription: z.string()
    .max(160, "SEO description maksimal 160 karakter")
    .optional()
    .nullable(),
  published: z.boolean().default(false),
})

export const pageUpdateSchema = pageSchema.partial()

export type PageInput = z.infer<typeof pageSchema>
export type PageUpdateInput = z.infer<typeof pageUpdateSchema>