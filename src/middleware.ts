import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"

const publicRoutes = ["/admin/login", "/api/auth"]
const publicPatterns = [/^\/api\/auth/, /^\/_next/, /^\/favicon\.ico/, /\.(svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|css)$/]

export default async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token
  const { pathname } = request.nextUrl

  const isPublicRoute = publicRoutes.includes(pathname) || publicPatterns.some(p => p.test(pathname))

  if (pathname.startsWith("/admin") && !isPublicRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}