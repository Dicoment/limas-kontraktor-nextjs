import { z } from "zod"

export const projectStatusEnum = z.enum(["DRAFT", "ONGOING", "COMPLETED"])

export const projectSchema = z.object({
  title: z.string().min(3, "Title minimal 3 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter").regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  location: z.string().optional().nullable(),
  client: z.string().optional().nullable(),
  limasRole: z.string().optional().nullable(),
  coverImage: z.string().url("URL gambar tidak valid").optional().nullable().or(z.literal("")),
  gallery: z.array(z.string().url()).optional().default([]),
  status: projectStatusEnum.default("DRAFT"),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  categoryIds: z.array(z.string()).optional().default([]),
  teamIds: z.array(z.object({ teamId: z.string(), role: z.string().optional() })).optional().default([]),
})

export const projectUpdateSchema = projectSchema.partial()

export type ProjectInput = z.infer<typeof projectSchema>
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>