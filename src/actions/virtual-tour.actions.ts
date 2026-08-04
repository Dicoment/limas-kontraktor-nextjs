"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { virtualTourSceneSchema, virtualTourSceneUpdateSchema } from "@/backend-schemas/virtual-tour.schema"

export async function getVirtualTourScenes({
  page = 1,
  limit = 20,
  search,
}: {
  page?: number
  limit?: number
  search?: string
}) {
  const where = search
    ? { title: { contains: search, mode: "insensitive" as const } }
    : {}

  const [data, total] = await Promise.all([
    prisma.virtualTourScene.findMany({
      where,
      orderBy: { order: "asc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { project: { select: { id: true, title: true } } },
    }),
    prisma.virtualTourScene.count({ where }),
  ])

  return {
    data,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  }
}

export async function getAllVirtualTourScenes() {
  return prisma.virtualTourScene.findMany({
    orderBy: { order: "asc" },
    select: { id: true, title: true },
  })
}

export async function getVirtualTourSceneById(id: string) {
  return prisma.virtualTourScene.findUnique({
    where: { id },
    include: { project: { select: { id: true, title: true } } },
  })
}

export async function getPublishedVirtualTourScenes() {
  return prisma.virtualTourScene.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { project: { select: { title: true } } },
  })
}

export async function createVirtualTourScene(data: any) {
  const validated = virtualTourSceneSchema.parse(data)

  const scene = await prisma.virtualTourScene.create({
    data: {
      title: validated.title,
      imageUrl: validated.imageUrl,
      projectId: validated.projectId || null,
      hotspots: validated.hotspots ?? [],
      order: validated.order ?? 0,
      published: validated.published ?? false,
    },
  })

  revalidatePath("/dashboard/virtual-tour")
  revalidatePath("/vr-360")
  return scene
}

export async function updateVirtualTourScene(id: string, data: any) {
  const validated = virtualTourSceneUpdateSchema.parse(data)

  const scene = await prisma.virtualTourScene.update({
    where: { id },
    data: {
      title: validated.title ?? undefined,
      imageUrl: validated.imageUrl ?? undefined,
      projectId: validated.projectId ?? undefined,
      hotspots: validated.hotspots ?? undefined,
      order: validated.order ?? undefined,
      published: validated.published ?? undefined,
    },
  })

  revalidatePath("/dashboard/virtual-tour")
  revalidatePath("/vr-360")
  return scene
}

export async function deleteVirtualTourScenes(ids: string[]) {
  const result = await prisma.virtualTourScene.deleteMany({
    where: { id: { in: ids } },
  })

  revalidatePath("/dashboard/virtual-tour")
  revalidatePath("/vr-360")
  return { deletedCount: result.count }
}