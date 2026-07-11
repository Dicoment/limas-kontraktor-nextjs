import { z } from "zod"

// FIX: sebelumnya `.url()` doang, yang mewajibkan URL absolut (http://...).
// Padahal endpoint upload di route.ts sendiri nyimpen & balikin PATH RELATIF
// (`/uploads/xxxx.jpg`), bukan URL absolut. Jadi begitu user pasang cover
// image lewat MediaPicker, validasi ini bakal nolak path yang justru valid
// menurut cara kerja sistem upload kalian sendiri.
// Sekarang terima: string kosong, ATAU path yang diawali "/", ATAU URL
// absolut http(s) — 3 kemungkinan valid yang sama kayak validateGallery()
// di project-helpers.ts.
const coverImageField = z
  .string()
  .refine(
    (val) => val === "" || val.startsWith("/") || /^https?:\/\//.test(val),
    "URL gambar tidak valid — harus path relatif (diawali /) atau URL absolut (http/https)"
  )
  .optional()
  .nullable()

export const blogPostSchema = z.object({
  title: z.string().min(3, "Title minimal 3 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter").regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  excerpt: z.string().optional().nullable(),
  coverImage: coverImageField,
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  published: z.boolean().default(false),
  publishedAt: z.string().datetime({ offset: true }).optional().nullable(),
  categoryIds: z.array(z.string().cuid()).optional().default([]),
  tagIds: z.array(z.string().cuid()).optional().default([]),
})

export const blogPostUpdateSchema = blogPostSchema.partial()

export type BlogPostInput = z.infer<typeof blogPostSchema>
export type BlogPostUpdateInput = z.infer<typeof blogPostUpdateSchema>