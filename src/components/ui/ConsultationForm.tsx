'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

// DATA ASLI DARI KODE KAMU (TIDAK DIUBAH SAMA SEKALI)
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

const UKURAN_LAHAN = ['10m² - 50m²', '50m² - 100m²', '< 100m²', '100m² - 200m²', '200m² - 300m²', '> 300m²'];
const RENCANA_BANGUN = ['1 Lantai', '2 Lantai', '3 Lantai / Lebih', 'Ruko / Gudang'];
const BUDGET = ['< 200 Juta', '200 - 500 Juta', '500 Juta - 1 Milyar', '> 1 Milyar'];

export default function ConsultationForm({ waPhone }: { waPhone?: string }) {
  const [form, setForm] = useState({
    nama: '',
    telepon: '',
    layanan: '',
    ukuran: '',
    lantai: '',
    budget: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const set = (field: keyof typeof form) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'telepon' && phoneError) setPhoneError('');
  };

  // Aturan ini disamakan persis sama validasi di backend (leadsLogSchema),
  // biar user langsung dikasih tau di form sebelum request dikirim ke server,
  // bukan baru ketauan gagal setelah submit.
  const validatePhone = (value: string) => {
    const trimmed = value.trim();
    if (!/^[0-9+\-\s]+$/.test(trimmed)) {
      return 'Nomor HP hanya boleh berisi angka, +, -, dan spasi.';
    }
    if (trimmed.length < 8) {
      return 'Nomor HP minimal 8 digit.';
    }
    if (trimmed.length > 20) {
      return 'Nomor HP maksimal 20 digit.';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneValidationError = validatePhone(form.telepon);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }
    setPhoneError('');
    setSaving(true);

    // Gabungin semua detail form jadi 1 teks — LeadsLog cuma punya kolom
    // generik (name/phone/message), gak ada kolom khusus buat layanan/
    // ukuran/lantai/budget, jadi disatuin di sini biar gak ilang.
    const messageDetail =
      `Layanan: ${form.layanan || "-"}\n` +
      `Ukuran Lahan: ${form.ukuran || "-"}\n` +
      `Rencana Bangun: ${form.lantai || "-"}\n` +
      `Estimasi Budget: ${form.budget || "-"}`;

    // FIX: sebelumnya form ini cuma bikin pesan WA & window.open() doang —
    // datanya gak pernah kesimpen ke LeadsLog sama sekali walau backend-nya
    // (POST /api/leads-logs) udah lama siap dipakai. Sekarang di-POST dulu
    // sebelum buka WhatsApp. Kegagalan simpan TIDAK menghalangi user tetap
    // diarahkan ke WA — itu tetap prioritas utama form ini.
    //
    // FIX #2: sebelumnya gak ngecek res.ok, jadi kalau server nolak request
    // (400 validasi Zod, 500, dll) itu gak pernah kelihatan — cuma network
    // error total yang ke-log. Sekarang status & body error-nya di-log ke
    // console biar kegagalan kayak gini gampang ketauan dari DevTools.
    try {
      const res = await fetch('/api/leads-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.nama,
          phone: form.telepon,
          message: messageDetail,
          pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('Gagal menyimpan leads log:', res.status, errData);
      }
    } catch (err) {
      // Sengaja di-diemin dari sisi user — kegagalan nyimpen log gak boleh
      // nge-block user dari alur utama (buka WhatsApp). Tapi tetap di-log
      // ke console biar bisa di-debug.
      console.error('Gagal menyimpan leads log (network):', err);
    } finally {
      setSaving(false);
    }

    // Fallback ke nomor hardcode lama kalau prop gak dikirim / kosong —
    // biar form ini tetap aman dipakai di tempat lain tanpa wajib nge-pass prop.
    const nomorWA = waPhone || '6282320721150';

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
    <div className="bg-white font-sans">
      {submitted ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-slate-900" size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Terima Kasih!</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            Anda telah diarahkan ke WhatsApp. Tim kami akan segera merespons.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({ nama: '', telepon: '', layanan: '', ukuran: '', lantai: '', budget: '' });
            }}
            className="mt-6 text-sm text-slate-900 hover:underline font-semibold"
          >
            Kirim form baru →
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama */}
          <div>
            <label className="block text-xs font-mono font-medium uppercase tracking-wider text-slate-500 mb-2">
              Nama
            </label>
            <input
              type="text"
              required
              value={form.nama}
              onChange={(e) => set('nama')(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
            />
          </div>

          {/* Telepon */}
          <div>
            <label className="block text-xs font-mono font-medium uppercase tracking-wider text-slate-500 mb-2">
              No. HP / Whatsapp
            </label>
            <input
              type="tel"
              required
              value={form.telepon}
              onChange={(e) => set('telepon')(e.target.value)}
              onBlur={(e) => setPhoneError(validatePhone(e.target.value))}
              placeholder="Masukkan No. HP atau Whatsapp Anda"
              className={`w-full px-4 py-3 bg-slate-50 border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                phoneError ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-slate-900'
              }`}
            />
            {phoneError ? (
              <p className="text-xs text-red-500 mt-1">{phoneError}</p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">cth: 081234567890</p>
            )}
          </div>

          {/* Layanan */}
          <div>
            <label className="block text-xs font-mono font-medium uppercase tracking-wider text-slate-500 mb-2">
              Kategori/Layanan
            </label>
            <div className="relative">
              <select
                value={form.layanan}
                onChange={(e) => set('layanan')(e.target.value)}
                className="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-all pr-8 cursor-pointer"
              >
                <option value="">Pilih Kategori/Layanan</option>
                {LAYANAN.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                ▼
              </span>
            </div>
          </div>

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

          {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!form.nama || !form.telepon || saving}
                className="w-full py-4 bg-[#E87722] hover:bg-[#d0671a] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-lg text-xs font-mono uppercase tracking-widest font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <Send size={15} />
                <span>{saving ? "Memproses..." : "Konsultasi Sekarang"}</span>
              </button>
            </div>
        </form>
      )}
    </div>
  );
}

interface RadioGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}

function RadioGroup({ label, options, value, onChange }: RadioGroupProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono font-medium uppercase tracking-wider text-slate-500">
        {label}
      </label>
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
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
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