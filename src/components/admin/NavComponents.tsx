"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ChevronRight, ChevronDown } from "lucide-react"

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

interface SidebarSubItem {
  href: string
  label: string
}

interface SidebarGroupProps {
  icon: React.ReactNode
  label: string
  items: SidebarSubItem[]
  collapsed: boolean
  mobileOpen: boolean
  pathname: string
}

/**
 * Menu grup yang bisa di-collapse/expand, isinya beberapa sub-link
 * (misal "Profile" > User, Setting, Tambah User). Auto-expand kalau
 * pathname aktif cocok sama salah satu sub-item-nya.
 */
export function SidebarGroup({ icon, label, items, collapsed, mobileOpen, pathname }: SidebarGroupProps) {
  const hasActiveChild = items.some((item) => pathname === item.href)
  const [open, setOpen] = useState(hasActiveChild)

  // Kalau navigasi ke salah satu sub-item dari luar (klik link lain terus balik),
  // pastiin grup ke-expand otomatis biar keliatan item mana yang aktif.
  useEffect(() => {
    if (hasActiveChild) setOpen(true)
  }, [hasActiveChild])

  const showLabel = !collapsed || mobileOpen

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`
          w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-all group
          ${hasActiveChild ? "bg-slate-800 text-white font-semibold" : "text-slate-200 hover:bg-slate-800 hover:text-white"}
          ${!showLabel ? "justify-center" : ""}
        `}
      >
        <span className={`${hasActiveChild ? "text-white" : "text-slate-400 group-hover:text-white"} shrink-0`}>{icon}</span>
        {showLabel && <span className="text-sm font-medium tracking-tight truncate">{label}</span>}
        {showLabel && (
          <span className="ml-auto text-slate-400">
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
      </button>

      {open && showLabel && (
        <div className="mt-1 ml-4 pl-3 border-l border-slate-700 space-y-0.5">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-xs font-medium tracking-tight transition-all ${
                pathname === item.href
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}