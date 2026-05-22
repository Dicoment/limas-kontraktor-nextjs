"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

const navItems = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/blog-posts", label: "Blog Posts" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/tags", label: "Tags" },
  { href: "/admin/teams", label: "Teams" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/leads-logs", label: "Leads Log" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold">Limas Admin</h2>
          <p className="text-slate-400 text-xs mt-1">{session?.user?.email}</p>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-md text-sm transition-colors ${
                isActive(item.href, item.exact)
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full px-4 py-2 text-sm bg-slate-800 text-slate-300 rounded-md hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4">
          <h1 className="text-xl font-semibold text-slate-800">
            {navItems.find((item) => isActive(item.href, item.exact))?.label || "Dashboard"}
          </h1>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}