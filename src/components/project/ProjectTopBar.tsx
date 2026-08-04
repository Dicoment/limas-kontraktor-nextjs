"use client";

import Link from "next/link";
import {
  RiArrowLeftLine,
  RiSaveLine,
  RiEyeLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiLoader4Line,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
} from "react-icons/ri";

export type SaveStatus = "idle" | "saving" | "saved" | "error" | "published";

interface ProjectTopBarProps {
  title: string;
  status: string;
  slug: string;
  loading: boolean;
  saveStatus: SaveStatus;
  canPreview: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  onPreviewBlocked: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function ProjectTopBar({
  title,
  status,
  slug,
  loading,
  saveStatus,
  canPreview,
  onSaveDraft,
  onPublish,
  onPreviewBlocked,
  sidebarOpen,
  onToggleSidebar,
}: ProjectTopBarProps) {
  return (
    <header
      className="h-[46px] flex items-center justify-between px-3 flex-shrink-0 z-30"
      style={{ background: "#1d2327" }}
    >
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
        <span
          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${
            status === "DRAFT"
              ? "bg-[#3c434a] text-[#a7aaad]"
              : status === "ONGOING"
              ? "bg-blue-700/80 text-blue-200"
              : "bg-green-800/80 text-green-200"
          }`}
        >
          {status === "DRAFT" ? "Draf" : status === "ONGOING" ? "Ongoing" : "Selesai"}
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {saveStatus === "saved" && (
          <span className="text-green-400 text-xs flex items-center gap-1">
            <RiCheckLine size={13} /> Tersimpan
          </span>
        )}
        {/* BARU: notifikasi khusus pas berhasil publish, sebelum redirect */}
        {saveStatus === "published" && (
          <span className="text-green-400 text-xs font-bold flex items-center gap-1 animate-in fade-in duration-200">
            <RiCheckLine size={13} /> Berhasil dipublikasikan!
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
          onClick={onSaveDraft}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#2c3338] hover:bg-[#3c434a] border border-[#3c434a] rounded text-[#a7aaad] hover:text-white transition disabled:opacity-50"
        >
          <RiSaveLine size={13} /> Simpan Draf
        </button>

        <button
          type="button"
          onClick={() => {
            if (!canPreview) {
              onPreviewBlocked();
              return;
            }
            window.open(`/proyek/${slug}?preview=true`, "_blank");
          }}
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
          onClick={onPublish}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-[#E87722] hover:bg-orange-600 rounded text-white transition disabled:opacity-50"
        >
          Terbitkan
        </button>

        <div className="w-px h-4 bg-[#3c434a] flex-shrink-0 mx-0.5" />

        <button
          type="button"
          onClick={onToggleSidebar}
          title={sidebarOpen ? "Sembunyikan panel" : "Tampilkan panel"}
          className={`hidden md:flex items-center justify-center w-8 h-8 rounded border transition ${
            sidebarOpen
              ? "bg-[#3c434a] border-[#3c434a] text-white"
              : "bg-[#2c3338] border-[#3c434a] text-[#a7aaad] hover:text-white"
          }`}
        >
          {sidebarOpen ? <RiMenuUnfoldLine size={14} /> : <RiMenuFoldLine size={14} />}
        </button>
      </div>
    </header>
  );
}