"use client";

import { useState, useEffect } from "react";
import { FaUserPlus, FaTrash } from "react-icons/fa6";

interface UserItem {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersSection({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const json = await res.json();
      setUsers(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!email || !password) {
      setErrorMsg("Email dan password wajib diisi.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menambah user");

      setName(""); setEmail(""); setPassword("");
      setShowForm(false);
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus user ini?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) {
      alert(json.error || "Gagal menghapus user");
      return;
    }
    fetchUsers();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-[#0F2340] px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
        <h2 className="font-bold text-white text-xs uppercase tracking-wider">Kelola User Admin</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-white bg-[#E87722] px-3 py-1.5 rounded-lg hover:bg-orange-600 transition"
        >
          <FaUserPlus size={11} /> Tambah User
        </button>
      </div>

      <div className="p-6 space-y-4">
        {showForm && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            {errorMsg && <p className="text-xs text-red-600 font-medium">{errorMsg}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama" className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#E87722]" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#E87722]" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min. 6 karakter)" className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#E87722]" />
            </div>
            <button
              onClick={handleAddUser}
              disabled={submitting}
              className="px-4 py-2 bg-[#0F2340] text-white text-xs font-bold rounded-lg hover:bg-[#152e54] transition disabled:opacity-50"
            >
              {submitting ? "Menyimpan..." : "Simpan User"}
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-xs text-slate-400">Memuat...</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-bold text-slate-800">{u.name || "-"} {u.id === currentUserId && <span className="text-[10px] text-[#E87722]">(kamu)</span>}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
                {u.id !== currentUserId && (
                  <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 p-1.5">
                    <FaTrash size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}