"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FaRegClock, FaMagnifyingGlass, FaXmark, FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { IoArrowForwardSharp } from "react-icons/io5";

interface CategoryRef {
  categoryId: string;
  catEntry: { id: string; name: string };
}

interface BlogPostLite {
  id: string;
  slug: string;
  title: string;
  coverImage: string | null;
  excerpt: string | null;
  content: string | null;
  published: boolean;
  publishedAt: Date | null;
  blogPostCategories: CategoryRef[];
}

interface BlogListClientProps {
  posts: BlogPostLite[];
  currentPage: number; // Tambahan props untuk halaman aktif
  totalPages: number;  // Tambahan props untuk total halaman dari server
}

function formatDate(date: Date | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).toUpperCase();
}

export default function BlogListClient({ posts, currentPage, totalPages }: BlogListClientProps) {
  const [searchInput, setSearchInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Generator URL dinamis untuk pagination agar tidak tabrakan dengan filter search/category yang aktif
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allCategories = useMemo(() => {
    const map = new Map<string, string>();
    posts.forEach((post) => {
      post.blogPostCategories.forEach((c) => {
        map.set(c.categoryId, c.catEntry.name);
      });
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesQuery =
        !activeQuery || post.title.toLowerCase().includes(activeQuery.toLowerCase());
      const matchesCategory =
        !activeCategory || post.blogPostCategories.some((c) => c.categoryId === activeCategory);
      return matchesQuery && matchesCategory;
    });
  }, [posts, activeQuery, activeCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput("");
    setActiveQuery("");
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen font-sans antialiased text-[#0F2340]">
      
      {/* ── HERO HEADER ── */}
      <div className="bg-[#0F2340] text-white relative overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 pt-36 pb-20 relative z-10 flex flex-col items-center text-center">
          <div className="max-w-3xl flex flex-col items-center">
            <span className="text-[#E87722] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              LIMAS KONTRAKTOR INSIGHT
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.15] uppercase mb-6">
              Blog & Inspirasi <span className="text-[#E87722]">Rancang Bangun</span>
            </h1>
            <p className="text-white/80 text-xs sm:text-sm md:text-base max-w-2xl font-light leading-relaxed mb-10">
              Temukan tips konstruksi profesional, tren arsitektur terkini, dan dokumentasi berkala proyek terbaik kami langsung dari lapangan.
            </p>

            <form onSubmit={handleSearchSubmit} className="w-full max-w-xl">
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-2 focus-within:border-[#E87722] transition-all duration-300">
                <div className="flex items-center flex-1 pl-3 gap-3">
                  <FaMagnifyingGlass size={16} className="text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Cari ide, tips arsitektur, atau proyek..."
                    className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-400 outline-none py-2"
                  />
                  {searchInput && (
                    <button type="button" onClick={clearSearch} className="text-slate-400 hover:text-white transition">
                      <FaXmark size={16} />
                    </button>
                  )}
                </div>
                <button type="submit" className="px-5 py-2.5 text-xs font-bold bg-[#E87722] text-white rounded-lg hover:bg-orange-600 transition uppercase tracking-wider flex-shrink-0">
                  Cari
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── FILTER KATEGORI ── */}
      {allCategories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors border ${
                activeCategory === null
                  ? "bg-[#0F2340] text-white border-[#0F2340]"
                  : "bg-white text-slate-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Semua Artikel
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors border ${
                  activeCategory === cat.id
                    ? "bg-[#0F2340] text-white border-[#0F2340]"
                    : "bg-white text-slate-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── MAIN GRID ARTICLES ── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 max-w-md mx-auto px-6">
            <h3 className="text-sm font-bold text-[#0F2340] uppercase tracking-wide">Artikel Tidak Ditemukan</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="group bg-white rounded-2xl p-5 flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-transparent hover:shadow-[0_10px_35px_rgba(0,0,0,0.05)] transition-all duration-300 relative">
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl mb-5 bg-slate-50">
                    <Link href={`/blog/${post.slug || post.id}`} className="block w-full h-full">
                      {post.coverImage ? (
                        <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-104" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-400 text-xs font-mono">NO IMAGE</div>
                      )}
                    </Link>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.blogPostCategories.map((cat) => (
                      <span key={cat.categoryId} className="text-xs font-bold uppercase tracking-wider text-[#E87722]">
                        {cat.catEntry.name}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 tracking-wide uppercase">
                      <FaRegClock size={12} className="shrink-0 text-slate-300" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <h2 className="text-[19px] font-bold tracking-tight text-neutral-800 leading-snug">
                      <Link href={`/blog/${post.slug || post.id}`} className="hover:text-[#E87722] transition-colors line-clamp-2">
                        {post.title}
                      </Link>
                    </h2>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-6 border-t border-gray-100/80">
                  <Link href={`/blog/${post.slug || post.id}`} className="text-xs font-bold uppercase tracking-wider text-[#0F2340] hover:text-[#E87722] transition-colors">
                    Read More
                  </Link>
                  <Link href={`/blog/${post.slug || post.id}`} className="w-9 h-9 rounded-full bg-[#0F2340] text-white hover:bg-[#E87722] flex items-center justify-center shadow-sm transition-all duration-300">
                    <IoArrowForwardSharp size={14} className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── 4. PAGINATION DYNAMICALLY LINKED TO PRISMA SERVER ── */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-16">
            <nav className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
              
              {/* Tombol Prev */}
              {currentPage > 1 ? (
                <Link href={createPageUrl(currentPage - 1)} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-50">
                  <FaAngleLeft size={12} />
                </Link>
              ) : (
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-200 cursor-not-allowed">
                  <FaAngleLeft size={12} />
                </span>
              )}

              {/* Looping Halaman Eksis */}
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1;
                const isCurrent = pageNum === currentPage;
                return (
                  <Link
                    key={pageNum}
                    href={createPageUrl(pageNum)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isCurrent
                        ? "bg-[#0F2340] text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}

              {/* Tombol Next */}
              {currentPage < totalPages ? (
                <Link href={createPageUrl(currentPage + 1)} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-50">
                  <FaAngleRight size={12} />
                </Link>
              ) : (
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-200 cursor-not-allowed">
                  <FaAngleRight size={12} />
                </span>
              )}

            </nav>
          </div>
        )}
      </section>

    </div>
  );
}