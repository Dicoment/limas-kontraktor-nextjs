// app/kontak/page.tsx
import type { Metadata } from "next";
import ContactClient from "./ContactClient";

/* ─────────────────────────────────────────────────────────────
   SEO METADATA
   Target keywords:
   - jasa kontraktor Bekasi (primary)
   - kontraktor Jakarta / Jabodetabek (secondary)
   - jasa bangun rumah Bekasi, jasa desain bangunan Bekasi
───────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Hubungi Limas Kontraktor – Jasa Kontraktor Bekasi & Jabodetabek",
  description:
    "Konsultasi gratis dengan Limas Kontraktor, jasa kontraktor terpercaya di Bekasi, Jakarta, dan Jabodetabek. Spesialis desain dan konstruksi bangunan. Hubungi 0823-2072-1150.",
  keywords: [
    "jasa kontraktor Bekasi",
    "kontraktor Jakarta",
    "kontraktor Jabodetabek",
    "jasa bangun rumah Bekasi",
    "jasa desain bangunan Bekasi",
    "kontraktor terpercaya Bekasi",
    "jasa konstruksi Bekasi",
    "CV Listiya Mandiri Jaya Steel",
    "Limas Kontraktor",
    "bangun rumah Jabodetabek",
    "renovasi rumah Bekasi",
  ],
  alternates: {
    canonical: "https://limaskontraktor.co.id/kontak",
  },
  openGraph: {
    title: "Hubungi Limas Kontraktor – Jasa Kontraktor Bekasi & Jabodetabek",
    description:
      "Konsultasi gratis dengan tim profesional Limas Kontraktor. Melayani jasa desain dan konstruksi bangunan di Bekasi, Jakarta, Tangerang, Depok, dan Bogor.",
    url: "https://limaskontraktor.co.id/kontak",
    siteName: "Limas Kontraktor",
    locale: "id_ID",
    type: "website",
  },
};


const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://limaskontraktor.co.id/#business",
      name: "Limas Kontraktor",
      alternateName: "CV Listiya Mandiri Jaya Steel",
      description:
        "Jasa desain dan konstruksi bangunan terpercaya di Bekasi dan Jabodetabek. Melayani konstruksi gedung, renovasi, dan desain interior.",
      url: "https://limaskontraktor.co.id",
      telephone: ["+6208232072115", "+6208132396269"],
      email: "cvlistiyamandirijayasteel70a@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Mawar IV No.70A, RT.001/RW.007, Kali Baru",
        addressLocality: "Kota Bekasi",
        addressRegion: "Jawa Barat",
        postalCode: "17183",
        addressCountry: "ID",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -6.1901,
        longitude: 106.9922,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:00",
          closes: "17:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Saturday"],
          opens: "08:00",
          closes: "13:00",
        },
      ],
      sameAs: [
        "https://www.instagram.com/limas.kontraktor",
        "https://www.facebook.com/LimasKontraktor",
        "https://www.tiktok.com/@limaskontraktor",
        "https://www.youtube.com/@LimasKontraktor",
      ],
      areaServed: [
        { "@type": "City", name: "Bekasi" },
        { "@type": "City", name: "Jakarta" },
        { "@type": "City", name: "Tangerang" },
        { "@type": "City", name: "Depok" },
        { "@type": "City", name: "Bogor" },
      ],
      priceRange: "$$",
    },
    {
      "@type": "ContactPage",
      "@id": "https://limaskontraktor.co.id/kontak/#page",
      url: "https://limaskontraktor.co.id/kontak",
      name: "Kontak Limas Kontraktor",
      isPartOf: { "@id": "https://limaskontraktor.co.id/#business" },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Beranda",
            item: "https://limaskontraktor.co.id",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Kontak",
            item: "https://limaskontraktor.co.id/kontak",
          },
        ],
      },
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Semantic H1 hidden visually but present for crawlers
          (visible H1 lives inside ContactClient as the hero heading) */}
      <h1 className="sr-only">
        Jasa Kontraktor Bekasi &amp; Jabodetabek – Limas Kontraktor
      </h1>
      <ContactClient />
    </>
  );
}