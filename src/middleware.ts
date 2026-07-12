import { auth } from "@/lib/auth.edge"
import { NextResponse, type NextRequest } from "next/server"

const authRoutes = ["/login", "/register", "/forgot-password"]
const publicPatterns = [/^\/api\/auth/, /^\/_next/, /^\/favicon\.ico/, /\.(svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|css)$/]

// Prefix yang GAK dihitung sebagai pageview publik (biar gak nyampur sama
// traffic dashboard/API/auth internal).
const PAGEVIEW_EXCLUDED_PREFIXES = ["/dashboard", "/api", "/login", "/register", "/forgot-password"]

/** Fire-and-forget — jangan di-await, jangan sampai nge-block navigasi user. */
function logPageView(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isExcluded = PAGEVIEW_EXCLUDED_PREFIXES.some((p) => path.startsWith(p)) || path.includes(".")
  if (isExcluded || req.method !== "GET") return

  fetch(`${req.nextUrl.origin}/api/pageview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path,
      ip: req.headers.get("x-forwarded-for") || "unknown",
      ua: req.headers.get("user-agent") || "unknown",
    }),
  }).catch(() => {})
}

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

  // Nyatet pageview di sini — udah lolos semua pengecekan auth di atas,
  // jadi ini titik paling aman: request beneran mau diteruskan ke halaman
  // publik, bukan lagi diproses redirect.
  logPageView(req)

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}