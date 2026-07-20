import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Serif_Display } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer/Footer";
import SmoothScroll from "@/components/Provider/SmoothScroll";
import WhatsAppFloatingWidgetServer from "@/components/public/WhatsAppFloatingWidgetServer";

// 1. TARUH DI SINI: Memaksa Next.js agar menganggap layout & halamannya dinamis saat runtime
export const dynamic = "force-dynamic";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const siteUrl = "https://limaskontraktor.com";
const siteName = "Limas Kontraktor";
const siteDescription =
  "Cari kontraktor terpercaya di Bekasi? Limas Kontraktor melayani jasa kontraktor pembangunan, renovasi rumah, dan desain bangunan profesional dengan hasil berkualitas.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Jasa Kontraktor & Desain Bangunan Profesional Bekasi`,
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
    title: `${siteName} - Jasa Kontraktor & Desain Bangunan Profesional Bekasi`,
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
    title: `${siteName} - Jasa Kontraktor & Desain Bangunan Profesional Bekasi`,
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
};

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className={`${plusJakarta.variable} ${dmSerif.variable} font-sans`}>
        <Navbar />
        <SmoothScroll>
          <main>{children}</main>
        </SmoothScroll>
        <Footer />
        <WhatsAppFloatingWidgetServer />
      </div>
    </AuthProvider>
  );
}