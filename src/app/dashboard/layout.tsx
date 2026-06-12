'use client'

import { useState, useEffect } from "react"
import { LayoutDashboard, Briefcase, FileText, Settings, PlusCircle, LayoutGrid, User } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from 'next/navigation'

import { Sidebar } from "@/components/admin/Sidebar"
import { Header } from "@/components/admin/Header"
import { BottomNavItem } from "@/components/admin/NavComponents"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [adminName, setAdminName] = useState('ADMIN LIMAS')
  const [adminEmail, setAdminEmail] = useState('admin@limaskontraktor.com')
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile")
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setAdminName(json.data.name || 'ADMIN LIMAS')
            setAdminEmail(json.data.email || 'admin@limaskontraktor.com')
          }
        }
      } catch {
        // keep defaults
      }
    }
    fetchProfile()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      localStorage.clear()
      window.location.replace('/login')
    } catch (err) {
      localStorage.clear()
      window.location.replace('/login')
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-black">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-60 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        collapsed={collapsed} setCollapsed={setCollapsed}
        mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
        pathname={pathname} adminName={adminName} adminEmail={adminEmail}
        handleLogout={handleLogout}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-64"} ml-0 min-w-0`}>

        <Header
          pathname={pathname} router={router} setMobileOpen={setMobileOpen}
          adminName={adminName} adminEmail={adminEmail} handleLogout={handleLogout}
        />

        <main className="p-4 lg:p-6 flex-1 text-black bg-white pb-28 lg:pb-6">
            {children}
           </main>

        <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 flex justify-between items-center z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <BottomNavItem href="/dashboard" icon={<LayoutDashboard size={22} />} label="DASH" active={pathname === '/dashboard'} />
          <BottomNavItem href="/dashboard/projects" icon={<Briefcase size={22} />} label="PROYEK" active={pathname === '/dashboard/projects'} />

          <div className="relative -top-5">
             <Link href="/dashboard/blog-posts/new" className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center shadow-2xl transition-all">
                <PlusCircle size={32} />
             </Link>
          </div>

          <BottomNavItem href="/dashboard/blog-posts" icon={<FileText size={22} />} label="BLOG" active={pathname === '/dashboard/blog-posts'} />
          <BottomNavItem href="/dashboard/settings" icon={<Settings size={22} />} label="SETTING" active={pathname === '/dashboard/settings'} />
        </nav>
      </div>
    </div>
  )
}