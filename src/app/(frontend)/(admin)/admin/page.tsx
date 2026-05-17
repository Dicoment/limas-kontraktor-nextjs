import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function AdminDashboardPage() {
  const [
    totalProjects,
    totalBlogPosts,
    totalLeads,
    totalTestimonials,
    publishedProjects,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.blogPost.count(),
    prisma.leadsLog.count(),
    prisma.testimonial.count(),
    prisma.project.count({ where: { status: "COMPLETED" } }),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Projects" value={totalProjects} color="blue" />
        <StatCard title="Published" value={publishedProjects} color="green" />
        <StatCard title="Blog Posts" value={totalBlogPosts} color="purple" />
        <StatCard title="Total Leads" value={totalLeads} color="orange" />
      </div>

      <StatCard title="Testimonials" value={totalTestimonials} color="yellow" />

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickLink href="/admin/projects/new" label="+ New Project" color="bg-blue-500 hover:bg-blue-600" />
          <QuickLink href="/admin/blog-posts/new" label="+ New Blog Post" color="bg-green-500 hover:bg-green-600" />
          <QuickLink href="/admin/teams/new" label="+ New Team" color="bg-purple-500 hover:bg-purple-600" />
          <QuickLink href="/admin/leads-logs" label="View Leads" color="bg-orange-500 hover:bg-orange-600" />
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
  }
  return (
    <div className={`rounded-lg border p-4 ${colors[color]}`}>
      <p className="text-sm opacity-75">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  )
}

function QuickLink({ href, label, color }: { href: string; label: string; color: string }) {
  return (
    <Link
      href={href}
      className={`${color} text-white text-center py-3 px-4 rounded-lg transition-colors font-medium`}
    >
      {label}
    </Link>
  )
}