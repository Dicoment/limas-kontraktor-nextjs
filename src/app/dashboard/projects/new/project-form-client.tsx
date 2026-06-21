"use client";

/**
 * project-form-client.tsx — WordPress Gutenberg-style editor
 *
 * Fix v3:
 * - POST pertama kali → simpan → dapat projectId
 * - Save berikutnya → PUT /api/projects/[id] (tidak 409 lagi)
 * - Upload gambar langsung dari HP/komputer (file input) → /api/media/upload
 * - Editor FULL SCREEN tanpa kotak tengah
 * - Heading H1–H6 benar-benar berfungsi (pakai setHeading bukan toggleHeading)
 * - Paste multi-baris → tiap baris jadi blok terpisah
 * - Preview hanya aktif setelah draf tersimpan
 */

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";

import {
  RiBold, RiItalic, RiUnderline,
  RiListUnordered, RiListOrdered, RiDoubleQuotesL,
  RiLink, RiImageLine,
  RiArrowGoBackLine, RiArrowGoForwardLine,
  RiAlignLeft, RiAlignCenter, RiAlignRight, RiAlignJustify,
  RiEyeLine, RiSaveLine, RiArrowLeftLine,
  RiCloseLine, RiSettings3Line, RiLayoutGridLine,
  RiRefreshLine, RiCheckLine, RiErrorWarningLine,
  RiUpload2Line, RiLoader4Line,
} from "react-icons/ri";

import MediaPicker from "@/components/ui/MediaPicker";
import { MultipleMediaPicker } from "@/components/ui/multiple-media-picker";
import AutoResizeTextarea from "@/components/ui/AutoResizeTextarea";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProjectFormClientProps {
  categories: any[];
  teams: any[];
}

interface MediaFile {
  url: string;
  name: string;
}

// ─── Upload Image Modal ───────────────────────────────────────────────────────
// Upload dari HP/komputer ATAU pilih dari media library yang sudah ada

function ImageUploadModal({
  onSelect,
  onClose,
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"upload" | "library">("library");
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loadingLib, setLoadingLib] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch library
  useEffect(() => {
    fetch("/api/media")
      .then((r) => r.json())
      .then((d) => setFiles(d.data || []))
      .catch(() => {})
      .finally(() => setLoadingLib(false));
  }, []);

  // Upload file baru
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe & ukuran
    if (!file.type.startsWith("image/")) {
      setUploadError("Hanya file gambar yang diperbolehkan.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Ukuran file maksimal 10MB.");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/media/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Upload gagal");
      }
      const data = await res.json();
      const url = data.url || data.data?.url;
      if (!url) throw new Error("URL tidak ditemukan di response");

      // Langsung sisipkan ke editor
      onSelect(url);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[82vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <h3 className="font-bold text-slate-800">Sisipkan Gambar</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
            <RiCloseLine size={18} />
          </button>
        </div>

        {/* Tab nav */}
        <div className="flex border-b border-slate-200 flex-shrink-0">
          {(["library", "upload"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition ${
                tab === t
                  ? "border-[#E87722] text-[#E87722]"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              {t === "library" ? "📁 Media Library" : "⬆️ Upload dari Perangkat"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 min-h-0">

          {/* Tab: Library */}
          {tab === "library" && (
            <>
              {loadingLib ? (
                <div className="flex items-center justify-center h-40 text-slate-400 text-sm gap-2">
                  <RiLoader4Line className="animate-spin" size={18} /> Memuat media...
                </div>
              ) : files.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm gap-2">
                  <RiImageLine size={32} className="opacity-30" />
                  <span>Belum ada media. Gunakan tab "Upload" untuk menambah gambar.</span>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {files.map((file) => (
                    <button
                      key={file.name}
                      type="button"
                      onClick={() => setSelected(file.url)}
                      className={`relative border-2 rounded-xl p-1.5 transition-all ${
                        selected === file.url
                          ? "border-[#E87722] shadow-md"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-24 object-cover rounded-lg bg-slate-100"
                      />
                      {selected === file.url && (
                        <div className="absolute top-2 right-2 bg-[#E87722] rounded-full p-0.5">
                          <RiCheckLine size={11} className="text-white" />
                        </div>
                      )}
                      <p className="text-[10px] text-slate-500 truncate mt-1 px-0.5">{file.name}</p>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Tab: Upload */}
          {tab === "upload" && (
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center cursor-pointer hover:border-[#E87722] hover:bg-orange-50/30 transition"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-3 text-[#E87722]">
                    <RiLoader4Line size={36} className="animate-spin" />
                    <span className="text-sm font-medium">Mengupload...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <RiUpload2Line size={36} />
                    <div>
                      <p className="text-sm font-semibold text-slate-600">Klik untuk pilih gambar</p>
                      <p className="text-xs mt-1">atau drag & drop file di sini</p>
                      <p className="text-[11px] mt-2 text-slate-300">JPG, PNG, WebP, GIF — maks. 10MB</p>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {uploadError && (
                <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                  <RiErrorWarningLine size={14} /> {uploadError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer — hanya aktif di tab library */}
        {tab === "library" && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 flex-shrink-0">
            <span className="text-xs text-slate-400">
              {selected ? "1 gambar dipilih" : "Pilih gambar untuk disisipkan"}
            </span>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition">
                Batal
              </button>
              <button
                type="button"
                onClick={() => selected && onSelect(selected)}
                disabled={!selected}
                className="px-5 py-2 text-xs font-bold bg-[#E87722] text-white rounded-xl hover:bg-orange-600 transition disabled:opacity-40"
              >
                Sisipkan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Link Modal ───────────────────────────────────────────────────────────────

function LinkModal({
  defaultUrl,
  onConfirm,
  onClose,
}: {
  defaultUrl: string;
  onConfirm: (url: string) => void;
  onClose: () => void;
}) {
  const [url, setUrl] = useState(defaultUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 50); }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">Tautkan URL</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
            <RiCloseLine size={16} />
          </button>
        </div>
        <input
          ref={inputRef}
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onConfirm(url)}
          placeholder="https://contoh.com"
          className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E87722]/30 focus:border-[#E87722]"
        />
        <div className="flex gap-2 justify-between items-center">
          {defaultUrl && (
            <button type="button" onClick={() => onConfirm("")} className="text-xs text-red-500 hover:text-red-700 font-medium">
              Hapus Link
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition">
              Batal
            </button>
            <button type="button" onClick={() => onConfirm(url)} className="px-4 py-2 text-xs font-bold bg-[#0F2340] text-white rounded-xl hover:bg-[#16325c] transition">
              Terapkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Toolbar helpers ──────────────────────────────────────────────────────────

function TBtn({ onClick, active, title, disabled, children }: {
  onClick: () => void; active?: boolean; title?: string; disabled?: boolean; children: React.ReactNode;
}) {
  return (
    <button
      type="button" title={title} onClick={onClick} disabled={disabled}
      className={`p-1.5 rounded w-8 h-8 flex items-center justify-center transition-all text-[15px] flex-shrink-0 ${
        active ? "bg-[#E87722] text-white" : "hover:bg-[#2c3338] text-[#a7aaad] hover:text-white"
      } disabled:opacity-30`}
    >
      {children}
    </button>
  );
}
function TDiv() { return <div className="w-px h-5 bg-[#3c434a] mx-0.5 flex-shrink-0" />; }

// ─── Sidebar sub-components ───────────────────────────────────────────────────

const inputCls = "w-full text-xs px-2.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E87722]/40 focus:border-[#E87722]";
const selectCls = "w-full text-xs px-2.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E87722]/40 cursor-pointer";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-slate-600">{label}</label>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProjectFormClient({ categories = [], teams = [] }: ProjectFormClientProps) {

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [location, setLocation] = useState("");
  const [client, setClient] = useState("");
  const [limasRole, setLimasRole] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [status, setStatus] = useState("DRAFT");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<{ teamId: string; role: string }[]>([]);

  // Track projectId setelah POST pertama — berikutnya pakai PUT
  const [projectId, setProjectId] = useState<string | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"pos" | "blok">("pos");

  // Preview hanya aktif setelah draf pertama tersimpan
  const canPreview = !!projectId && !!slug;

  // ── Editor ──────────────────────────────────────────────────────────────────
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
      }),
      BulletList.configure({ HTMLAttributes: { class: "list-disc pl-6 my-3 space-y-1" } }),
      OrderedList.configure({ HTMLAttributes: { class: "list-decimal pl-6 my-3 space-y-1" } }),
      ListItem,
      Blockquote.configure({ HTMLAttributes: { class: "border-l-4 border-[#E87722]/50 pl-5 italic my-4 text-slate-500" } }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[#E87722] underline underline-offset-2 cursor-pointer" },
      }),
      TiptapImage.configure({
        HTMLAttributes: { class: "max-w-full rounded-xl my-5 shadow-sm" },
        allowBase64: false,
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      Placeholder.configure({ placeholder: "Mulai ketik deskripsi proyek di sini..." }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-slate prose-lg prose-headings:font-bold prose-headings:text-[#0F2340] prose-a:text-[#E87722] max-w-none focus:outline-none min-h-[calc(100vh-200px)] p-10",
      },
      // ── Fix paste: tiap baris = blok terpisah ──────────────────────────────
      handlePaste(view, event) {
        const text = event.clipboardData?.getData("text/plain");
        if (!text) return false;

        const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
        if (lines.length <= 1) return false;

        event.preventDefault();

        // Pakai insertContent dengan array node JSON
        const content = lines.map((line) => {
          const trimmed = line.trim();
          // Heuristic: baris pendek (≤ 80 char) & tidak diakhiri tanda baca → heading H2
          const isHeading =
            trimmed.length > 0 &&
            trimmed.length <= 80 &&
            !/[.,;:!?]$/.test(trimmed) &&
            !/^[-*•]/.test(trimmed);

          return isHeading
            ? { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: trimmed }] }
            : { type: "paragraph", content: [{ type: "text", text: trimmed }] };
        });

        view.dispatch(
          view.state.tr.replaceSelectionWith(
            view.state.schema.nodeFromJSON({ type: "doc", content })
          )
        );
        return true;
      },
    },
    immediatelyRender: false,
  });

  // Auto-slug dari title
  useEffect(() => {
    const formatted = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setSlug(formatted);
  }, [title]);

  // ── addLink ──────────────────────────────────────────────────────────────────
  const handleAddLink = useCallback(() => setShowLinkModal(true), []);
  const confirmLink = useCallback((url: string) => {
    if (!url) editor?.chain().focus().unsetLink().run();
    else editor?.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
    setShowLinkModal(false);
  }, [editor]);

  // ── addImage ─────────────────────────────────────────────────────────────────
  const handleAddImage = useCallback(() => setShowImageModal(true), []);
  const confirmImage = useCallback((url: string) => {
    editor?.chain().focus().setImage({ src: url }).run();
    setShowImageModal(false);
  }, [editor]);

  // ── Block type (dropdown) ────────────────────────────────────────────────────
  const getCurrentBlockType = () => {
    if (!editor) return "p";
    for (const lvl of [1, 2, 3, 4, 5, 6] as const) {
      if (editor.isActive("heading", { level: lvl })) return String(lvl);
    }
    return "p";
  };

  const setBlockType = (val: string) => {
    if (!editor) return;
    if (val === "p") {
      editor.chain().focus().setParagraph().run();
    } else {
      // Pakai setHeading (bukan toggle) agar selalu aktif sesuai pilihan
      editor.chain().focus().setHeading({ level: Number(val) as 1|2|3|4|5|6 }).run();
    }
  };

  // ── getBlockInfo untuk Tab Blok ──────────────────────────────────────────────
  const getBlockInfo = () => {
    if (!editor) return { type: "Paragraf", level: null, align: "left" };
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

  // ── handleSubmit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (publishStatus: string) => {
    if (!title.trim()) {
      setErrorMsg("Judul proyek wajib diisi.");
      return;
    }
    setLoading(true);
    setSaveStatus("saving");
    setErrorMsg("");

    const fd = new FormData();
    fd.append("title", title);
    fd.append("slug", slug);
    fd.append("description", editor?.getHTML() || "");
    fd.append("status", publishStatus);
    fd.append("location", location);
    fd.append("client", client);
    fd.append("limasRole", limasRole);
    fd.append("coverImage", coverImage);
    fd.append("gallery", JSON.stringify(gallery));
    fd.append("seoTitle", seoTitle || title);
    fd.append("seoDescription", seoDescription);
    // API pakai categoryIds & teamIds (sesuai schema)
    fd.append("categoryIds", JSON.stringify(selectedCategories));
    fd.append("teamIds", JSON.stringify(selectedTeams));

    try {
      let res: Response;

      if (projectId) {
        // Sudah pernah disimpan → PUT
        res = await fetch(`/api/projects/${projectId}`, { method: "PUT", body: fd });
      } else {
        // Pertama kali → POST
        res = await fetch("/api/projects", { method: "POST", body: fd });
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      // Simpan projectId dari response untuk save berikutnya
      const id = data?.data?.id || data?.id;
      if (id) setProjectId(id);

      if (publishStatus === "DRAFT") {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        window.location.href = "/dashboard/projects";
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 5000);
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      {showLinkModal && (
        <LinkModal
          defaultUrl={editor?.getAttributes("link").href || ""}
          onConfirm={confirmLink}
          onClose={() => setShowLinkModal(false)}
        />
      )}
      {showImageModal && (
        <ImageUploadModal
          onSelect={confirmImage}
          onClose={() => setShowImageModal(false)}
        />
      )}

      <div className="fixed inset-0 flex flex-col z-50" style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* ══ TOP BAR ══════════════════════════════════════════════════════════ */}
        <header className="h-[46px] flex items-center justify-between px-3 flex-shrink-0 z-30" style={{ background: "#1d2327" }}>
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/dashboard/projects"
              className="flex items-center gap-1.5 px-2 py-1.5 rounded text-[#a7aaad] hover:text-white hover:bg-[#2c3338] text-xs font-medium transition flex-shrink-0"
            >
              <RiArrowLeftLine size={14} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <div className="w-px h-4 bg-[#3c434a] flex-shrink-0" />
            <span className="text-[#a7aaad] text-xs truncate">
              {title || <span className="italic opacity-50">Proyek Baru</span>}
            </span>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${
              status === "DRAFT" ? "bg-[#3c434a] text-[#a7aaad]"
              : status === "ONGOING" ? "bg-blue-700/80 text-blue-200"
              : "bg-green-800/80 text-green-200"
            }`}>
              {status === "DRAFT" ? "Draf" : status === "ONGOING" ? "Ongoing" : "Selesai"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {saveStatus === "saved" && (
              <span className="text-green-400 text-xs flex items-center gap-1">
                <RiCheckLine size={13} /> Tersimpan
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-red-400 text-xs flex items-center gap-1">
                <RiErrorWarningLine size={13} /> Gagal simpan
              </span>
            )}
            {saveStatus === "saving" && (
              <span className="text-[#a7aaad] text-xs flex items-center gap-1">
                <RiLoader4Line size={13} className="animate-spin" /> Menyimpan...
              </span>
            )}

            <button
              type="button"
              onClick={() => handleSubmit("DRAFT")}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#2c3338] hover:bg-[#3c434a] border border-[#3c434a] rounded text-[#a7aaad] hover:text-white transition disabled:opacity-50"
            >
              <RiSaveLine size={13} /> Simpan Draf
            </button>

            <button
              type="button"
              onClick={() => {
                if (!canPreview) {
                  setErrorMsg("Simpan draf dulu sebelum preview.");
                  return;
                }
                window.open(`/proyek/${slug}?preview=true`, "_blank");
              }}
              title={canPreview ? "Buka preview" : "Simpan draf dulu untuk preview"}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition ${
                canPreview
                  ? "bg-[#2c3338] hover:bg-[#3c434a] border-[#3c434a] text-[#a7aaad] hover:text-white"
                  : "bg-transparent border-[#2c3338] text-[#3c434a] cursor-not-allowed"
              }`}
            >
              <RiEyeLine size={13} /> Preview
            </button>

            <button
              type="button"
              onClick={() => handleSubmit("COMPLETED")}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-[#E87722] hover:bg-orange-600 rounded text-white transition disabled:opacity-50"
            >
              Terbitkan
            </button>
          </div>
        </header>

        {/* Error banner */}
        {errorMsg && (
          <div className="bg-red-50 border-b border-red-200 px-5 py-2 flex items-center gap-2 text-red-700 text-xs font-medium flex-shrink-0 z-20">
            <RiErrorWarningLine size={14} /> {errorMsg}
            <button type="button" onClick={() => setErrorMsg("")} className="ml-auto text-red-400 hover:text-red-600">
              <RiCloseLine size={14} />
            </button>
          </div>
        )}

        {/* ══ BODY ═════════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex overflow-hidden" style={{ background: "#f0f0f1" }}>

          {/* ── Editor kolom kiri ── */}
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Toolbar sticky */}
            <div
              className="sticky top-0 z-20 border-b flex items-center gap-0.5 px-3 py-1.5 flex-shrink-0 flex-wrap"
              style={{ background: "#1d2327", borderColor: "#3c434a" }}
            >
              {/* Block type dropdown */}
              <div className="relative mr-1  max-w-7xl mx-auto ">
                <select
                  value={getCurrentBlockType()}
                  onChange={(e) => setBlockType(e.target.value)}
                  className="appearance-none bg-[#2c3338] text-xs font-semibold text-[#a7aaad] rounded px-3 py-1.5 pr-6 border border-[#3c434a] h-8 cursor-pointer outline-none hover:bg-[#3c434a] hover:text-white transition min-w-[130px]"
                >
                  <option value="p">Paragraf</option>
                  <option value="1">Heading 1</option>
                  <option value="2">Heading 2</option>
                  <option value="3">Heading 3</option>
                  <option value="4">Heading 4</option>
                  <option value="5">Heading 5</option>
                  <option value="6">Heading 6</option>
                </select>
                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#a7aaad] text-[10px]">▾</div>
              </div>

              <TDiv />

              {/* Format */}
              <TBtn onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")} title="Bold (Ctrl+B)"><RiBold /></TBtn>
              <TBtn onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")} title="Italic (Ctrl+I)"><RiItalic /></TBtn>
              <TBtn onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive("underline")} title="Underline (Ctrl+U)"><RiUnderline /></TBtn>

              <TDiv />

              {/* List & Quote */}
              <TBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")} title="Bullet List"><RiListUnordered /></TBtn>
              <TBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")} title="Ordered List"><RiListOrdered /></TBtn>
              <TBtn onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive("blockquote")} title="Blockquote"><RiDoubleQuotesL /></TBtn>

              <TDiv />

              {/* Alignment */}
              <TBtn onClick={() => editor?.chain().focus().setTextAlign("left").run()} active={editor?.isActive({ textAlign: "left" })} title="Rata Kiri"><RiAlignLeft /></TBtn>
              <TBtn onClick={() => editor?.chain().focus().setTextAlign("center").run()} active={editor?.isActive({ textAlign: "center" })} title="Rata Tengah"><RiAlignCenter /></TBtn>
              <TBtn onClick={() => editor?.chain().focus().setTextAlign("right").run()} active={editor?.isActive({ textAlign: "right" })} title="Rata Kanan"><RiAlignRight /></TBtn>
              <TBtn onClick={() => editor?.chain().focus().setTextAlign("justify").run()} active={editor?.isActive({ textAlign: "justify" })} title="Justify"><RiAlignJustify /></TBtn>

              <TDiv />

              {/* Link & Image */}
              <TBtn onClick={handleAddLink} active={editor?.isActive("link")} title="Sisipkan Link"><RiLink /></TBtn>
              <TBtn onClick={handleAddImage} title="Sisipkan Gambar"><RiImageLine /></TBtn>

              <TDiv />

              {/* History */}
              <TBtn onClick={() => editor?.chain().focus().undo().run()} title="Undo" disabled={!editor?.can().undo()}><RiArrowGoBackLine /></TBtn>
              <TBtn onClick={() => editor?.chain().focus().redo().run()} title="Redo" disabled={!editor?.can().redo()}><RiArrowGoForwardLine /></TBtn>
            </div>

            {/* ── Editor area FULL WIDTH ── */}
            <div className="flex-1 overflow-y-auto bg-white">

              {/* Title */}
              <div className="px-10 max-w-7xl mx-auto  pt-10 pb-2 border-b border-slate-100">
                <input
                  className="text-[2rem] font-bold w-full outline-none text-[#0F2340] placeholder:text-slate-300 leading-snug"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tambahkan judul"
                />
                {slug && (
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">
                    /proyek/<span className="text-[#E87722]">{slug}</span>
                  </p>
                )}
              </div>

              {/* Tiptap content — full width, tidak ada kotak */}
              <EditorContent editor={editor} className="max-w-7xl mx-auto" />
            </div>
          </div>

          {/* ── Sidebar kanan ── */}
          <aside
            className="w-[280px] bg-white border-l overflow-y-auto flex flex-col flex-shrink-0 hidden md:flex"
            style={{ borderColor: "#dcdcde" }}
          >
            {/* Tab nav */}
            <div className="flex border-b flex-shrink-0" style={{ borderColor: "#dcdcde" }}>
              {(["pos", "blok"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
                    activeTab === t ? "border-[#E87722] text-[#E87722]" : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  {t === "pos" ? <><RiLayoutGridLine size={13} /> Pos</> : <><RiSettings3Line size={13} /> Blok</>}
                </button>
              ))}
            </div>

            <div className="p-4 space-y-5 flex-1">
              {activeTab === "pos" ? (
                <>
                  <Section title="Status & Publikasi">
                    <Field label="Status">
                      <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
                        <option value="DRAFT">Draft</option>
                        <option value="ONGOING">Ongoing</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </Field>
                    <Field label="Slug URL">
                      <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className={`${inputCls} font-mono`} />
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
                        <input type="text" value={value} onChange={(e) => set(e.target.value)} className={inputCls} />
                      </Field>
                    ))}
                  </Section>

                  <hr style={{ borderColor: "#dcdcde" }} />

                  <Section title="Kategori">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 max-h-36 overflow-y-auto space-y-1.5">
                      {categories.length === 0 && <p className="text-[11px] text-slate-400 italic">Belum ada kategori</p>}
                      {categories.map((c) => {
                        const isChecked = selectedCategories.includes(c.id);
                        return (
                          <label key={c.id} className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                            <input
                              type="checkbox" checked={isChecked}
                              onChange={() => {
                                if (isChecked) setSelectedCategories(selectedCategories.filter((id) => id !== c.id));
                                else setSelectedCategories([...selectedCategories, c.id]);
                              }}
                              className="rounded border-slate-300 accent-[#E87722]"
                            />
                            {c.name}
                          </label>
                        );
                      })}
                    </div>
                  </Section>

                  <Section title="Tim Lapangan">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 max-h-44 overflow-y-auto space-y-2">
                      {teams.length === 0 && <p className="text-[11px] text-slate-400 italic">Belum ada tim</p>}
                      {teams.map((t) => {
                        const matched = selectedTeams.find((i) => i.teamId === t.id);
                        return (
                          <div key={t.id} className="space-y-1">
                            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                              <input
                                type="checkbox" checked={!!matched}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedTeams([...selectedTeams, { teamId: t.id, role: "" }]);
                                  else setSelectedTeams(selectedTeams.filter((i) => i.teamId !== t.id));
                                }}
                                className="rounded border-slate-300 accent-[#E87722]"
                              />
                              {t.name}
                            </label>
                            {!!matched && (
                              <input
                                type="text" value={matched.role}
                                onChange={(e) => setSelectedTeams(selectedTeams.map((i) => i.teamId === t.id ? { ...i, role: e.target.value } : i))}
                                placeholder="Peran (cth: PM, Pengawas)"
                                className="w-full text-[11px] px-2 py-1 bg-white border border-slate-200 rounded focus:outline-none"
                              />
                            )}
                          </div>
                        );
                      })}
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
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">🔍 SEO</h3>
                    <Field label="SEO Title">
                      <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder={title || "Judul di Google"} className={inputCls} />
                    </Field>
                    <Field label="SEO Description">
                      <AutoResizeTextarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="Deskripsi di Google..." rows={2} className={`${inputCls} resize-none`} />
                    </Field>
                  </div>
                </>
              ) : (
                /* ── Tab Blok ── */
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
                          const Icon = { left: RiAlignLeft, center: RiAlignCenter, right: RiAlignRight, justify: RiAlignJustify }[align];
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
                      <button type="button" onClick={() => editor?.chain().focus().setParagraph().run()}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 transition">
                        <RiRefreshLine size={12} /> Jadikan Paragraf
                      </button>
                      <button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 transition">
                        <RiDoubleQuotesL size={12} /> Jadikan Kutipan
                      </button>
                      <button type="button" onClick={() => editor?.chain().focus().setHeading({ level: 2 }).run()}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 transition">
                        <span className="text-[10px] font-black">H2</span> Jadikan Heading 2
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}