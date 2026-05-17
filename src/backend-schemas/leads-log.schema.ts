import { z } from "zod"

export const leadsLogSchema = z.object({
  name: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
  pageUrl: z.string().optional().nullable(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
})

export type LeadsLogInput = z.infer<typeof leadsLogSchema>