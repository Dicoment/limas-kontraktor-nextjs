import { z } from "zod"

export const teamSchema = z.object({
  name: z.string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  position: z.string()
    .max(100, "Posisi maksimal 100 karakter")
    .optional()
    .nullable(),
  bio: z.string()
    .max(5000, "Bio maksimal 5000 karakter")
    .optional()
    .nullable(),
  avatar: z.string()
    .url("URL avatar tidak valid")
    .max(500, "URL avatar maksimal 500 karakter")
    .optional()
    .nullable()
    .or(z.literal("")),
  email: z.string()
    .email("Email tidak valid")
    .max(255, "Email maksimal 255 karakter")
    .optional()
    .nullable()
    .or(z.literal("")),
  phone: z.string()
    .regex(/^[0-9+\-\s()]+$/, "Nomor telepon hanya boleh berisi angka, +, -, spasi, dan tanda kurung")
    .min(8, "Nomor telepon minimal 8 digit")
    .max(20, "Nomor telepon maksimal 20 digit")
    .optional()
    .nullable(),
  displayOrder: z.number()
    .int("Display order harus bilangan bulat")
    .min(0, "Display order minimal 0")
    .max(999, "Display order maksimal 999")
    .optional()
    .default(0),
})

export const teamUpdateSchema = teamSchema.partial()

export type TeamInput = z.infer<typeof teamSchema>
export type TeamUpdateInput = z.infer<typeof teamUpdateSchema>