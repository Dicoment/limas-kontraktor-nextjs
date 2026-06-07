import { z } from "zod"

export const tagSchema = z.object({
  name: z.string()
    .min(2, "Nama minimal 2 karakter")
    .max(50, "Nama maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9\s\-]+$/, "Nama hanya boleh huruf, angka, spasi, dan strip"),
  slug: z.string()
    .min(2, "Slug minimal 2 karakter")
    .max(50, "Slug maksimal 50 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip"),
})

export const tagUpdateSchema = tagSchema.partial()

export type TagInput = z.infer<typeof tagSchema>
export type TagUpdateInput = z.infer<typeof tagUpdateSchema>