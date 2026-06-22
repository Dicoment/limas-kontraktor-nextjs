"use client";

import { useState, useEffect, useRef } from "react";
import { RiCloseLine } from "react-icons/ri";

interface LinkModalProps {
  defaultUrl: string;
  onConfirm: (url: string) => void;
  onClose: () => void;
}

/**
 * Modal untuk menautkan/menghapus URL pada teks yang dipilih di editor.
 * Generik — dipakai di editor project, artikel, dsb.
 */
export default function LinkModal({ defaultUrl, onConfirm, onClose }: LinkModalProps) {
  const [url, setUrl] = useState(defaultUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">Tautkan URL</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
          >
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
            <button
              type="button"
              onClick={() => onConfirm("")}
              className="text-xs text-red-500 hover:text-red-700 font-medium"
            >
              Hapus Link
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => onConfirm(url)}
              className="px-4 py-2 text-xs font-bold bg-[#0F2340] text-white rounded-xl hover:bg-[#16325c] transition"
            >
              Terapkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}