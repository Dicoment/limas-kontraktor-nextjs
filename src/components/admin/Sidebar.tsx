"use client"

import Link from "next/link"
import {
  RiDashboardLine, RiImageLine,RiBriefcaseLine, RiFileTextLine, RiStackLine, RiPriceTag3Line,
  RiTeamLine, RiChat3Line, RiFileCopyLine, RiSettings3Line, RiHistoryLine,
  RiGlobalLine, RiMenuFoldLine, RiUserLine, RiLogoutBoxLine, RiQuestionLine,
  RiGroupLine,
} from "react-icons/ri"
import Image from "next/image"
import { SidebarItem, SidebarLabel, SidebarGroup } from "./NavComponents"

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (val: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (val: boolean) => void
  pathname: string
  adminName: string
  adminEmail: string
  adminAvatar?: string | null
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
  adminAvatar,
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
            {mobileOpen ? <span className="text-white font-bold">X</span> : <RiMenuFoldLine size={20} className="hidden lg:block" />}
          </button>
        </div>

        {(!collapsed || mobileOpen) ? (
          <Link 
            href="/" 
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 bg-slate-800 hover:bg-blue-600 hover:text-white rounded-xl transition-all group border border-slate-700"
          >
            <RiGlobalLine size={16} className="text-slate-400 group-hover:text-white transition-colors" />
            <span className="text-[10px] font-medium uppercase tracking-widest truncate text-slate-300 group-hover:text-white">Visit Website</span>
          </Link>
        ) : (
          <Link 
            href="/" 
            target="_blank"
            className="mx-auto w-10 h-10 bg-slate-800 hover:bg-blue-600 hover:text-white rounded-xl flex items-center justify-center transition-all border border-slate-700"
            title="Visit Website"
          >
            <RiGlobalLine size={16} className="text-slate-300" />
          </Link>
        )}
      </div>

      {/* Bagian List Navigasi */}
<nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
  <SidebarItem href="/dashboard" icon={<RiDashboardLine size={18} />} label="Dashboard" collapsed={collapsed} mobileOpen={mobileOpen} active={pathname === '/dashboard'} />

  <SidebarLabel label="Konten Utama" collapsed={collapsed} mobileOpen={mobileOpen} />
  
  {/* Menu Projects dengan Sub-menu / Dropdown */}
  <SidebarGroup
    icon={<RiBriefcaseLine size={18} />}
    label="Projects"
    collapsed={collapsed}
    mobileOpen={mobileOpen}
    pathname={pathname}
    items={[
      { href: "/dashboard/projects", label: "Daftar Projects" },
      { href: "/dashboard/virtual-tour", label: "Virtual Tour" }, // Sesuaikan route jika beda, contoh: /dashboard/projects/virtual-tour
    ]}
  />

  <SidebarItem href="/dashboard/blog-posts" icon={<RiFileTextLine size={18} />} label="Blog Posts" collapsed={collapsed} mobileOpen={mobileOpen} active={pathname === '/dashboard/blog-posts'} />
  <SidebarItem href="/dashboard/media" icon={<RiImageLine size={18} />} label="Media" collapsed={collapsed} mobileOpen={mobileOpen} active={pathname === '/dashboard/media'} />

  <SidebarItem href="/dashboard/categories" icon={<RiStackLine size={18} />} label="Categories" collapsed={collapsed} mobileOpen={mobileOpen} active={pathname === '/dashboard/categories'} />
  <SidebarItem href="/dashboard/tags" icon={<RiPriceTag3Line size={18} />} label="Tags" collapsed={collapsed} mobileOpen={mobileOpen} active={pathname === '/dashboard/tags'} />
  <SidebarItem href="/dashboard/faqs" icon={<RiQuestionLine size={18} />} label="FAQ" collapsed={collapsed} mobileOpen={mobileOpen} active={pathname === '/dashboard/faqs'} />

  <SidebarLabel label="Data Perusahaan" collapsed={collapsed} mobileOpen={mobileOpen} />
  <SidebarItem href="/dashboard/teams" icon={<RiTeamLine size={18} />} label="Teams" collapsed={collapsed} mobileOpen={mobileOpen} active={pathname === '/dashboard/teams'} />
  <SidebarItem href="/dashboard/testimonials" icon={<RiChat3Line size={18} />} label="Testimonials" collapsed={collapsed} mobileOpen={mobileOpen} active={pathname === '/dashboard/testimonials'} />
  <SidebarItem href="/dashboard/pages" icon={<RiFileCopyLine size={18} />} label="Pages" collapsed={collapsed} mobileOpen={mobileOpen} active={pathname === '/dashboard/pages'} />

  <SidebarLabel label="Sistem & Prospek" collapsed={collapsed} mobileOpen={mobileOpen} />

  {/* Profil pribadi admin yang lagi login */}
  <SidebarItem
    href="/dashboard/profile"
    icon={<RiUserLine size={18} />}
    label="Profile"
    collapsed={collapsed}
    mobileOpen={mobileOpen}
    active={pathname === '/dashboard/profile'}
  />

  {/* Manajemen akun admin lain */}
  <SidebarGroup
    icon={<RiGroupLine size={18} />}
    label="Users"
    collapsed={collapsed}
    mobileOpen={mobileOpen}
    pathname={pathname}
    items={[
      { href: "/dashboard/users", label: "Daftar User" },
      { href: "/dashboard/users/new", label: "Tambah User" },
    ]}
  />

  {/* Pengaturan website */}
  <SidebarItem
    href="/dashboard/settings"
    icon={<RiSettings3Line size={18} />}
    label="Setting"
    collapsed={collapsed}
    mobileOpen={mobileOpen}
    active={pathname === '/dashboard/settings'}
  />

  <SidebarGroup
    icon={<RiHistoryLine size={18} />}
    label="Leads Log"
    collapsed={collapsed}
    mobileOpen={mobileOpen}
    pathname={pathname}
    items={[
      { href: "/dashboard/leads-logs", label: "Submission" },
      { href: "/dashboard/leads-logs/wa-floating", label: "WA Floating" },
    ]}
  />
</nav>

      {/* Bagian Bawah Profil Footer Info */}
      <div className="p-4 border-t border-slate-700 bg-slate-950/40">
        <div className={`flex items-center gap-3 ${(collapsed && !mobileOpen) ? "justify-center" : ""}`}>
          {adminAvatar ? (
            <img
              src={adminAvatar}
              alt={adminName}
              className="w-10 h-10 rounded-xl object-cover shadow-lg shrink-0 border border-slate-700"
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <RiUserLine size={20} />
            </div>
          )}
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
              <RiUserLine size={12} /> Profil
            </Link>
            <button onClick={handleLogout} className="flex items-center justify-center gap-1.5 py-2.5 bg-red-950/40 border border-red-900/60 rounded-lg text-xs font-medium text-red-400 hover:bg-red-600 hover:text-white transition-all">
              <RiLogoutBoxLine size={12} /> Keluar
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}