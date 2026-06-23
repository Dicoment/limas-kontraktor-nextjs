"use client";

import type { Editor } from "@tiptap/react";
import {
  RiLayoutGridLine,
  RiSettings3Line,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiAlignJustify,
  RiRefreshLine,
  RiDoubleQuotesL, RiSearchLine,
} from "react-icons/ri";
import MediaPicker, { MultipleMediaPicker } from "@/components/ui/MediaPicker";
import AutoResizeTextarea from "@/components/ui/AutoResizeTextarea";
import { Section, Field, inputCls, selectCls } from "@/components/project/FormControls";

type SidebarTab = "pos" | "blok";

interface TeamAssignment {
  teamId: string;
  role: string;
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
  categories: any[];
  selectedCategories: string[];
  setSelectedCategories: (v: string[]) => void;
  teams: any[];
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
  selectedCategories,
  setSelectedCategories,
  teams,
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

            <Section title="Kategori">
              <select
                multiple
                value={selectedCategories}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions);
                  setSelectedCategories(options.map((opt) => opt.value));
                }}
                className={`${selectCls} h-32`}
              >
                {categories.length === 0 && (
                  <option value="" disabled>Belum ada kategori</option>
                )}
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Section>

            <Section title="Tim Lapangan">
              <div className="space-y-3">
                <Field label="Tim Utama">
                  <select
                    value={selectedTeams[0]?.teamId || ""}
                    onChange={(e) => {
                      const teamId = e.target.value;
                      setSelectedTeams(teamId ? [{ teamId, role: "" }] : []);
                    }}
                    className={selectCls}
                  >
                    <option value="">Pilih tim</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </Field>
                {selectedTeams[0] && (
                  <Field label="Peran">
                    <input
                      type="text"
                      value={selectedTeams[0].role || ""}
                      onChange={(e) =>
                        setSelectedTeams([{ ...selectedTeams[0], role: e.target.value }])
                      }
                      placeholder="cth: PM, Pengawas"
                      className={inputCls}
                    />
                  </Field>
                )}
              </div>
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