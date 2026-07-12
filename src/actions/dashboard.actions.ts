"use server"

import { prisma } from "@/lib/prisma"

export async function getDashboardStats() {
  const [projects, published, blogs, leads, reviews] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "COMPLETED" } }),
    prisma.blogPost.count(),
    prisma.leadsLog.count(),
    prisma.testimonial.count(),
  ])
  return { projects, published, blogs, leads, reviews }
}

export async function getRecentContent(limit = 5) {
  const [projects, posts, testimonials] = await Promise.all([
    prisma.project.findMany({ orderBy: { createdAt: "desc" }, take: limit, select: { title: true, createdAt: true } }),
    prisma.blogPost.findMany({ orderBy: { createdAt: "desc" }, take: limit, select: { title: true, createdAt: true } }),
    prisma.testimonial.findMany({ orderBy: { createdAt: "desc" }, take: limit, select: { clientName: true, createdAt: true } }),
  ])

  const merged = [
    ...projects.map(p => ({ title: p.title, type: "Project", date: p.createdAt })),
    ...posts.map(p => ({ title: p.title, type: "Blog", date: p.createdAt })),
    ...testimonials.map(t => ({ title: `Review dari ${t.clientName}`, type: "Testimonial", date: t.createdAt })),
  ]

  return merged
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit)
    .map(item => ({
      ...item,
      date: item.date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    }))
}

/** Grafik harian: Page Views (total baris) + Unique Visitors (distinct visitorHash per hari). */
export async function getChartData(days = 90) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const rows = await prisma.pageView.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true, visitorHash: true },
  })

  const byDay = new Map<string, { views: number; visitors: Set<string> }>()
  for (const row of rows) {
    const key = row.createdAt.toISOString().slice(0, 10) // YYYY-MM-DD
    if (!byDay.has(key)) byDay.set(key, { views: 0, visitors: new Set() })
    const entry = byDay.get(key)!
    entry.views += 1
    entry.visitors.add(row.visitorHash)
  }

  return Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { views, visitors }]) => ({
      date,
      label: new Date(date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      "Unique Visitors": visitors.size,
      "Page Views": views,
    }))
}

export async function getTrendingPages(limit = 5) {
  const grouped = await prisma.pageView.groupBy({
    by: ["path"],
    _count: { path: true },
    orderBy: { _count: { path: "desc" } },
    take: limit,
  })
  return grouped.map(g => ({ path: g.path, views: g._count.path, title: g.path }))
}