"use client"

import { useState } from "react"
import { Editor } from "@tiptap/react"
import { LayoutGrid, Sliders, RefreshCw } from "lucide-react"

import MediaPicker from "@/components/ui/MediaPicker"
import { MultipleMediaPicker } from "@/components/ui/multiple-media-picker"
import AutoResizeTextarea from "./AutoResizeTextarea"

interface SidebarTabsProps {
  editor: Editor | null
  categories: any[]
  teams: any[]
  title: string
  slug: string
  setSlug: (val: string) => void
  location: string
  setLocation: (val: string) => void
  client: string
  setClient: (val: string) => void
  limasRole: string
  setLimasRole: (val: string) => void
  status: string
  setStatus: (val: string) => void
  coverImage: string
  setCoverImage: (val: string) => void
  gallery: string[]
  setGallery: (val: string[]) => void
  seoTitle: string
  setSeoTitle: (val: string) => void
  seoDescription: string
  setSeoDescription: (val: string) => void
  selectedCategories: string[]
  setSelectedCategories: (val: string[]) => void
  selectedTeams: { teamId: string; role: string }[]
  setSelectedTeams: (val: { teamId: string; role: string }[]) => void
}

export default function SidebarTabs({
  editor,
  categories,
  teams,
  title,
  slug,
  setSlug,
  location,
  setLocation,
  client,
  setClient,
  limasRole,
  setLimasRole,
  status,
  setStatus,
  coverImage,
  setCoverImage,
  gallery,
  setGallery,
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  selectedCategories,
  setSelectedCategories,
  selectedTeams,
  setSelectedTeams
}: SidebarTabsProps) {
  const [activeTab, setActiveTab] = useState<"pos" | "blok">("pos")

  // Analisis Node aktif dari Tiptap
  const getActiveBlockInfo = () => {
    if (!editor) return null;
    if (editor.isActive("heading")) {
      return { type: "Heading", level: editor.getAttributes("heading").level };
    }
    if (editor.isActive("blockquote")) return { type: "Kutipan (Blockquote)" };
    if (editor.isActive("bulletList")) return { type: "Daftar Poin (Bullet List)" };
    if (editor.isActive("orderedList")) return { type: "Daftar Angka (Ordered List)" };
    return { type: "Paragraf Teks Standar" };
  }

  const blockInfo = getActiveBlockInfo();

  return (
    <aside className="w-80 lg:w-[350px] bg-white border-l border-slate-200 overflow-y-auto flex flex-col flex-shrink-0 select-none hidden md:flex">
      <div className="flex border-b border-slate-200 bg-slate-50 p-1 flex-shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("pos")}
          className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeTab === "pos" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <LayoutGrid size={13} /> Proyek (Pos)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("blok")}
          className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeTab === "blok" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sliders size={13} /> Blok
        </button>
      </div>

      <div className="p-4 space-y-6 flex-1">
        {activeTab === "pos" ? (
          <>
            {/* STATUS & PUBLIKASI */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status & Publikasi</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Status Proyek</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none">
                  <option value="DRAFT">Draft</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Slug Proyek</label>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none" />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* INFORMASI FISIK */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Informasi Fisik</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Lokasi</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Klien</label>
                <input type="text" value={client} onChange={(e) => setClient(e.target.value)} className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Peran Limas</label>
                <input type="text" value={limasRole} onChange={(e) => setLimasRole(e.target.value)} className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none" />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* KATEGORI & TIM */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Klasifikasi & Tim</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kategori</label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 max-h-32 overflow-y-auto space-y-1.5">
                  {categories.map((c) => {
                    const isChecked = selectedCategories.includes(c.id)
                    return (
                      <label key={c.id} className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) setSelectedCategories(selectedCategories.filter(id => id !== c.id))
                            else setSelectedCategories([...selectedCategories, c.id])
                          }}
                          className="rounded border-slate-300 text-[#E87722]"
                        />
                        <span>{c.name}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tim Lapangan</label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-2 max-h-40 overflow-y-auto">
                  {teams.map((t) => {
                    const matchedTeam = selectedTeams.find(item => item.teamId === t.id)
                    return (
                      <div key={t.id} className="space-y-1">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                          <input 
                            type="checkbox" 
                            checked={!!matchedTeam}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedTeams([...selectedTeams, { teamId: t.id, role: "" }])
                              else setSelectedTeams(selectedTeams.filter(item => item.teamId !== t.id))
                            }}
                            className="rounded border-slate-300 text-[#E87722]"
                          />
                          <span>{t.name}</span>
                        </label>
                        {!!matchedTeam && (
                          <input 
                            type="text" 
                            value={matchedTeam.role} 
                            onChange={(e) => {
                              setSelectedTeams(selectedTeams.map(item => item.teamId === t.id ? { ...item, role: e.target.value } : item))
                            }}
                            placeholder="Peran (cth: PM)" 
                            className="w-full text-[11px] px-2 py-1 bg-white border border-slate-200 rounded focus:outline-none"
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* MEDIA */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Media Konten</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Cover Image</label>
                <MediaPicker value={coverImage} onChange={setCoverImage} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Galeri Proyek</label>
                <MultipleMediaPicker value={gallery} onChange={setGallery} />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* SEO */}
            <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
              <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">🔍 Pengaturan SEO</h3>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">SEO Title</label>
                <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder={title || "Judul di Google"} className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">SEO Description</label>
                <AutoResizeTextarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="Deskripsi di Google..." rows={2} className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none" />
              </div>
            </div>
          </>
        ) : (
          /* TAB BLOK SEKARANG SUDAH BERFUNGSI AKTIF */
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Setelan Blok Aktif</h3>
            
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
              <div>
                <span className="text-[11px] font-medium text-slate-400 block">Tipe Node Saat Ini</span>
                <span className="text-sm font-bold text-[#0F2340] bg-slate-200/60 px-2 py-0.5 rounded-md inline-block mt-0.5">{blockInfo?.type}</span>
              </div>

              {editor?.isActive("heading") && (
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <label className="block text-xs font-semibold text-slate-600">Ubah Tingkatan Heading:</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[1, 2, 3, 4, 5, 6].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: lvl as any }).run()}
                        className={`py-1 text-xs font-bold rounded border transition ${
                          blockInfo?.level === lvl 
                            ? "bg-[#E87722] text-white border-transparent shadow-sm" 
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        H{lvl}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="text-[11px] font-medium text-slate-400 block">Transformasi Blok</span>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setParagraph().run()}
                  className="w-full flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 transition shadow-sm"
                >
                  <RefreshCw size={12} /> Jadikan Paragraf Biasa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}