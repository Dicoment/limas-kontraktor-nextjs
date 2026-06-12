// src/middleware.ts
import { auth } from "@/lib/auth"
import { NextResponse, type NextRequest } from "next/server"

const publicRoutes = ["/login"]
const publicPatterns = [/^\/api\/auth/, /^\/_next/, /^\/favicon\.ico/, /\.(svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|css)$/]

export default auth(async (req: NextRequest) => {
  const session = await auth()
  const isAuthenticated = !!session
  const { pathname } = req.nextUrl

  const isPublicRoute = publicRoutes.includes(pathname) || publicPatterns.some(p => p.test(pathname))

  if (!isPublicRoute) {
    if (pathname.startsWith("/dashboard")) {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}