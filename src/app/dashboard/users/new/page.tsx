"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RiErrorWarningLine, RiCloseLine } from "react-icons/ri";
import { createUser } from "@/actions/user.actions";

export default function NewUserPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      setErrorMsg("Email dan password wajib diisi.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      await createUser({ name, email, password });
      router.push("/dashboard/users");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menambah user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-800">Tambah User Baru</h1>
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
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#E87722]" />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#E87722]" />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#E87722]" />
      </div>
       <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-4 w-full text-sm font-bold bg-[#E87722] text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
    </div>
  );
}