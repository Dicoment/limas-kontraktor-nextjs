"use client"

import { useState, useEffect, useMemo } from "react"
import { TrendingUp, Filter } from "lucide-react"
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from "recharts"

interface ChartPoint {
  date: string
  label: string
  "Unique Visitors": number
  "Page Views": number
}

export default function DashboardChartClient({ data }: { data: ChartPoint[] }) {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])

  const defaultStart = data[0]?.date ?? ""
  const defaultEnd = data[data.length - 1]?.date ?? ""
  const [startDate, setStartDate] = useState(defaultStart)
  const [endDate, setEndDate] = useState(defaultEnd)

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (startDate && item.date < startDate) return false
      if (endDate && item.date > endDate) return false
      return true
    })
  }, [data, startDate, endDate])

  const handleReset = () => {
    setStartDate(defaultStart)
    setEndDate(defaultEnd)
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6 pb-5 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-gray-900">Grafik Analitik Pengunjung</h2>
          </div>
          <p className="text-[11px] text-gray-400">Gunakan filter untuk melihat data statistik pada periode waktu tertentu.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs text-gray-600">
            <Filter size={14} className="text-gray-400" />
            <span className="font-medium hidden sm:inline">Filter Periode:</span>
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:border-blue-500 cursor-pointer shadow-sm"
          />
          <span className="text-xs font-bold text-gray-400">s/d</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:border-blue-500 cursor-pointer shadow-sm"
          />
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold active:scale-95 transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="w-full h-72 text-xs" suppressHydrationWarning>
        {isClient && filtered.length > 0 ? (
          <ResponsiveContainer width="100%">
            <LineChart data={filtered} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} stroke="#94a3b8" />
              <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line type="monotone" name="Unique Visitors" dataKey="Unique Visitors" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" name="Page Views" dataKey="Page Views" stroke="#9333ea" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
            <span className="text-2xl">📭</span>
            <p className="text-xs font-medium">
              {data.length === 0 ? "Belum ada data pageview tercatat." : "Tidak ada data pada rentang tanggal pilihanmu."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}