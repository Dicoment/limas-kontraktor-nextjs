// src/components/admin/DashboardCards.tsx
import Link from "next/link"
import { PlusCircle, ArrowRight } from "lucide-react"

// ==========================================
// KOMPONEN STAT CARD
// ==========================================
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  variant: "blue" | "green" | "purple" | "orange" | "yellow";
}

export function StatCard({ title, value, icon, variant }: StatCardProps) {
  const styles = {
    blue: { card: "bg-white border-slate-200", iconBg: "bg-blue-50 text-blue-600" },
    green: { card: "bg-white border-slate-200", iconBg: "bg-green-50 text-green-600" },
    purple: { card: "bg-white border-slate-200", iconBg: "bg-purple-50 text-purple-600" },
    orange: { card: "bg-white border-slate-200", iconBg: "bg-orange-50 text-orange-600" },
    yellow: { card: "bg-white border-slate-200", iconBg: "bg-yellow-50 text-yellow-600" },
  }

  return (
    <div className={`rounded-xl border p-5 shadow-sm transition-all hover:shadow-md ${styles[variant].card}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`p-2.5 rounded-lg ${styles[variant].iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      </div>
    </div>
  )
}

// ==========================================
// KOMPONEN QUICK LINK
// ==========================================
interface QuickLinkProps {
  href: string;
  label: string;
  variant: "blue" | "green" | "purple" | "orange";
  isView?: boolean;
}

export function QuickLink({ href, label, variant, isView = false }: QuickLinkProps) {
  const colorMap = {
    blue: "border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-600 hover:text-white hover:border-blue-600",
    green: "border-green-200 text-green-700 bg-green-50/50 hover:bg-green-600 hover:text-white hover:border-green-600",
    purple: "border-purple-200 text-purple-700 bg-purple-50/50 hover:bg-purple-600 hover:text-white hover:border-purple-600",
    orange: "border-orange-200 text-orange-700 bg-orange-50/50 hover:bg-orange-600 hover:text-white hover:border-orange-600",
  }

  return (
    <Link
      href={href}
      className={`flex items-center justify-center gap-1.5 border text-xs sm:text-sm py-2.5 px-3 rounded-lg font-semibold transition-all duration-200 shadow-sm ${colorMap[variant]}`}
    >
      {!isView ? <PlusCircle className="w-4 h-4 shrink-0" /> : <ArrowRight className="w-4 h-4 shrink-0" />}
      <span>{label}</span>
    </Link>
  )
}