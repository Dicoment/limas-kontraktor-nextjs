"use client";

import { useState, useEffect, useRef } from "react";
import {
  RiImageLine,
  RiCloseLine,
  RiCheckLine,
  RiUpload2Line,
  RiLoader4Line,
  RiErrorWarningLine,
} from "react-icons/ri";

interface MediaFile {
  url: string;
  name: string;
}

interface ImageUploadModalProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

/**
 * Modal untuk menyisipkan gambar ke editor — pilih dari media library
 * atau upload baru dari perangkat. Generik, dipakai di editor project,
 * artikel, dsb.
 */
export default function ImageUploadModal({ onSelect, onClose }: ImageUploadModalProps) {
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loadingLib, setLoadingLib] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/media")
      .then((r) => r.json())
      .then((d) => setFiles(d.data || []))
      .catch(() => {})
      .finally(() => setLoadingLib(false));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Hanya file gambar.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Maks. 10MB.");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/media/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Upload gagal");
      const data = await res.json();
      const url = data.url || data.data?.url;
      if (!url) throw new Error("URL tidak ditemukan");
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <h3 className="font-bold text-slate-800">Sisipkan Gambar ke Editor</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <RiCloseLine size={18} />
          </button>
        </div>

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

        <div className="flex-1 overflow-y-auto p-5 min-h-0">
          {tab === "library" && (
            <>
              {loadingLib ? (
                <div className="flex items-center justify-center h-40 text-slate-400 text-sm gap-2">
                  <RiLoader4Line className="animate-spin" size={18} /> Memuat...
                </div>
              ) : files.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm gap-2">
                  <RiImageLine size={32} className="opacity-30" />
                  <span>Belum ada media. Gunakan tab Upload.</span>
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
                      <p className="text-xs mt-1">JPG, PNG, WebP, GIF — maks. 10MB</p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
              {uploadError && (
                <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                  <RiErrorWarningLine size={14} /> {uploadError}
                </div>
              )}
            </div>
          )}
        </div>

        {tab === "library" && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 flex-shrink-0">
            <span className="text-xs text-slate-400">{selected ? "1 gambar dipilih" : "Pilih gambar"}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
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