"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function BottomNavItem({ href, icon, label, active }: any) {
  return (
    <Link href={href} className={`flex flex-col items-center gap-1 transition-all ${active ? "text-black" : "text-gray-500"}`}>
      {icon}
      <span className="text-[8px] font-medium tracking-widest">{label}</span>
      {active && <div className="w-1 h-1 bg-black rounded-full" />}
    </Link>
  )
}

export function SidebarLabel({ label, collapsed, mobileOpen }: { label: string, collapsed: boolean, mobileOpen: boolean }) {
  if (collapsed && !mobileOpen) return <div className="border-t border-slate-700 my-4 mx-auto w-10" />
  return <p className="pt-6 pb-2 px-4 text-xs font-semibold uppercase tracking-[2px] text-slate-400">{label}</p>
}

export function SidebarItem({ href, icon, label, collapsed, mobileOpen, active }: any) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-all group active:scale-[0.98]
        ${active ? "bg-blue-600 text-white font-semibold" : "text-slate-200 hover:bg-slate-800 hover:text-white"}
        ${(collapsed && !mobileOpen) ? "justify-center" : ""}
      `}
    >
      <span className={`${active ? "text-white" : "text-slate-400 group-hover:text-white"} shrink-0`}>{icon}</span>
      
      {(!collapsed || mobileOpen) && <span className="text-sm font-medium tracking-tight truncate">{label}</span>}
      
      {(!collapsed || mobileOpen) && active && <ChevronRight size={14} className="ml-auto opacity-70 shrink-0 text-white" />}
    </Link>
  )
}