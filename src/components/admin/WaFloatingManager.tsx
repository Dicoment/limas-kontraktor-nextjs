"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RiWhatsappLine, RiAddLine, RiDeleteBin6Line, RiEditLine, RiCloseLine } from "react-icons/ri";
import {
  createWaContact, updateWaContact, deleteWaContact, updateWaWidgetSettings,
} from "@/actions/wa-contact.actions";

interface WaContact {
  id: string;
  name: string;
  position: string | null;
  phone: string;
  active: boolean;
  displayOrder: number;
}

interface WaSettings {
  enabled: boolean;
  title: string;
  hours: string;
  tooltip: string;
  message: string;
}

export default function WaFloatingManager({
  initialSettings,
  initialContacts,
}: {
  initialSettings: WaSettings;
  initialContacts: WaContact[];
}) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [savingSettings, setSavingSettings] = useState(false);

  const [contacts, setContacts] = useState(initialContacts);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", position: "", phone: "" });
  const [savingContact, setSavingContact] = useState(false);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    await updateWaWidgetSettings(settings);
    setSavingSettings(false);
    router.refresh();
  };

  const resetForm = () => {
    setForm({ name: "", position: "", phone: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (c: WaContact) => {
    setForm({ name: c.name, position: c.position || "", phone: c.phone });
    setEditingId(c.id);
    setShowForm(true);
  };

  const handleSaveContact = async () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    setSavingContact(true);
    try {
      if (editingId) {
        const updated = await updateWaContact(editingId, { name: form.name, position: form.position || null, phone: form.phone });
        // FIX: sebelumnya cuma router.refresh() dan nunggu server round-trip
        // buat update tampilan — state lokal `contacts` gak pernah kesync ulang
        // dari prop baru (useState cuma baca prop sekali pas mount). Sekarang
        // langsung update array-nya di sini pakai hasil return action-nya.
        setContacts((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...updated } : c)));
      } else {
        const created = await createWaContact({ name: form.name, position: form.position || null, phone: form.phone, displayOrder: contacts.length });
        setContacts((prev) => [...prev, created]);
      }
      resetForm();
    } finally {
      setSavingContact(false);
    }
  };

  const toggleActive = async (c: WaContact) => {
    setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)));
    await updateWaContact(c.id, { active: !c.active });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kontak WA ini?")) return;
    setContacts((prev) => prev.filter((c) => c.id !== id));
    await deleteWaContact(id);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-lg font-bold text-slate-800">WhatsApp Floating Widget</h1>
        <p className="text-xs text-slate-500 mt-0.5">Atur tombol WA melayang di halaman publik</p>
      </div>

      {/* SETTINGS TEKS WIDGET */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-[#0F2340] px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-white text-xs uppercase tracking-wider">Pengaturan Widget</h2>
          <label className="flex items-center gap-2 text-xs text-white font-semibold cursor-pointer">
            <input type="checkbox" checked={settings.enabled} onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })} className="accent-[#25D366]" />
            Aktif
          </label>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Judul Panel</label>
            <input value={settings.title} onChange={(e) => setSettings({ ...settings, title: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#E87722]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jam Operasional</label>
            <input value={settings.hours} onChange={(e) => setSettings({ ...settings, hours: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#E87722]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Teks Tooltip (bubble kecil di sebelah tombol)</label>
            <input value={settings.tooltip} onChange={(e) => setSettings({ ...settings, tooltip: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#E87722]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pesan Otomatis (langsung keisi pas visitor klik chat)</label>
            <textarea
              value={settings.message}
              onChange={(e) => setSettings({ ...settings, message: e.target.value })}
              rows={2}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#E87722] resize-none"
            />
          </div>
          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button onClick={handleSaveSettings} disabled={savingSettings} className="px-4 py-2 text-xs font-bold bg-[#E87722] text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50">
              {savingSettings ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
          </div>
        </div>
      </div>

      {/* KONTAK WA — daftar admin yang muncul di panel */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-[#0F2340] px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-white text-xs uppercase tracking-wider">Kontak Admin ({contacts.length})</h2>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-white bg-[#E87722] px-3 py-1.5 rounded-lg hover:bg-orange-600 transition">
            <RiAddLine size={13} /> Tambah
          </button>
        </div>

        <div className="p-6 space-y-4">
          {showForm && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">{editingId ? "Edit Kontak" : "Kontak Baru"}</span>
                <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><RiCloseLine size={16} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama (cth: Chris)" className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#E87722]" />
                <input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Posisi (cth: Marketing Kontraktor)" className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#E87722]" />
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Nomor WA (cth: 6281234567890)" className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#E87722]" />
              </div>
              <button onClick={handleSaveContact} disabled={savingContact} className="px-4 py-2 bg-[#0F2340] text-white text-xs font-bold rounded-lg hover:bg-[#152e54] transition disabled:opacity-50">
                {savingContact ? "Menyimpan..." : "Simpan Kontak"}
              </button>
            </div>
          )}

          {contacts.length === 0 && !showForm && (
            <p className="text-xs text-slate-400 italic">Belum ada kontak WA. Tambah dulu biar widget-nya kepake.</p>
          )}

          <div className="divide-y divide-slate-100">
            {contacts.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                    <RiWhatsappLine size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{c.name} {c.position && <span className="font-normal text-slate-500">— {c.position}</span>}</p>
                    <p className="text-xs text-slate-500">{c.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 mr-2 cursor-pointer">
                    <input type="checkbox" checked={c.active} onChange={() => toggleActive(c)} className="accent-[#25D366]" /> Aktif
                  </label>
                  <button onClick={() => startEdit(c)} className="p-1.5 text-slate-400 hover:text-[#E87722]"><RiEditLine size={14} /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 text-red-400 hover:text-red-600"><RiDeleteBin6Line size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}