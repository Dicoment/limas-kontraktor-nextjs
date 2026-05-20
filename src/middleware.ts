// src/middleware.ts
import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { authConfig } from "@/lib/auth.config" // <-- UBAH IMPORT INI

// Inisialisasi auth khusus untuk environment Edge (tanpa Prisma)
const { auth } = NextAuth(authConfig)

const publicRoutes = ["/admin/login"]
const publicPatterns = [/^\/api\/auth/, /^\/_next/, /^\/favicon\.ico/, /\.(svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|css)$/]

export default auth((req) => {
  const isAuthenticated = !!req.auth
  const { pathname } = req.nextUrl

  const isPublicRoute = publicRoutes.includes(pathname) || publicPatterns.some(p => p.test(pathname))

  if (pathname.startsWith("/admin") && !isPublicRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}