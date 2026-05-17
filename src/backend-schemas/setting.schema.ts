import { z } from "zod"

export const settingSchema = z.object({
  key: z.string().min(2, "Key minimal 2 karakter").regex(/^[a-zA-Z0-9._-]+$/, "Key hanya boleh huruf, angka, titik, underscore, dan strip"),
  value: z.string().min(1, "Value tidak boleh kosong"),
})

export const settingUpdateSchema = settingSchema.partial()

export type SettingInput = z.infer<typeof settingSchema>
export type SettingUpdateInput = z.infer<typeof settingUpdateSchema>