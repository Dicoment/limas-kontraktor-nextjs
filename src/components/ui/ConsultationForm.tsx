'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

// Konstanta Data Opsi Form
const LAYANAN = [
  'Jasa Bangun Rumah',
  'Jasa Bangun Interior',
  'Jasa Bangun Lainnya',
  'Jasa Renovasi Rumah',
  'Jasa Desain Rumah',
  'Jasa Desain Interior',
  'Jasa Desain Rumah + Interior',
  'Jasa Desain Bangunan Lainnya',
  'Jasa Pembuatan RAB',
  'Jasa Pembuatan IMB/PBG'
];

const UKURAN_LAHAN = ['50m² - 100m²', '< 100m²', '100m² - 200m²', '200m² - 300m²', '> 300m²'];
const RENCANA_BANGUN = ['1 Lantai', '2 Lantai', '3 Lantai / Lebih', 'Ruko / Gudang'];
const BUDGET = ['< 200 Juta', '200 - 500 Juta', '500 Juta - 1 Milyar', '> 1 Milyar'];

export default function ConsultationForm() {
  const [form, setForm] = useState({
    nama: '',
    telepon: '',
    layanan: '',
    ukuran: '',
    lantai: '',
    budget: '',
  });
  const [submitted, setSubmitted] = useState(false);

  // Helper function untuk update state field secara dinamis
  const set = (field: keyof typeof form) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nomorWA = '6282320721150';

    const teksPesan = encodeURIComponent(
      `*Halo Admin Limas Kontraktor,*\n` +
      `Saya ingin mengajukan Konsultasi Proyek.\n\n` +
      `*Data Konsultasi:*\n` +
      `• *Nama:* ${form.nama}\n` +
      `• *No. HP/WA:* ${form.telepon}\n` +
      `• *Layanan:* ${form.layanan || '-'}\n` +
      `• *Ukuran Lahan:* ${form.ukuran || '-'}\n` +
      `• *Rencana Bangun:* ${form.lantai || '-'}\n` +
      `• *Estimasi Budget:* ${form.budget || '-'}`
    );

    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${nomorWA}&text=${teksPesan}`;
    window.open(urlWhatsApp, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="bg-white">
      {submitted ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-green-500" size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Terima Kasih!</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            Anda telah diarahkan ke WhatsApp. Tim kami akan segera merespons.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({ nama: '', telepon: '', layanan: '', ukuran: '', lantai: '', budget: '' });
            }}
            className="mt-6 text-sm text-[#1B3A6B] hover:underline font-semibold"
          >
            Kirim form baru →
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama</label>
              <input
                type="text"
                required
                value={form.nama}
                onChange={(e) => set('nama')(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="w-full px-4 py-2.5 border-b-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm text-slate-800 placeholder:text-slate-300 transition-colors bg-transparent"
              />
            </div>

            {/* Telepon */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">No. HP / Whatsapp</label>
              <input
                type="tel"
                required
                value={form.telepon}
                onChange={(e) => set('telepon')(e.target.value)}
                placeholder="Masukkan No. HP atau Whatsapp Anda"
                className="w-full px-4 py-2.5 border-b-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm text-slate-800 placeholder:text-slate-300 transition-colors bg-transparent"
              />
              <p className="text-xs text-slate-300 mt-1">cth: 081234567890</p>
            </div>

            {/* Layanan */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori/Layanan</label>
              <div className="relative">
                <select
                  value={form.layanan}
                  onChange={(e) => set('layanan')(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 border-b-2 border-slate-200 focus:border-[#1B3A6B] outline-none text-sm text-slate-700 bg-transparent transition-colors pr-8"
                >
                  <option value="">Kategori/Layanan</option>
                  {LAYANAN.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">▼</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-slate-100 pt-1" />

            {/* Ukuran Lahan */}
            <RadioGroup
              label="Ukuran Lahan"
              options={UKURAN_LAHAN}
              value={form.ukuran}
              onChange={set('ukuran')}
            />

            {/* Rencana Bangun */}
            <RadioGroup
              label="Rencana Bangun"
              options={RENCANA_BANGUN}
              value={form.lantai}
              onChange={set('lantai')}
            />

            {/* Budget */}
            <RadioGroup
              label="Budget Pembangunan"
              options={BUDGET}
              value={form.budget}
              onChange={set('budget')}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={!form.nama || !form.telepon}
              className="w-full mt-2 py-3.5 bg-[#1B3A6B] hover:bg-[#15305a] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 uppercase"
            >
              <Send size={15} />
              Konsultasi Sekarang
            </button>
          </form>
        </>
      )}
    </div>
  );
}

// Sub-Komponen RadioGroup Lokal khusus untuk Opsi Pilihanf
interface RadioGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}

function RadioGroup({ label, options, value, onChange }: RadioGroupProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all ${
                isSelected
                  ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}