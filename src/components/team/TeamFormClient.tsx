"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RiErrorWarningLine, RiCloseLine } from "react-icons/ri";
import MediaPicker from "@/components/ui/MediaPicker";
import { createTeam, updateTeam } from "@/actions/misc.actions";

interface TeamFormClientProps {
  initialData?: {
    id: string;
    name: string;
    position: string | null;
    bio: string | null;
    avatar: string | null;
    email: string | null;
    phone: string | null;
    displayOrder: number;
  };
}

export default function TeamFormClient({ initialData }: TeamFormClientProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? "");
  const [position, setPosition] = useState(initialData?.position ?? "");
  const [bio, setBio] = useState(initialData?.bio ?? "");
  const [avatar, setAvatar] = useState(initialData?.avatar ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [displayOrder, setDisplayOrder] = useState(initialData?.displayOrder ?? 0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrorMsg("Nama wajib diisi.");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    const payload = {
      name,
      position: position || null,
      bio: bio || null,
      avatar: avatar || null,
      email: email || null,
      phone: phone || null,
      displayOrder,
    };

    try {
      if (initialData) await updateTeam(initialData.id, payload);
      else await createTeam(payload);

      router.push("/dashboard/teams");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-800">{initialData ? "Edit Tim" : "Tambah Tim Baru"}</h1>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 text-xs font-bold bg-[#E87722] text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg flex items-center gap-2 text-red-700 text-xs">
          <RiErrorWarningLine size={14} /> {errorMsg}
          <button type="button" onClick={() => setErrorMsg("")} className="ml-auto text-red-400 hover:text-red-600">
            <RiCloseLine size={14} />
          </button>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Foto</label>
        <MediaPicker value={avatar} onChange={setAvatar} placeholder="Pilih foto profil..." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#E87722]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Posisi/Jabatan</label>
          <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Cth: Project Manager" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#E87722]" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bio Singkat</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          placeholder="1-3 kalimat ringkasan profesional..."
          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#E87722] resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#E87722]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Telepon</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#E87722]" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Urutan Tampil</label>
        <input
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
          className="w-32 px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#E87722]"
        />
      </div>
    </div>
  );
}