import { z } from "zod"

const urlOrRelativePath = z.string().refine(
  (val) => !val || val.startsWith("/") || val.startsWith("http://") || val.startsWith("https://"),
  { message: "Harus URL valid atau path relatif (contoh: /uploads/image.jpg)" }
)

export const projectStatusEnum = z.enum(["DRAFT", "ONGOING", "COMPLETED"])

export const projectSchema = z.object({
  title: z.string()
    .min(3, "Title minimal 3 karakter")
    .max(200, "Title maksimal 200 karakter"),
  slug: z.string()
    .min(3, "Slug minimal 3 karakter")
    .max(100, "Slug maksimal 100 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip"),
  description: z.string()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(10000, "Deskripsi maksimal 10.000 karakter"),
  location: z.string()
    .max(255, "Lokasi maksimal 255 karakter")
    .optional()
    .nullable(),
  client: z.string()
    .max(255, "Client maksimal 255 karakter")
    .optional()
    .nullable(),
  limasRole: z.string()
    .max(255, "Limas role maksimal 255 karakter")
    .optional()
    .nullable(),
  coverImage: urlOrRelativePath
    .optional()
    .nullable(),
  gallery: z.array(urlOrRelativePath)
    .max(50, "Maksimal 50 gambar dalam gallery")
    .optional()
    .default([]),
  status: projectStatusEnum.default("DRAFT"),
  seoTitle: z.string()
    .max(60, "SEO title maksimal 60 karakter")
    .optional()
    .nullable(),
  seoDescription: z.string()
    .max(160, "SEO description maksimal 160 karakter")
    .optional()
    .nullable(),
  categoryIds: z.array(z.string().cuid())
    .optional()
    .default([]),
  teamIds: z.array(z.object({
    teamId: z.string().cuid(),
    role: z.string().max(100, "Role maksimal 100 karakter").optional()
  }))
  .optional()
  .default([]),
})

export const projectUpdateSchema = projectSchema.partial()

export type ProjectInput = z.infer<typeof projectSchema>
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>