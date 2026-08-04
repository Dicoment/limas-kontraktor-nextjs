import { z } from "zod"

export const hotspotSchema = z.object({
  targetSceneId: z.string().min(1),
  label: z.string().min(1).max(50),
  yaw: z.number(),
  pitch: z.number(),
})

export const virtualTourSceneSchema = z.object({
  title: z.string().min(2, "Judul minimal 2 karakter").max(100),
  imageUrl: z.string().min(1, "Foto 360 wajib diisi"),
  projectId: z.string().optional().nullable(),
  hotspots: z.array(hotspotSchema).optional().nullable(),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
})

export const virtualTourSceneUpdateSchema = virtualTourSceneSchema.partial()