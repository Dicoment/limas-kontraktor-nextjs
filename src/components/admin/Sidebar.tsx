"use client"

import Link from "next/link"
import { 
  LayoutDashboard, Briefcase, FileText, Layers, Tags, 
  Users, MessageSquare, Shapes, Settings, History, 
  Globe, PanelLeft, User, LogOut
} from "lucide-react"
import Image from "next/image"
import { SidebarItem, SidebarLabel } from "./NavComponents"

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (val: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (val: boolean) => void
  pathname: string
  adminName: string
  adminEmail: string
  handleLogout: () => void
}

export function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  pathname,
  adminName = 'ADMIN LIMAS',
  adminEmail = 'admin@limaskontraktor.com',
  handleLogout
}: SidebarProps) {
  return (
    <aside
      className={`
        bg-slate-900 text-white border-r border-slate-800 shadow-xl lg:shadow-sm
        transition-all duration-300 ease-in-out
        fixed h-full z-70 flex flex-col
        ${collapsed ? "w-20" : "w-72 lg:w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* Bagian Atas Brand Header */}
      <div className="p-6 flex flex-col gap-4 border-b border-slate-700 shrink-0">
        <div className="flex items-center justify-between">
          {(!collapsed || mobileOpen) && (
            <div className="flex items-center gap-2 animate-in fade-in duration-500">
              <Image src="/favicon.ico" alt="Limas Logo" width={32} height={32} className="rounded-lg" />
              <span className="font-black tracking-tighter text-white uppercase truncate">Dashboard</span>
            </div>
          )}
          <button
            onClick={() => mobileOpen ? setMobileOpen(false) : setCollapsed(!collapsed)}
            className="text-slate-400 hover:bg-slate-800 p-2 rounded-xl active:scale-90 transition-all"
          >
            {mobileOpen ? <span className="text-white font-bold">X</span> : <PanelLeft size={20} className="hidden lg:block" />}
          </button>
        </div>

        {(!collapsed || mobileOpen) ? (
          <Link 
            href="/" 
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 bg-slate-800 hover:bg-blue-600 hover:text-white rounded-xl transition-all group border border-slate-700"
          >
            <Globe size={16} className="text-slate-400 group-hover:text-white transition-colors" />
            <span className="text-[10px] font-medium uppercase tracking-widest truncate text-slate-300 group-hover:text-white">Visit Website</span>
          </Link>
        ) : (
          <Link 
            href="/" 
            target="_blank"
            className="mx-auto w-10 h-10 bg-slate-800 hover:bg-blue-600 hover:text-white rounded-xl flex items-center justify-center transition-all border border-slate-700"
            title="Visit Website"
          >
            <Globe size={16} className="text-slate-300" />
          </Link>
        )}
      </div>

      {/* Bagian List Navigasi */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        <SidebarItem href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" collapsed={collapsed} mobileOpen={mobileOpen} active={pathname === '/dashboard'} />

        <SidebarLabel label="Konten Utama" collapsed={collapsed} mobileOpen={mobileOpen} />
        <SidebarItem href="/dashboard/projects" icon={<Briefcase size={18} />} label="Projects" collapsed={collapsed} mobileOpen={mobileOpen} active={pathname === '/dashboard/projects'} />
        <SidebarItem href="/dashboard/blog-posts" icon={<FileText size={18} />} label="Blog Posts" collapsed={collapsed} mobileOpen={mobileOpen} active={pathname === '/dashboard/blog-posts'} />
        <SidebarItem href="/dashboard/categories" icon={<Layers size={18} />} label="Categories" collapsed={collapsed} mobileOpen={mobileOpen} active={pathname === '/dashboard/categories'} />
        <SidebarItem href="/dashboard/tags" icon={<Tags size={18} />} label="Tags" collapsed={collapsed} mobileOpen={mobileOpen} active={pathname === '/dashboard/tags'} />

        <SidebarLabel label="Data Perusahaan" collapsed={collapsed} mobileOpen={mobileOpen} />
        <SidebarItem href="/dashboard/teams" icon={<Users size={18} />} label="Teams" collapsed={collapsed} mobileOpen={mobileOpen} active={pathname === '/dashboard/teams'} />
        <SidebarItem href="/dashboard/testimonials" icon={<MessageSquare size={18} />} label="Testimonials" collapsed={collapsed} mobileOpen={mobileOpen} active={pathname === '/dashboard/testimonials'} />
        <SidebarItem href="/dashboard/pages" icon={<Shapes size={18} />} label="Pages" collapsed={collapsed} mobileOpen={mobileOpen} active={pathname === '/dashboard/pages'} />

        <SidebarLabel label="Sistem & Prospek" collapsed={collapsed} mobileOpen={mobileOpen} />
        <SidebarItem href="/dashboard/profile" icon={<User size={18} />} label="Profil" collapsed={collapsed} mobileOpen={mobileOpen} active={pathname === '/dashboard/profile'} />
        <SidebarItem href="/dashboard/settings" icon={<Settings size={18} />} label="Settings" collapsed={collapsed} mobileOpen={mobileOpen} active={pathname === '/dashboard/settings'} />
        <SidebarItem href="/dashboard/leads-logs" icon={<History size={18} />} label="Leads Log" collapsed={collapsed} mobileOpen={mobileOpen} active={pathname === '/dashboard/leads-logs'} />
      </nav>

      {/* Bagian Bawah Profil Footer Info */}
      <div className="p-4 border-t border-slate-700 bg-slate-950/40">
        <div className={`flex items-center gap-3 ${(collapsed && !mobileOpen) ? "justify-center" : ""}`}>
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <User size={20} />
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate uppercase tracking-tighter">{adminName}</p>
              <p className="text-[11px] font-medium text-slate-400 truncate tracking-tight">{adminEmail}</p>
            </div>
          )}
        </div>
        {(!collapsed || mobileOpen) && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Link href="/dashboard/profile" className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-700 active:bg-slate-800 transition-colors">
              <User size={12} /> Profil
            </Link>
            <button onClick={handleLogout} className="flex items-center justify-center gap-1.5 py-2.5 bg-red-950/40 border border-red-900/60 rounded-lg text-xs font-medium text-red-400 hover:bg-red-600 hover:text-white transition-all">
              <LogOut size={12} /> Keluar
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}