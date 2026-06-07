import { z } from "zod"

export const blogPostSchema = z.object({
  title: z.string().min(3, "Title minimal 3 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter").regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  excerpt: z.string().optional().nullable(),
  coverImage: z.string().url("URL gambar tidak valid").optional().nullable().or(z.literal("")),
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