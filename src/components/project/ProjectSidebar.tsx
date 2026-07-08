"use client";

import { useState } from "react";
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
} from "react-icons/ri";
import MediaPicker, { MultipleMediaPicker } from "@/components/ui/MediaPicker";
import AutoResizeTextarea from "@/components/ui/AutoResizeTextarea";
import { Section, Field, inputCls, selectCls } from "@/components/project/FormControls";

type SidebarTab = "pos" | "blok";

interface TeamAssignment {
  teamId: string;
  role: string;
}

interface CategoryItem {
  id: string;
  name: string;
  slug?: string;
  type?: string;
}

interface TeamItem {
  id: string;
  name: string;
}

interface ProjectSidebarProps {
  editor: Editor | null;
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;

  // Pos tab fields
  status: string;
  setStatus: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  client: string;
  setClient: (v: string) => void;
  limasRole: string;
  setLimasRole: (v: string) => void;
  categories: CategoryItem[];
  setCategories: (v: CategoryItem[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (v: string[]) => void;
  teams: TeamItem[];
  setTeams: (v: TeamItem[]) => void;
  selectedTeams: TeamAssignment[];
  setSelectedTeams: (v: TeamAssignment[]) => void;
  coverImage: string;
  setCoverImage: (v: string) => void;
  gallery: string[];
  setGallery: (v: string[]) => void;
  title: string;
  seoTitle: string;
  setSeoTitle: (v: string) => void;
  seoDescription: string;
  setSeoDescription: (v: string) => void;
}

/** Generate slug sederhana dari nama, konsisten dengan logic slug judul project. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Form inline kecil untuk menambah kategori atau tim baru tanpa
 * meninggalkan sidebar. Dipakai untuk dua kasus (kategori & tim)
 * lewat props `onSubmit` yang berbeda.
 */
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
 * Sidebar kanan halaman editor project, berisi 2 tab:
 * - "Pos": status, info proyek, kategori, tim, media, SEO
 * - "Blok": setelan untuk blok/elemen yang sedang aktif di editor
 */
export default function ProjectSidebar({
  editor,
  activeTab,
  setActiveTab,
  status,
  setStatus,
  slug,
  setSlug,
  location,
  setLocation,
  client,
  setClient,
  limasRole,
  setLimasRole,
  categories,
  setCategories,
  selectedCategories,
  setSelectedCategories,
  teams,
  setTeams,
  selectedTeams,
  setSelectedTeams,
  coverImage,
  setCoverImage,
  gallery,
  setGallery,
  title,
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
}: ProjectSidebarProps) {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState(false);

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

  /** Kirim kategori baru ke API, lalu tambahkan ke list lokal & langsung centang. */
  const handleCreateCategory = async (name: string) => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug: slugify(name), type: "project" }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Gagal membuat kategori.");
    }
    const newCategory: CategoryItem = data.data;
    setCategories([...categories, newCategory]);
    setSelectedCategories([...selectedCategories, newCategory.id]);
  };

  /** Kirim tim baru ke API, lalu tambahkan ke list lokal & langsung centang. */
  const handleCreateTeam = async (name: string) => {
    const res = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Gagal membuat tim.");
    }
    const newTeam: TeamItem = data.data;
    setTeams([...teams, newTeam]);
    setSelectedTeams([...selectedTeams, { teamId: newTeam.id, role: "" }]);
  };

  return (
    <aside
      className="w-[280px] bg-white border-l overflow-y-auto flex flex-col flex-shrink-0 hidden md:flex min-h-0"
      style={{ borderColor: "#dcdcde" }}
    >
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
                <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
                  <option value="DRAFT">Draft (Belum Dipublikasikan)</option>
                  <option value="ONGOING">Ongoing (Sedang Berjalan)</option>
                  <option value="COMPLETED">Completed (Selesai)</option>
                </select>
              </Field>
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

            <Section title="Informasi Proyek">
              {[
                { label: "Lokasi", value: location, set: setLocation },
                { label: "Klien", value: client, set: setClient },
                { label: "Peran Limas", value: limasRole, set: setLimasRole },
              ].map(({ label, value, set }) => (
                <Field key={label} label={label}>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className={inputCls}
                  />
                </Field>
              ))}
            </Section>

            <hr style={{ borderColor: "#dcdcde" }} />

            {/* KATEGORI — checkbox list custom + tambah kategori inline */}
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

            {/* TIM LAPANGAN — multi-select checkbox + peran per tim + tambah tim inline */}
            <Section title="Tim Lapangan">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 max-h-44 overflow-y-auto space-y-2">
                {teams.length === 0 && <p className="text-[11px] text-slate-400 italic">Belum ada tim</p>}
                {teams.map((t) => {
                  const matched = selectedTeams.find((i) => i.teamId === t.id);
                  return (
                    <div key={t.id} className="space-y-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium select-none">
                        <input
                          type="checkbox"
                          checked={!!matched}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedTeams([...selectedTeams, { teamId: t.id, role: "" }]);
                            else setSelectedTeams(selectedTeams.filter((i) => i.teamId !== t.id));
                          }}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-[#E87722] accent-[#E87722] cursor-pointer"
                        />
                        {t.name}
                      </label>
                      {!!matched && (
                        <input
                          type="text"
                          value={matched.role}
                          onChange={(e) =>
                            setSelectedTeams(
                              selectedTeams.map((i) =>
                                i.teamId === t.id ? { ...i, role: e.target.value } : i
                              )
                            )
                          }
                          placeholder="Peran (cth: PM, Pengawas)"
                          className="w-full text-[11px] px-2 py-1 bg-white border border-slate-200 rounded focus:outline-none"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {showAddTeam ? (
                <InlineAddForm
                  placeholder="Nama anggota/tim baru..."
                  onSubmit={handleCreateTeam}
                  onCancel={() => setShowAddTeam(false)}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddTeam(true)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#E87722] border border-dashed border-[#E87722]/40 rounded-lg hover:bg-orange-50/50 transition"
                >
                  <RiAddLine size={13} /> Tambah Tim
                </button>
              )}
            </Section>

            <hr style={{ borderColor: "#dcdcde" }} />

            <Section title="Media">
              <Field label="Cover Image">
                <MediaPicker value={coverImage} onChange={setCoverImage} />
              </Field>
              <Field label="Galeri Proyek">
                <MultipleMediaPicker value={gallery} onChange={setGallery} />
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
    </aside>
  );
}