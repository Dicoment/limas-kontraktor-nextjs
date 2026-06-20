"use client"

import { useState, useEffect } from "react"
import { 
  Briefcase, FileText, Users, MessageSquare, CheckCircle2,
  TrendingUp, Calendar, PlusCircle, ArrowRight, Eye, Filter
} from "lucide-react"
import Link from "next/link"
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from "recharts"
import { StatCard, QuickLink } from "@/components/admin/DashboardCards"

// MASTER DATA SIMULASI (Contoh data mentah dari database yang memiliki properti tanggal lengkap)
const MASTER_DATA_LOG = [
  { date: "2025-03-09", label: "09 Mar 2025", "Unique Visitors": 95, "Page Views": 210 },
  { date: "2025-03-10", label: "10 Mar 2025", "Unique Visitors": 150, "Page Views": 340 },
  { date: "2025-03-15", label: "15 Mar 2025", "Unique Visitors": 180, "Page Views": 420 },
  { date: "2025-03-20", label: "20 Mar 2025", "Unique Visitors": 210, "Page Views": 510 },
  { date: "2025-04-01", label: "01 Apr 2025", "Unique Visitors": 290, "Page Views": 680 },
  { date: "2025-04-10", label: "10 Apr 2025", "Unique Visitors": 340, "Page Views": 850 },
  { date: "2025-04-20", label: "20 Apr 2025", "Unique Visitors": 410, "Page Views": 990 },
  { date: "2026-05-01", label: "01 Mei 2026", "Unique Visitors": 520, "Page Views": 1200 },
  { date: "2026-06-02", label: "02 Jun 2026", "Unique Visitors": 600, "Page Views": 1450 },
]

const trendingPages = [
  { path: "/projects/rumah-minimalis-bekasi", views: 1240, title: "Kontraktor Rumah Minimalis Bekasi" },
  { path: "/blog/biaya-bangun-rumah-2026", views: 980, title: "Estimasi Biaya Bangun Rumah Tahun 2026" },
  { path: "/projects/renovasi-ruko-kranji", views: 720, title: "Renovasi Ruko 3 Lantai Kranji" },
]

const recentContent = [
  { title: "Desain Kantor Modern PT Kenkad", type: "Project", date: "02 Juni 2026" },
  { title: "Tips Memilih Jasa Kontraktor Terpercaya", type: "Blog", date: "30 Mei 2026" },
  { title: "Review Pembangunan Rumah Klasik Tambun", type: "Testimonial", date: "28 Mei 2026" },
]

export default function AdminDashboardPage() {
  const [dataRekap] = useState({ projects: 3, published: 1, blogs: 2, leads: 2, reviews: 3 })

  // State untuk menyimpan tanggal filter (Default diset dari 10 Maret 2025 sampai hari ini di 2026)
  const [startDate, setStartDate] = useState("2025-03-10")
  const [endDate, setEndDate] = useState("2026-06-02")
  
  // State untuk menampung data grafik yang sudah disaring
  const [filteredChartData, setFilteredChartData] = useState(MASTER_DATA_LOG)

  // Fungsi untuk memfilter data berdasarkan rentang tanggal yang dipilih user
  useEffect(() => {
    const dataFiltrasi = MASTER_DATA_LOG.filter((item) => {
      if (!startDate && !endDate) return true // Kalau filter kosong, tampilkan semua
      if (startDate && item.date < startDate) return false
      if (endDate && item.date > endDate) return false
      return true
    })
    setFilteredChartData(dataFiltrasi)
  }, [startDate, endDate])

  // Fungsi instan untuk mereset filter kembali ke awal
  const handleResetFilter = () => {
    setStartDate("2025-03-10")
    setEndDate("2026-06-02")
  }

  return (
    <div className="space-y-6 font-jakarta">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Overview Dashboard</h1>
        <p className="text-xs text-gray-500 mt-0.5">Analitik tren performa visitor, trafik halaman, dan pintasan manajemen Limas Kontraktor.</p>
      </div>

      {/* BARIS 1: 5 KARTU INDIKATOR ATAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Projects" value={dataRekap.projects} icon={<Briefcase size={16} />} variant="blue" />
        <StatCard title="Published" value={dataRekap.published} icon={<CheckCircle2 size={16} />} variant="green" />
        <StatCard title="Blog Posts" value={dataRekap.blogs} icon={<FileText size={16} />} variant="purple" />
        <StatCard title="Total Leads" value={dataRekap.leads} icon={<Users size={16} />} variant="orange" />
        <StatCard title="Client Reviews" value={dataRekap.reviews} icon={<MessageSquare size={16} />} variant="yellow" />
      </div>

      {/* BARIS 2: GRAFIK GARIS DENGAN SELEKSI RENTANG TANGGAL */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        
        {/* Kontrol Filter & Judul Grafik */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6 pb-5 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h2 className="text-sm font-bold text-gray-900">Grafik Analitik Pengunjung</h2>
      </div>
            <p className="text-[11px] text-gray-400">Gunakan filter untuk melihat data statistik pada periode waktu tertentu.</p>
          </div>

          {/* Form Date Range Picker */}
          <div className="flex flex-wrap items-center gap-2 lg:gap-3">
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs text-gray-600">
              <Filter size={14} className="text-gray-400" />
              <span className="font-medium hidden sm:inline">Filter Periode:</span>
            </div>

            {/* Input Tanggal Mulai */}
            <div className="flex flex-col">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:border-blue-500 cursor-pointer shadow-sm"
              />
            </div>

            <span className="text-xs font-bold text-gray-400">s/d</span>

            {/* Input Tanggal Selesai */}
            <div className="flex flex-col">
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:border-blue-500 cursor-pointer shadow-sm"
              />
            </div>

            {/* Tombol Reset Filter */}
            <button 
              onClick={handleResetFilter}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold active:scale-95 transition-all"
            >
              Reset
            </button>
          </div>
        </div>
        
        {/* Kontainer Grafik Garis */}
        <div className="w-full h-72 text-xs">
          {filteredChartData.length > 0 ? (
            <ResponsiveContainer width="100%">
              <LineChart data={filteredChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                {/* Menggunakan dataKey 'label' agar yang keluar adalah tanggal, bulan, dan tahun yang jelas */}
                <XAxis dataKey="label" axisLine={false} tickLine={false} stroke="#94a3b8" />
                <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line type="monotone" name="Unique Visitors" dataKey="Unique Visitors" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" name="Page Views" dataKey="Page Views" stroke="#9333ea" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            // Tampilan jika data tidak ditemukan pada rentang tanggal tersebut
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
              <span className="text-2xl">📭</span>
              <p className="text-xs font-medium">Tidak ada data analitik pada rentang tanggal pilihanmu.</p>
            </div>
          )}
        </div>
      </div>

      {/* BARIS 3: GRID 3 KOLOM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Kolom 1: Trending Pages */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Trending Pages</h3>
            <p className="text-[11px] text-gray-400 mb-4">Halaman website yang paling sering dikunjungi user.</p>
            <div className="space-y-3">
              {trendingPages.map((page, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-xs font-bold text-gray-800 truncate">{page.title}</p>
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

        {/* Kolom 2: Baru Ditambahkan */}
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

        {/* Kolom 3: Akses Cepat */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Akses Cepat</h3>
          <p className="text-[11px] text-gray-400 mb-4">Pintas kilat manajemen data.</p>
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