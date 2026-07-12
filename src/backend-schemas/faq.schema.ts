import { z } from "zod"

export const faqSchema = z.object({
  question: z.string().min(5, "Pertanyaan minimal 5 karakter"),
  answer: z.string().min(5, "Jawaban minimal 5 karakter"),
  published: z.boolean().default(false),
})

export const faqUpdateSchema = faqSchema.partial()

export type FaqInput = z.infer<typeof faqSchema>
export type FaqUpdateInput = z.infer<typeof faqUpdateSchema>