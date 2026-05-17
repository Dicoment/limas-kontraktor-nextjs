import { z } from "zod"

export const tagSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  slug: z.string().min(2, "Slug minimal 2 karakter").regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip"),
})

export const tagUpdateSchema = tagSchema.partial()

export type TagInput = z.infer<typeof tagSchema>
export type TagUpdateInput = z.infer<typeof tagUpdateSchema>