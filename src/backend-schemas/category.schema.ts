import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  slug: z.string().min(2, "Slug minimal 2 karakter").regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip"),
  type: z.enum(["blog", "project"], { message: "Tipe harus 'blog' atau 'project'" }),
  description: z.string().optional().nullable(),
})

export const categoryUpdateSchema = categorySchema.partial()

export type CategoryInput = z.infer<typeof categorySchema>
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>