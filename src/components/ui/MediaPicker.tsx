"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  RiCloseLine, RiCheckLine, RiImageLine,
  RiUpload2Line, RiLoader4Line, RiErrorWarningLine,
  RiDeleteBin6Line,
} from "react-icons/ri";

interface MediaFile {
  url: string;
  name: string;
  loading?: boolean;
}

interface MediaPickerProps {
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export default function MediaPicker({
  value,
  onChange,
  placeholder = "Pilih gambar...",
}: MediaPickerProps) {
  const [imgError, setImgError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleSelect = useCallback((url: string) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
    onChange(url);
  }, [onChange]);

  const handleFileSelected = useCallback((file: File) => {
    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);
    
    const fd = new FormData();
    fd.append("file", file);
    
    fetch("/api/media/upload", { method: "POST", body: fd })
      .then((res) => res.json())
      .then((data) => {
        const url = data.url || data.data?.url;
        if (url) {
          handleSelect(url);
        }
      })
      .catch((err) => {
        console.error("Upload failed:", err);
      })
      .finally(() => {
        if (previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current);
          previewUrlRef.current = null;
        }
        setPreviewUrl(null);
      });
  }, [handleSelect]);

  return (
    <div className="space-y-2">
      {/* Preview + trigger */}
      {(value || previewUrl) ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <img
            src={previewUrl || value}
            alt="Cover"
            className="w-full h-36 object-cover"
            onError={(e) => {
              const img = e.currentTarget;
              img.style.display = "none";
              const fallback = document.createElement("div");
              fallback.className = "w-full h-36 flex items-center justify-center text-slate-400 text-xs";
              fallback.textContent = "Gambar tidak tersedia";
              img.parentNode?.appendChild(fallback);
            }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="px-3 py-1.5 text-xs font-bold bg-white text-slate-800 rounded-lg hover:bg-slate-100 transition"
            >
              Ganti
            </button>
            <button
              type="button"
              onClick={() => {
                if (previewUrlRef.current) {
                  URL.revokeObjectURL(previewUrlRef.current);
                  previewUrlRef.current = null;
                }
                setPreviewUrl(null);
                onChange("");
              }}
              className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <RiDeleteBin6Line size={14} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full h-28 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-[#E87722] hover:text-[#E87722] hover:bg-orange-50/30 transition"
        >
          <RiImageLine size={24} />
          <span className="text-xs font-medium">{placeholder}</span>
        </button>
      )}

      {isOpen && (
        <MediaModal
          selected={value || null}
          multiple={false}
          onConfirm={(urls) => handleSelect(urls[0])}
          onClose={() => setIsOpen(false)}
          onFileSelect={handleFileSelected}
        />
      )}
    </div>
  );
}

// ─── Multiple Media Picker ────────────────────────────────────────────────────

interface MultipleMediaPickerProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function MultipleMediaPicker({ value = [], onChange }: MultipleMediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const mediaRef = useRef<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const uploadProgressRef = useRef<{ [key: string]: number }>({});
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    return () => {
      mediaRef.current.forEach((item) => {
        if (item.url.startsWith('blob:')) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, []);

  const isValidUrl = (url: string) => {
    return url.startsWith('/') || url.startsWith('http');
  };

  const handleSelect = useCallback((urls: string[]) => {
    onChange(urls);
  }, [onChange]);

  const handleFileSelected = useCallback(async (file: File) => {
    const fileId = `${file.name}-${Date.now()}`;
    const objectUrl = URL.createObjectURL(file);
    
    console.log('[MediaPicker] File selected:', file.name);
    
    setMedia((prev) => {
      const newMedia = [...prev, { url: objectUrl, name: file.name, loading: true }];
      mediaRef.current = newMedia;
      return newMedia;
    });
    uploadProgressRef.current[fileId] = 0;

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/media/upload", { method: "POST", body: fd });
      const data = await res.json();
      console.log('[MediaPicker] Upload response:', data);
      
      const url = data.url || data.data?.url;
      if (url && isValidUrl(url)) {
        console.log('[MediaPicker] Generated URL:', url);
        setMedia((prev) => {
          const newMedia = prev.map((item) =>
            item.url === objectUrl ? { url, name: file.name, loading: false } : item
          );
          mediaRef.current = newMedia;
          onChange([...valueRef.current, url]);
          return newMedia;
        });
      } else {
        throw new Error("URL tidak ditemukan");
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
      setMedia((prev) => prev.filter((item) => item.url !== objectUrl));
    } finally {
      if (objectUrl.startsWith('blob:')) {
        URL.revokeObjectURL(objectUrl);
      }
      delete uploadProgressRef.current[fileId];
    }
  }, [onChange]);

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url) => (
            <div key={url} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-square">
              <img 
                src={url} 
                alt="" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const img = e.currentTarget;
                  img.style.display = "none";
                  const fallback = document.createElement("div");
                  fallback.className = "w-full h-full flex items-center justify-center text-[10px] text-slate-400";
                  fallback.textContent = "Gagal";
                  img.parentNode?.appendChild(fallback);
                }}
              />
              <button
                type="button"
                onClick={() => onChange(value.filter((u) => u !== url))}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <RiCloseLine size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {media.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {media.map((item, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-square">
              {item.loading ? (
                <div className="w-full h-full bg-gray-200 animate-pulse rounded" />
              ) : (
                <img 
                  src={item.url} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.currentTarget;
                    img.style.display = "none";
                    const fallback = document.createElement("div");
                    fallback.className = "w-full h-full flex items-center justify-center text-[10px] text-slate-400";
                    fallback.textContent = "Gagal";
                    img.parentNode?.appendChild(fallback);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:border-[#E87722] hover:text-[#E87722] hover:bg-orange-50/30 transition text-xs font-medium"
      >
        <RiImageLine size={15} />
        {value.length > 0 ? `${value.length} gambar — Kelola Galeri` : "Tambah Gambar Galeri"}
      </button>

      {isOpen && (
        <MediaModal
          selected={null}
          multiple={true}
          initialSelected={value}
          onConfirm={handleSelect}
          onClose={() => setIsOpen(false)}
          onFileSelect={handleFileSelected}
        />
      )}
    </div>
  );
}

// ─── Shared Modal ─────────────────────────────────────────────────────────────

interface MediaModalProps {
  selected: string | null;
  multiple: boolean;
  initialSelected?: string[];
  onConfirm: (urls: string[]) => void;
  onClose: () => void;
  onFileSelect?: (file: File) => void;
}

function MediaModal({
  selected: initialSelected,
  multiple,
  initialSelected: initialMultiple,
  onConfirm,
  onClose,
  onFileSelect,
}: MediaModalProps) {
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loadingLib, setLoadingLib] = useState(true);
  const [selectedUrls, setSelectedUrls] = useState<string[]>(
    multiple ? (initialMultiple || []) : (initialSelected ? [initialSelected] : [])
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    setLoadingLib(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setFiles(data.data || []);
    } catch (err) {
      console.error("Failed to fetch media:", err);
    } finally {
      setLoadingLib(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const toggleSelect = (url: string) => {
    if (multiple) {
      setSelectedUrls((prev) =>
        prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
      );
    } else {
      setSelectedUrls([url]);
    }
  };

  /**
   * Upload satu atau banyak file sekaligus (sequential, biar tidak
   * membanjiri server). Dipakai baik dari input file (klik) maupun
   * dari drag & drop.
   */
  const uploadFiles = async (fileList: File[]) => {
    if (fileList.length === 0) return;

    // Validasi semua file dulu sebelum mulai upload
    const validFiles: File[] = [];
    for (const file of fileList) {
      if (!file.type.startsWith("image/")) {
        setUploadError(`"${file.name}" bukan file gambar, dilewati.`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`"${file.name}" lebih dari 10MB, dilewati.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Kalau single mode, batasi hanya 1 file pertama
    const filesToUpload = multiple ? validFiles : validFiles.slice(0, 1);

    setUploading(true);
    setUploadProgress({ done: 0, total: filesToUpload.length });
    setUploadError("");

    const isValidUrl = (url: string) => {
      return url.startsWith('/') || url.startsWith('http');
    };

    const uploadedUrls: string[] = [];
    const newMediaFiles: MediaFile[] = [];

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/media/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Upload gagal");
        const data = await res.json();
        console.log('[MediaModal] Upload response:', data);
        const url = data.url || data.data?.url;
        if (!url) throw new Error("URL tidak ditemukan");
        
        if (!isValidUrl(url)) {
          throw new Error("URL tidak valid");
        }
        console.log('[MediaModal] Generated URL:', url);

        uploadedUrls.push(url);
        newMediaFiles.push({ url, name: file.name });
      } catch (err: any) {
        setUploadError(`Gagal upload "${file.name}": ${err.message}`);
      }
      setUploadProgress({ done: i + 1, total: filesToUpload.length });
    }

    if (newMediaFiles.length > 0) {
      setFiles((prev) => [...newMediaFiles, ...prev]);
      setSelectedUrls((prev) => (multiple ? [...prev, ...uploadedUrls] : [uploadedUrls[0]]));
      setTab("library");
      fetchMedia();
    }

    setUploading(false);
    setUploadProgress(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = Array.from(e.target.files || []);
    if (onFileSelect && fileList.length > 0) {
      fileList.forEach((file) => onFileSelect(file));
    } else {
      uploadFiles(fileList);
    }
    e.target.value = "";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    const fileList = Array.from(e.dataTransfer.files || []);
    if (onFileSelect && fileList.length > 0) {
      fileList.forEach((file) => onFileSelect(file));
    } else {
      uploadFiles(fileList);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <h3 className="font-bold text-slate-800 text-sm">
            {multiple ? "Pilih Gambar Galeri" : "Pilih Cover Image"}
          </h3>
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
                  {files.map((file) => {
                    const isSelected = selectedUrls.includes(file.url);
                    return (
                      <button
                        key={file.name}
                        type="button"
                        onClick={() => toggleSelect(file.url)}
                        className={`relative border-2 rounded-xl p-1.5 transition-all ${
                          isSelected ? "border-[#E87722] shadow-md" : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-24 object-cover rounded-lg bg-slate-100"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-[#E87722] rounded-full p-0.5">
                            <RiCheckLine size={11} className="text-white" />
                          </div>
                        )}
                        <p className="text-[10px] text-slate-500 truncate mt-1 px-0.5">{file.name}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {tab === "upload" && (
            <div className="space-y-4">
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition ${
                  isDragging
                    ? "border-[#E87722] bg-orange-50"
                    : "border-slate-300 hover:border-[#E87722] hover:bg-orange-50/30"
                }`}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-3 text-[#E87722]">
                    <RiLoader4Line size={36} className="animate-spin" />
                    <span className="text-sm font-medium">
                      {uploadProgress
                        ? `Mengupload ${uploadProgress.done}/${uploadProgress.total}...`
                        : "Mengupload..."}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <RiUpload2Line size={36} />
                    <div>
                      <p className="text-sm font-semibold text-slate-600">
                        {isDragging
                          ? "Lepas di sini untuk upload"
                          : multiple
                          ? "Klik atau drag beberapa gambar ke sini"
                          : "Klik atau drag gambar ke sini"}
                      </p>
                      <p className="text-xs mt-1">JPG, PNG, WebP, GIF — maks. 10MB per file</p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple={multiple}
                className="hidden"
                onChange={handleFileInputChange}
              />
              {uploadError && (
                <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                  <RiErrorWarningLine size={14} /> {uploadError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 flex-shrink-0">
          <span className="text-xs text-slate-400">
            {selectedUrls.length === 0
              ? "Belum ada yang dipilih"
              : `${selectedUrls.length} gambar dipilih`}
          </span>
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
              onClick={() => onConfirm(selectedUrls)}
              disabled={selectedUrls.length === 0}
              className="px-5 py-2 text-xs font-bold bg-[#E87722] text-white rounded-xl hover:bg-orange-600 transition disabled:opacity-40"
            >
              {multiple ? `Simpan (${selectedUrls.length})` : "Pilih Gambar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}