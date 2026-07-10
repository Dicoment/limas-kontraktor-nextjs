"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Menu, User, Settings, LogOut } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  pathname: string
  router: any
  setMobileOpen: (val: boolean) => void
  adminName: string
  adminEmail: string
  handleLogout: () => void
}

export function Header({
  pathname,
  router,
  setMobileOpen,
  adminName,
  adminEmail,
  handleLogout
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Overview'
    const segment = pathname?.split('/').pop()
    if (!segment) return 'Dashboard'
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="h-16 lg:h-20 bg-white border-b border-gray-200 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40">
      
      {/* SISI KIRI: Judul Halaman di PC (Panah Back hanya untuk Mobile) */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => router.back()} 
          className="lg:hidden text-black active:scale-90 p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-bold text-gray-900 text-base lg:text-xl tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      {/* SISI KANAN: Informasi Profil & Tombol Menu Mobile */}
      <div className="flex items-center gap-4" ref={dropdownRef}>
        
        {/* Dropdown Box Area */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 hover:bg-gray-50 rounded-xl transition-all active:scale-95 group"
          >
            {/* Teks di Kiri (Hanya muncul di PC) */}
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-gray-800 tracking-tight">
                {adminName}
              </span>
              <span className="text-[10px] font-medium text-gray-400 tracking-tight">
                {adminEmail}
              </span>
            </div>

            {/* Foto Avatar Circle di Kanan */}
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm border border-gray-100 shrink-0 group-hover:bg-blue-600 transition-colors">
              <User size={16} />
            </div>
          </button>

          {/* Isi Dropdown Menu saat Di-klik */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-gray-100 md:hidden">
                <p className="text-xs font-bold text-gray-900 uppercase tracking-tighter">{adminName}</p>
                <p className="text-[10px] text-gray-400 truncate tracking-tight mt-0.5">{adminEmail}</p>
              </div>
              <Link 
                href="/dashboard/profile" 
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings size={14} className="text-gray-400" /> Pengaturan Profil
              </Link>
              <button 
                onClick={() => {
                  setDropdownOpen(false)
                  handleLogout()
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50 text-left"
              >
                <LogOut size={14} /> Keluar Aplikasi
              </button>
            </div>
          )}
        </div>

        {/* Tombol Hamburger Menu (Hanya Muncul di Layar Mobile) */}
        <button 
          onClick={() => setMobileOpen(true)}
          className="lg:hidden text-black active:scale-90 p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

    </header>
  )
}