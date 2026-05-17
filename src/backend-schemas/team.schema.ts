import { z } from "zod"

export const teamSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  position: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  avatar: z.string().url("URL avatar tidak valid").optional().nullable().or(z.literal("")),
  email: z.string().email("Email tidak valid").optional().nullable().or(z.literal("")),
  phone: z.string().optional().nullable(),
  displayOrder: z.number().int().optional().default(0),
})

export const teamUpdateSchema = teamSchema.partial()

export type TeamInput = z.infer<typeof teamSchema>
export type TeamUpdateInput = z.infer<typeof teamUpdateSchema>