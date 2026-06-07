import { z } from "zod"

export const categorySchema = z.object({
  name: z.string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  slug: z.string()
    .min(2, "Slug minimal 2 karakter")
    .max(100, "Slug maksimal 100 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip"),
  type: z.union([z.literal("blog"), z.literal("project")]),
  description: z.string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional()
    .nullable(),
})

export const categoryUpdateSchema = categorySchema.partial()

export type CategoryInput = z.infer<typeof categorySchema>
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>