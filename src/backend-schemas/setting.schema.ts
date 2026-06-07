import { z } from "zod"

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