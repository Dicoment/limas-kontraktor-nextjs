"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const slugify = (text: string) => text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");

export function TagForm({ tag }: { tag?: any }) {
  const router = useRouter();
  const isEdit = !!tag;
  const [name, setName] = useState(tag?.name || "");
  const [slug, setSlug] = useState(tag?.slug || "");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!tag?.slug);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEdit ? `/api/tags/${tag.id}` : "/api/tags";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });
      const json = await res.json();
      if (json.success) {
        router.push("/dashboard/tags");
        router.refresh();
      } else {
        setError(json.error || "Gagal menyimpan tag");
      }
    } catch (err) { setError("Sistem error"); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50">
        <h2 className="text-lg font-bold text-slate-800">{isEdit ? "Edit Tag" : "New Tag"}</h2>
      </div>
      <div className="p-6 space-y-6">
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5"><label className="text-sm font-semibold">Name</label>
            <input value={name} onChange={(e) => { setName(e.target.value); if(!isSlugManuallyEdited) setSlug(slugify(e.target.value)); }} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E87722]/20" required />
          </div>
          <div className="space-y-1.5"><label className="text-sm font-semibold">Slug</label>
            <input value={slug} onChange={(e) => { setSlug(e.target.value); setIsSlugManuallyEdited(true); }} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E87722]/20" required />
          </div>
        </div>
      </div>
      <div className="bg-slate-50 p-6 flex justify-end gap-3">
        <Link href="/dashboard/tags" className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800">Cancel</Link>
        <button type="submit" disabled={loading} className="px-5 py-2 bg-[#E87722] text-white rounded-lg text-sm font-bold shadow-sm">{loading ? "Saving..." : "Save Changes"}</button>
      </div>
    </form>
  );
}