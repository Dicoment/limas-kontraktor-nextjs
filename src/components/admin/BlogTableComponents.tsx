"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import Link from "next/link"

// --- KOMPONEN SEARCH FORM YANG FIX & WORK 100% ---
export function SearchForm({ placeholder = "Cari data..." }: { placeholder?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get("search") || ""

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Ambil data langsung dari elemen input form asli
    const formData = new FormData(e.currentTarget)
    const searchVal = formData.get("search")?.toString().trim() || ""
    
    // Buat objek URL params baru berdasarkan URL yang aktif sekarang
    const params = new URLSearchParams(searchParams.toString())
    
    if (searchVal) {
      params.set("search", searchVal)
    } else {
      params.delete("search") // Hapus param jika kolom input kosong
    }
    
    params.set("page", "1") // Setiap kali cari kata baru, paksa balik ke halaman 1
    
    // Tembak URL baru langsung ke browser tanpa hard-reload
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input 
        type="text"
        name="search" 
        defaultValue={currentSearch} 
        placeholder={placeholder} 
        className="px-3 py-2 border border-slate-300 rounded-md text-sm w-64 text-black outline-none focus:border-blue-500" 
      />
      <button 
        type="submit" 
        className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm hover:bg-slate-700 transition-colors font-semibold"
      >
        Search
      </button>
    </form>
  )
}

// --- KOMPONEN PAGINATION FIX LINK ---
export function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  
  // Fungsi pembuat link halaman agar parameter keyword search-nya tidak hilang saat pindah halaman
  const createPageLink = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }
  
  return (
    <div className="flex items-center gap-2 justify-center pt-4">
      {pages.map((p) => (
        <Link 
          key={p} 
          href={createPageLink(p)} 
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            p === currentPage 
              ? "bg-blue-600 text-white" 
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {p}
        </Link>
      ))}
    </div>
  )
}