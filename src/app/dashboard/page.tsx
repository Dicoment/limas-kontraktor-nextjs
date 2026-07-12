import {
  Briefcase, FileText, Users, MessageSquare, CheckCircle2, Calendar, Eye
} from "lucide-react"
import { StatCard, QuickLink } from "@/components/admin/DashboardCards"
import { getDashboardStats, getRecentContent, getChartData, getTrendingPages } from "@/actions/dashboard.actions"
import DashboardChartClient from "@/components/admin/DashboardChartClient"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const [stats, recentContent, chartData, trendingPages] = await Promise.all([
    getDashboardStats(),
    getRecentContent(5),
    getChartData(90),
    getTrendingPages(5),
  ])

  return (
    <div className="space-y-6 p-8 font-jakarta">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Overview Dashboard</h1>
        <p className="text-xs text-gray-500 mt-0.5">Analitik tren performa visitor, trafik halaman, dan pintasan manajemen Limas Kontraktor.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Projects" value={stats.projects} icon={<Briefcase size={16} />} variant="blue" />
        <StatCard title="Published" value={stats.published} icon={<CheckCircle2 size={16} />} variant="green" />
        <StatCard title="Blog Posts" value={stats.blogs} icon={<FileText size={16} />} variant="purple" />
        <StatCard title="Total Leads" value={stats.leads} icon={<Users size={16} />} variant="orange" />
        <StatCard title="Client Reviews" value={stats.reviews} icon={<MessageSquare size={16} />} variant="yellow" />
      </div>

      <DashboardChartClient data={chartData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Trending Pages</h3>
            <p className="text-[11px] text-gray-400 mb-4">Halaman website yang paling sering dikunjungi user.</p>
            <div className="space-y-3">
              {trendingPages.length === 0 && (
                <p className="text-xs text-gray-400 italic">Belum ada data.</p>
              )}
              {trendingPages.map((page, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-[10px] text-blue-600 truncate mt-0.5">{page.path}</p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-xs font-semibold bg-white px-2 py-1 rounded border border-gray-200 shrink-0">
                    <Eye size={12} className="text-gray-400" /> {page.views}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Baru Ditambahkan</h3>
            <p className="text-[11px] text-gray-400 mb-4">Daftar pembaruan konten website paling mutakhir.</p>
            <div className="space-y-3">
              {recentContent.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-xs font-bold text-gray-800 truncate">{item.title}</p>
                    <span className="inline-block text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded mt-1 uppercase tracking-wider">
                      {item.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-[10px] font-medium shrink-0">
                    <Calendar size={12} /> {item.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Akses Cepat</h3>
          <p className="text-[11px] text-gray-400 mb-4">Pintasan manajemen data.</p>
          <div className="flex-1 flex flex-col gap-2.5 justify-center">
            <QuickLink href="/dashboard/projects/new" label="Tambah Proyek Baru" variant="blue" />
            <QuickLink href="/dashboard/blog-posts/new" label="Buat Artikel Blog" variant="green" />
            <QuickLink href="/dashboard/teams/new" label="Daftarkan Tim Baru" variant="purple" />
            <QuickLink href="/dashboard/leads-logs" label="Lihat Data Leads Log" variant="orange" isView />
          </div>
        </div>
      </div>
    </div>
  )
}