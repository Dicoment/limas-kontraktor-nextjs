import AuthProvider from "@/components/AuthProvider"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans, DM_Serif_Display } from "next/font/google"

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
})

const siteUrl = "https://limaskontraktor.com"
const siteName = "Limas Kontraktor"
const siteDescription =
  "Limas Kontraktor adalah brand dari CV Listiya Mandiri Jaya Steel, perusahaan jasa desain dan konstruksi pembangunan terpercaya di Bekasi. Melayani pembangunan, renovasi, dan desain bangunan profesional."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Jasa Konstruksi & Desain Bangunan Bekasi`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "kontraktor bekasi",
    "jasa konstruksi bekasi",
    "desain bangunan bekasi",
    "renovasi rumah bekasi",
    "CV Listiya Mandiri Jaya Steel",
    "limas kontraktor",
    "kontraktor terpercaya",
    "bangun rumah bekasi",
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} — Jasa Konstruksi & Desain Bangunan Bekasi`,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${siteName} — Jasa Konstruksi & Desain Bangunan`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Jasa Konstruksi & Desain Bangunan Bekasi`,
    description: siteDescription,
    images: [`${siteUrl}/og-image.jpg`],
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "ISI_GOOGLE_SEARCH_CONSOLE_CODE_DI_SINI",
  },
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className={`${plusJakarta.variable} ${dmSerif.variable} font-sans`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  )
}