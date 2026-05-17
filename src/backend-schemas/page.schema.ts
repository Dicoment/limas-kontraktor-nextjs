import { z } from "zod"

export const pageSchema = z.object({
  title: z.string().min(3, "Title minimal 3 karakter"),
  slug: z.string().min(2, "Slug minimal 2 karakter").regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  published: z.boolean().default(false),
})

export const pageUpdateSchema = pageSchema.partial()

export type PageInput = z.infer<typeof pageSchema>
export type PageUpdateInput = z.infer<typeof pageUpdateSchema>