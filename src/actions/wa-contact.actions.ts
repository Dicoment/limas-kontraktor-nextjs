"use server"

import { prisma } from "@/lib/prisma"

const WA_SETTING_KEYS = {
  enabled: "wa_widget_enabled",
  title: "wa_widget_title",
  hours: "wa_widget_hours",
  tooltip: "wa_widget_tooltip",
  message: "wa_widget_message",
} as const

export async function getWaContacts() {
  return prisma.whatsAppContact.findMany({ orderBy: { displayOrder: "asc" } })
}

export async function createWaContact(data: { name: string; position?: string | null; phone: string; active?: boolean; displayOrder?: number }) {
  return prisma.whatsAppContact.create({ data })
}

export async function updateWaContact(id: string, data: { name?: string; position?: string | null; phone?: string; active?: boolean; displayOrder?: number }) {
  return prisma.whatsAppContact.update({ where: { id }, data })
}

export async function deleteWaContact(id: string) {
  await prisma.whatsAppContact.delete({ where: { id } })
  return { success: true }
}

/** Teks widget disimpen di tabel Setting (key-value) yang udah ada,
 * bukan tabel baru — biar konsisten sama pola getSettings() yang eksis. */
export async function getWaWidgetSettings() {
  const keys = Object.values(WA_SETTING_KEYS)
  const rows = await prisma.setting.findMany({ where: { key: { in: keys } } })
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]))

  return {
    enabled: map[WA_SETTING_KEYS.enabled] !== "false", // default true kalau belum pernah di-set
    title: map[WA_SETTING_KEYS.title] ?? "WhatsApp Kami",
    hours: map[WA_SETTING_KEYS.hours] ?? "Jam Operasional Senin-Jumat 09-17, Sabtu 09-15",
    tooltip: map[WA_SETTING_KEYS.tooltip] ?? "Need Help? Chat with us",
    message: map[WA_SETTING_KEYS.message] ?? "Halo, saya ingin bertanya seputar layanan Limas Kontraktor.",
  }
}

export async function updateWaWidgetSettings(data: { enabled: boolean; title: string; hours: string; tooltip: string; message: string }) {
  const entries: [string, string][] = [
    [WA_SETTING_KEYS.enabled, String(data.enabled)],
    [WA_SETTING_KEYS.title, data.title],
    [WA_SETTING_KEYS.hours, data.hours],
    [WA_SETTING_KEYS.tooltip, data.tooltip],
    [WA_SETTING_KEYS.message, data.message],
  ]

  await Promise.all(
    entries.map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  )
  return { success: true }
}