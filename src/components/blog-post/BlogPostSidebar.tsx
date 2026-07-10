"use client";

import { useState, useEffect } from "react";
import type { Editor } from "@tiptap/react";
import {
  RiLayoutGridLine,
  RiSettings3Line,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiAlignJustify,
  RiRefreshLine,
  RiDoubleQuotesL,
  RiSearchLine,
  RiAddLine,
  RiCloseLine,
  RiLoader4Line,
  RiErrorWarningLine,
  RiPriceTag3Line,
} from "react-icons/ri";
import MediaPicker from "@/components/ui/MediaPicker";
import AutoResizeTextarea from "@/components/ui/AutoResizeTextarea";
import { Section, Field, inputCls, selectCls } from "@/components/project/FormControls";

type SidebarTab = "pos" | "blok";

interface CategoryItem {
  id: string;
  name: string;
  slug?: string;
  type?: string;
}

interface TagItem {
  id: string;
  name: string;
  slug?: string;
}

interface BlogPostSidebarProps {
  editor: Editor | null;
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  open: boolean;

  // Status pakai boolean (published), BEDA sama Project yang enum 3-state.
  published: boolean;
  setPublished: (v: boolean) => void;
  publishedAt?: string | Date | null;

  slug: string;
  setSlug: (v: string) => void;
  excerpt: string;
  setExcerpt: (v: string) => void;

  categories: CategoryItem[];
  setCategories: (v: CategoryItem[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (v: string[]) => void;

  tags: TagItem[];
  setTags: (v: TagItem[]) => void;
  selectedTags: string[];
  setSelectedTags: (v: string[]) => void;

  coverImage: string;
  setCoverImage: (v: string) => void;

  title: string;
  seoTitle: string;
  setSeoTitle: (v: string) => void;
  seoDescription: string;
  setSeoDescription: (v: string) => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Sama persis kayak versi di ProjectSidebar — form inline kecil buat nambah
 * kategori/tag baru tanpa ninggalin sidebar. */
function InlineAddForm({
  placeholder,
  onSubmit,
  onCancel,
}: {
  placeholder: string;
  onSubmit: (name: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      await onSubmit(name.trim());
      setName("");
      onCancel();
    } catch (err: any) {
      setError(err.message || "Gagal menambahkan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-1.5 bg-orange-50/50 border border-orange-200 rounded-lg p-2">
      <div className="flex gap-1.5">
        <input
          type="text"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
            if (e.key === "Escape") onCancel();
          }}
          placeholder={placeholder}
          disabled={loading}
          className="flex-1 text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E87722]/40 focus:border-[#E87722] disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !name.trim()}
          className="px-2.5 py-1.5 text-xs font-bold bg-[#E87722] text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-40 flex items-center justify-center min-w-[34px]"
        >
          {loading ? <RiLoader4Line className="animate-spin" size={13} /> : "OK"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-2 py-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white transition disabled:opacity-50"
        >
          <RiCloseLine size={14} />
        </button>
      </div>
      {error && (
        <div className="flex items-center gap-1.5 text-red-600 text-[11px]">
          <RiErrorWarningLine size={12} /> {error}
        </div>
      )}
    </div>
  );
}

/**
 * Sidebar kanan editor Blog Post. Struktur & fix reaktivitas sama persis
 * kayak ProjectSidebar, TAPI:
 * - Section "Tim Lapangan" DIHAPUS (blog gak punya konsep tim)
 * - Field "Galeri Proyek" DIHAPUS (blog cuma punya 1 cover image, gak ada gallery di schema)
 * - Section "Kategori" -> Location/Client/LimasRole diganti "Excerpt" (field asli di schema BlogPost)
 * - Section "Tags" BARU (blog punya relasi Tag yang project gak punya)
 * - Status jadi toggle Draft/Published (boolean), bukan select 3-opsi
 */
export default function BlogPostSidebar({
  editor,
  activeTab,
  setActiveTab,
  open,
  published,
  setPublished,
  publishedAt,
  slug,
  setSlug,
  excerpt,
  setExcerpt,
  categories,
  setCategories,
  selectedCategories,
  setSelectedCategories,
  tags,
  setTags,
  selectedTags,
  setSelectedTags,
  coverImage,
  setCoverImage,
  title,
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
}: BlogPostSidebarProps) {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);

  // Fix reaktivitas Tiptap — sama persis kayak ProjectSidebar.
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const rerender = () => forceUpdate((n) => n + 1);
    editor.on("transaction", rerender);
    editor.on("selectionUpdate", rerender);
    return () => {
      editor.off("transaction", rerender);
      editor.off("selectionUpdate", rerender);
    };
  }, [editor]);

  const getBlockInfo = () => {
    if (!editor) return { type: "Paragraf", level: null as number | null, align: "left" };
    const hAttrs = editor.getAttributes("heading");
    const pAttrs = editor.getAttributes("paragraph");
    const align = hAttrs.textAlign || pAttrs.textAlign || "left";
    if (editor.isActive("heading")) return { type: "Heading", level: hAttrs.level, align };
    if (editor.isActive("blockquote")) return { type: "Kutipan", level: null, align };
    if (editor.isActive("bulletList")) return { type: "Daftar Poin", level: null, align };
    if (editor.isActive("orderedList")) return { type: "Daftar Angka", level: null, align };
    if (editor.isActive("image")) return { type: "Gambar", level: null, align };
    return { type: "Paragraf", level: null, align };
  };
  const blockInfo = getBlockInfo();

  /** Kategori blog — type "blog" biar konsisten sama fix filter type kemarin
   * (jangan sampai kategori project ikut nyampur di sini juga). */
  const handleCreateCategory = async (name: string) => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug: slugify(name), type: "blog" }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Gagal membuat kategori.");
    }
    const newCategory: CategoryItem = data.data;
    setCategories([...categories, newCategory]);
    setSelectedCategories([...selectedCategories, newCategory.id]);
  };

  // ASUMSI: endpoint /api/tags belum pernah saya lihat, dibikin mengikuti
  // pola persis /api/categories. Tag di schema gak punya field `type`,
  // jadi gak dikirim. Sesuaikan kalau ternyata endpoint aslinya beda.
  const handleCreateTag = async (name: string) => {
    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug: slugify(name) }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Gagal membuat tag.");
    }
    const newTag: TagItem = data.data;
    setTags([...tags, newTag]);
    setSelectedTags([...selectedTags, newTag.id]);
  };

  return (
    <aside
      className={`bg-white border-l flex flex-col flex-shrink-0 min-h-0 hidden md:flex overflow-hidden transition-[width] duration-200 ease-in-out ${
        open ? "w-[280px]" : "w-0 border-l-0"
      }`}
      style={{ borderColor: "#dcdcde" }}
      aria-hidden={!open}
    >
      <div className="w-[280px] flex flex-col flex-1 min-h-0 overflow-y-auto">
        <div className="flex border-b flex-shrink-0" style={{ borderColor: "#dcdcde" }}>
          {(["pos", "blok"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
                activeTab === t
                  ? "border-[#E87722] text-[#E87722]"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              {t === "pos" ? (
                <>
                  <RiLayoutGridLine size={13} /> Pos
                </>
              ) : (
                <>
                  <RiSettings3Line size={13} /> Blok
                </>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-5 flex-1">
          {activeTab === "pos" ? (
            <>
              <Section title="Status & Publikasi">
                <Field label="Status">
                  <select
                    value={published ? "true" : "false"}
                    onChange={(e) => setPublished(e.target.value === "true")}
                    className={selectCls}
                  >
                    <option value="false">Draft (Belum Dipublikasikan)</option>
                    <option value="true">Published (Tayang)</option>
                  </select>
                </Field>
                {published && publishedAt && (
                  <p className="text-[10px] text-slate-400">
                    Tayang sejak: {new Date(publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
                <Field label="Slug URL">
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className={`${inputCls} font-mono`}
                  />
                </Field>
              </Section>

              <hr style={{ borderColor: "#dcdcde" }} />

              <Section title="Ringkasan Artikel">
                <Field label="Excerpt">
                  <AutoResizeTextarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Cuplikan singkat buat kartu di halaman list blog..."
                    rows={3}
                    className={`${inputCls} resize-none`}
                  />
                </Field>
              </Section>

              <hr style={{ borderColor: "#dcdcde" }} />

              {/* KATEGORI — identik sama ProjectSidebar */}
              <Section title="Kategori">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 max-h-36 overflow-y-auto space-y-1.5">
                  {categories.length === 0 && (
                    <p className="text-[11px] text-slate-400 italic">Belum ada kategori</p>
                  )}
                  {categories.map((c) => {
                    const isChecked = selectedCategories.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) setSelectedCategories(selectedCategories.filter((id) => id !== c.id));
                            else setSelectedCategories([...selectedCategories, c.id]);
                          }}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-[#E87722] accent-[#E87722] cursor-pointer"
                        />
                        {c.name}
                      </label>
                    );
                  })}
                </div>

                {showAddCategory ? (
                  <InlineAddForm
                    placeholder="Nama kategori baru..."
                    onSubmit={handleCreateCategory}
                    onCancel={() => setShowAddCategory(false)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(true)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#E87722] border border-dashed border-[#E87722]/40 rounded-lg hover:bg-orange-50/50 transition"
                  >
                    <RiAddLine size={13} /> Tambah Kategori
                  </button>
                )}
              </Section>

              {/* TAGS — baru, gak ada di ProjectSidebar. Pola sama kayak Kategori,
                  cuma gak ada field tambahan per-item (Tim punya "role", Tags enggak) */}
              <Section title="Tags">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 max-h-36 overflow-y-auto">
                  {tags.length === 0 && (
                    <p className="text-[11px] text-slate-400 italic">Belum ada tag</p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => {
                      const isChecked = selectedTags.includes(t.id);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            if (isChecked) setSelectedTags(selectedTags.filter((id) => id !== t.id));
                            else setSelectedTags([...selectedTags, t.id]);
                          }}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition ${
                            isChecked
                              ? "bg-[#E87722] text-white border-transparent"
                              : "bg-white text-slate-600 border-slate-200 hover:border-[#E87722]/40"
                          }`}
                        >
                          <RiPriceTag3Line size={11} /> {t.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {showAddTag ? (
                  <InlineAddForm
                    placeholder="Nama tag baru..."
                    onSubmit={handleCreateTag}
                    onCancel={() => setShowAddTag(false)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddTag(true)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#E87722] border border-dashed border-[#E87722]/40 rounded-lg hover:bg-orange-50/50 transition"
                  >
                    <RiAddLine size={13} /> Tambah Tag
                  </button>
                )}
              </Section>

              <hr style={{ borderColor: "#dcdcde" }} />

              {/* MEDIA — cuma Cover Image, gak ada Galeri (blog gak punya field gallery di schema) */}
              <Section title="Media">
                <Field label="Cover Image">
                  <MediaPicker value={coverImage} onChange={setCoverImage} />
                </Field>
              </Section>

              <hr style={{ borderColor: "#dcdcde" }} />

              <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                <h3 className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <RiSearchLine size={14} /> SEO
                </h3>
                <Field label="SEO Title">
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={title || "Judul di Google"}
                    className={inputCls}
                  />
                </Field>
                <Field label="SEO Description">
                  <AutoResizeTextarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Deskripsi di Google..."
                    rows={2}
                    className={`${inputCls} resize-none`}
                  />
                </Field>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Setelan Blok Aktif</h3>
              <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-200 overflow-hidden">
                <div className="p-3 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block">Tipe</span>
                  <span className="text-sm font-bold text-[#0F2340]">{blockInfo.type}</span>
                </div>

                {editor?.isActive("heading") && (
                  <div className="p-3 space-y-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block">Tingkatan Heading</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[1, 2, 3, 4, 5, 6].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => editor.chain().focus().setHeading({ level: lvl as any }).run()}
                          className={`py-1.5 text-xs font-bold rounded border transition ${
                            blockInfo.level === lvl
                              ? "bg-[#E87722] text-white border-transparent"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          H{lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3 space-y-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block">Rata Teks</span>
                  <div className="flex gap-1">
                    {(["left", "center", "right", "justify"] as const).map((align) => {
                      const Icon = {
                        left: RiAlignLeft,
                        center: RiAlignCenter,
                        right: RiAlignRight,
                        justify: RiAlignJustify,
                      }[align];
                      return (
                        <button
                          key={align}
                          type="button"
                          onClick={() => editor?.chain().focus().setTextAlign(align).run()}
                          className={`p-1.5 rounded border w-8 h-8 flex items-center justify-center transition ${
                            blockInfo.align === align
                              ? "bg-[#E87722] text-white border-transparent"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <Icon size={13} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 space-y-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block">Transformasi</span>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().setParagraph().run()}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 transition"
                  >
                    <RiRefreshLine size={12} /> Jadikan Paragraf
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 transition"
                  >
                    <RiDoubleQuotesL size={12} /> Jadikan Kutipan
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().setHeading({ level: 2 }).run()}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 transition"
                  >
                    <span className="text-[10px] font-black">H2</span> Jadikan Heading 2
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}