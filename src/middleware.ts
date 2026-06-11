// src/middleware.ts
import NextAuth from "next-auth"
import { NextResponse, type NextRequest } from "next/server"
import { authConfig } from "@/lib/auth.config"

const { auth } = NextAuth(authConfig)

const publicRoutes = ["/login"]
const publicPatterns = [/^\/api\/auth/, /^\/_next/, /^\/favicon\.ico/, /\.(svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|css)$/]

const middleware = auth(async (req) => {
  const isAuthenticated = !!(await auth())
  const { pathname } = req.nextUrl

  const isPublicRoute = publicRoutes.includes(pathname) || publicPatterns.some(p => p.test(pathname))

  if (!isPublicRoute) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }
  }

  return NextResponse.next()
}) as any

export default middleware

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}