import { z } from "zod"

export const leadsLogSchema = z.object({
  name: z.string()
    .min(1, "Nama minimal 1 karakter")
    .max(255, "Nama maksimal 255 karakter")
    .optional()
    .nullable(),
  phone: z.string()
    .regex(/^[0-9+\-\s]+$/, "Nomor telepon hanya boleh berisi angka, +, -, dan spasi")
    .min(8, "Nomor telepon minimal 8 digit")
    .max(20, "Nomor telepon maksimal 20 digit")
    .optional()
    .nullable(),
  message: z.string()
    .max(5000, "Pesan maksimal 5000 karakter")
    .optional()
    .nullable(),
  projectId: z.string()
    .cuid("Format project ID tidak valid")
    .optional()
    .nullable(),
  pageUrl: z.string()
    .url("URL tidak valid")
    .max(2000, "URL maksimal 2000 karakter")
    .optional()
    .nullable(),
  ipAddress: z.string()
    .regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, "Format IP address tidak valid")
    .optional()
    .nullable()
    .or(z.literal("unknown")),
  userAgent: z.string()
    .max(500, "User Agent maksimal 500 karakter")
    .optional()
    .nullable(),
})

export const leadsLogUpdateSchema = leadsLogSchema.partial()

export type LeadsLogInput = z.infer<typeof leadsLogSchema>
export type LeadsLogUpdateInput = z.infer<typeof leadsLogUpdateSchema>