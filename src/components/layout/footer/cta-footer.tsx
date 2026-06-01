'use client';

import { MapPin, FileText, Hammer } from 'lucide-react';
import ConsultationForm from '../../ui/ConsultationForm'; 

export default function CTAFooter() {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <h2 className="lg:text-5xl text-3xl font-medium text-[#1B3A6B] leading-tight max-w-6xl">
          KONSULTASI DENGAN <span className="font-black text-orange-400">LIMAS KONTRAKTOR.</span> KONTRAKTOR PROFESIONAL TERPERCAYA
        </h2>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pb-20 pt-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* ── LEFT: CTA Copy ── */}
        <div>

          <p className="text-slate-700 text-lg leading-relaxed mb-10 lg:max-w-sm">
            Kami berkomitmen menerapkan prinsip ramah lingkungan dalam setiap proyek
            untuk menciptakan hasil bangunan yang berkualitas dan berkelanjutan.
            Konsultasikan secara gratis bersama tim kontraktor kami.
          </p>

          <div className="space-y-6">
            {[
              { icon: MapPin, n: '01', title: 'Konsultasi & Survey Lokasi', desc: 'Tim kami datang langsung ke lokasi Anda' },
              { icon: FileText, n: '02', title: 'Perencanaan & RAB', desc: 'Desain dan anggaran biaya yang transparan' },
              { icon: Hammer, n: '03', title: 'Pelaksanaan & Pengawasan', desc: 'Dikerjakan oleh tim profesional berpengalaman' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1B3A6B] text-white flex items-center justify-center shrink-0 text-lg font-bold tracking-wide">
                  {n}
                </div>
                <div className="pt-1">
                  <p className="text-lg font-semibold text-slate-800">{title}</p>
                  <p className="text-md text-slate-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Form Langsung Manggil Komponen Clean ── */}
        <ConsultationForm />

      </div>
    </section>
  );
}