"use client";
import React, { useState, useEffect } from 'react';
import Button from "@/components/ui/Button"

interface MultipleMediaPickerProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function MultipleMediaPicker({ value = [], onChange }: MultipleMediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>(value || []);

  useEffect(() => {
    if (isOpen) {
      setSelected(value || []);
      fetch('/api/media').then(r => r.json()).then(res => setMedia(res.data || [])).catch(console.error);
    }
  }, [isOpen, value]);

  const toggleSelect = (url: string) => {
    setSelected(prev => prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]);
  };

  return (
    <div className="w-full space-y-3">
      <Button type="button" variant="outline" onClick={() => setIsOpen(true)}>
        Pilih Gallery dari FileGator
      </Button>
      
      {value && value.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {value.map(url => (
            <div key={url} className="border border-[#F6BF03] rounded-md overflow-hidden">
              <img src={url} alt="Gallery item" className="aspect-square object-contain bg-gray-100 p-1 w-full" />
              <p className="text-xs truncate px-1 pb-1 text-center">{url.split('/').pop()}</p>
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[85vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Pilih Banyak Gambar</h2>
              <div className="flex gap-2">
                <Button type="button" onClick={() => { onChange(selected); setIsOpen(false); }} className="bg-green-600 hover:bg-green-700 text-white">
                  Simpan Pilihan ({selected.length})
                </Button>
                <button type="button" onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-red-500 font-bold p-2">✕</button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              {media.length === 0 ? <p className="col-span-full text-center">Loading atau Kosong...</p> : media.map((file) => {
                const isSelected = selected.includes(file.url);
                return (
                  <div 
                    key={file.id} 
                    onClick={() => toggleSelect(file.url)}
                    className={`relative aspect-square border-4 rounded-md overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-[#F6BF03]' : 'border-transparent'}`}
                  >
                    <img src={file.url} alt={file.name} className="object-contain bg-gray-100 p-1 w-full h-full" />
                    {isSelected && <div className="absolute inset-0 bg-[#F6BF03]/20 flex items-center justify-center"><span className="text-white text-3xl font-bold drop-shadow-md">✓</span></div>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}