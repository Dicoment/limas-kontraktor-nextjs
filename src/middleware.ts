import { auth } from "@/lib/auth.edge"
import { NextResponse, type NextRequest } from "next/server"

const authRoutes = ["/login", "/register", "/forgot-password"]
const publicPatterns = [/^\/api\/auth/, /^\/_next/, /^\/favicon\.ico/, /\.(svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|css)$/]

export default auth(async (req: NextRequest) => {
  const session = await auth()
  const isAuthenticated = !!session
  const { nextUrl } = req

  const isAuthRoute = authRoutes.some(route => nextUrl.pathname.startsWith(route))
  const isPublicPattern = publicPatterns.some((p) => p.test(nextUrl.pathname))

  if (isAuthRoute) {
    if (isAuthenticated) {
      return Response.redirect(new URL("/dashboard", nextUrl))
    }
    return null
  }

  if (!isPublicPattern && nextUrl.pathname.startsWith("/dashboard") && !isAuthenticated) {
    return Response.redirect(new URL("/login", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}