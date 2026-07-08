// components/CtaBanner.tsx
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";

export default function CtaBanner({ waNumber }: { waNumber: string }) {
  // Fungsi helper buat pastiin nomor WA formatnya 628...
  const formatWa = (phone: string): string => {
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      return "62" + clean.substring(1);
    }
    return clean;
  };

  return (
    <section className="max-w-7xl mx-auto px-6 pb-20">
      <div className="relative bg-[#0F2340] rounded-2xl px-10 py-16 text-center overflow-hidden">
        {/* Dekorasi Lingkaran */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full border border-white/10 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full border border-white/10 translate-x-1/2 translate-y-1/2" />
        
        {/* Konten */}
        <p className="text-xs font-bold tracking-widest uppercase text-[#E87722] mb-3 relative">
          Mari Bicara
        </p>
        <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4 relative">
          Siap mewujudkan proyek konstruksi Anda?
        </h2>
        <p className="text-white/80 text-sm max-w-lg mx-auto mb-8 relative">
          Hubungi tim kami sekarang dan dapatkan konsultasi gratis untuk proyek bangunan di Bekasi dan sekitarnya.
        </p>
        
        <Link
          href={`https://wa.me/${formatWa(waNumber)}`}
          target="_blank"
          rel="noreferrer"
          className="relative inline-flex items-center gap-2 bg-[#E87722] hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full text-sm transition-all duration-300 transform hover:scale-105"
        >
          Mulai Konsultasi <FaWhatsapp size={18} />
        </Link>
      </div>
    </section>
  );
}