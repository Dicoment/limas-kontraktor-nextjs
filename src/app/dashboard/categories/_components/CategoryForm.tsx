"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Helper sederhana untuk mengubah string jadi slug
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")     // ganti spasi dengan -
    .replace(/[^\w\-]+/g, "") // hapus karakter non-word
    .replace(/\-\-+/g, "-");  // ganti -- dengan -
};

export function CategoryForm({ category }: { category?: any }) {
  const router = useRouter();
  const isEdit = !!category;
  
  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [type, setType] = useState(category?.type || "blog");
  const [description, setDescription] = useState(category?.description || "");
  
  // Track apakah user sudah edit slug manual
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!category?.slug);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Logic Auto-Slug
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugManuallyEdited) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    setIsSlugManuallyEdited(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEdit ? `/api/categories/${category.id}` : "/api/categories";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, type, description }),
      });
      
      const json = await res.json();
      if (json.success) {
        router.push("/dashboard/categories");
        router.refresh();
      } else {
        setError(json.error || "Gagal menyimpan kategori");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50">
        <h2 className="text-lg font-bold text-slate-800">{isEdit ? "Edit Category" : "New Category"}</h2>
        <p className="text-sm text-slate-500">Kelola kategori untuk blog atau project Anda</p>
      </div>

      <div className="p-6 space-y-6">
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Name</label>
            <input 
              value={name} 
              onChange={(e) => handleNameChange(e.target.value)} 
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#E87722]/20 focus:border-[#E87722] transition-all" 
              required 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Slug</label>
            <input 
              value={slug} 
              onChange={(e) => handleSlugChange(e.target.value)} 
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#E87722]/20 focus:border-[#E87722] transition-all" 
              required 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Type</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)} 
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#E87722]/20 focus:border-[#E87722] transition-all"
          >
            <option value="blog">Blog</option>
            <option value="project">Project</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            rows={4} 
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#E87722]/20 focus:border-[#E87722] transition-all" 
          />
        </div>
      </div>

      <div className="bg-slate-50 p-6 flex items-center justify-end gap-3">
        <Link 
          href="/dashboard/categories" 
          className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
        >
          Cancel
        </Link>
        <button 
          type="submit" 
          disabled={loading} 
          className="px-5 py-2 bg-[#E87722] hover:bg-[#d66a1d] text-white rounded-lg text-sm font-bold shadow-sm transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Category"}
        </button>
      </div>
    </form>
  );
}