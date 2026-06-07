import { z } from "zod"

export const companySettingSchema = z.object({
  name: z.string().min(1, "Nama perusahaan harus diisi"),
  description: z.string().min(1, "Deskripsi harus diisi"),
  address: z.string().optional().default(""),
})

export const contactSettingSchema = z.object({
  phone1: z.string().optional().default(""),
  phone2: z.string().optional().default(""),
  email: z.string().email("Email tidak valid").optional().default(""),
})

export const socialMediaSettingSchema = z.object({
  instagram: z.string().optional().default(""),
  facebook: z.string().optional().default(""),
  tiktok: z.string().optional().default(""),
  youtube: z.string().optional().default(""),
})

export const companySettingsSchema = z.object({
  company: companySettingSchema,
  contact: contactSettingSchema,
  socialMedia: socialMediaSettingSchema,
})

export const settingSchema = z.object({
  key: z.string()
    .min(2, "Key minimal 2 karakter")
    .regex(/^[a-zA-Z0-9._-]+$/, "Key hanya boleh huruf, angka, titik, underscore, dan strip"),
  value: z.string().min(1, "Value tidak boleh kosong"),
})

export const settingsBulkSchema = z.object({
  settings: z.array(settingSchema).min(1, "Minimal harus ada 1 setting")
})

export const settingUpdateSchema = settingSchema.partial()

export type SettingInput = z.infer<typeof settingSchema>
export type SettingsBulkInput = z.infer<typeof settingsBulkSchema>
export type SettingUpdateInput = z.infer<typeof settingUpdateSchema>
export type CompanySettings = z.infer<typeof companySettingsSchema>