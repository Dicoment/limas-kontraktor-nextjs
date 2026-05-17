import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
})

export const userSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  name: z.string().optional().nullable(),
  role: z.enum(["admin", "superadmin"]).default("admin"),
})

export const userUpdateSchema = userSchema.partial()

export type LoginInput = z.infer<typeof loginSchema>
export type UserInput = z.infer<typeof userSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>