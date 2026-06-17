"use client"

import { useState, useEffect } from "react"

interface MediaFile {
  url: string
  name: string
}

interface MediaPickerProps {
  value?: string
  onChange: (url: string) => void
  placeholder?: string
}

export default function MediaPicker({ value, onChange, placeholder = "Select an image" }: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/media")
      const data = await res.json()
      setFiles(data.files || [])
    } catch (err) {
      // silent fail
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchMedia()
    }
  }, [isOpen])

  const handleSelect = (url: string) => {
    onChange(url)
    setIsOpen(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value || ""}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-slate-300 rounded"
          readOnly
        />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Choose
        </button>
      </div>
      {value && (
        <div className="mt-2">
          <img src={value} alt="Selected" className="h-20 object-cover rounded" />
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Media Library</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            {loading ? (
              <p className="text-slate-500">Loading...</p>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {files.map((file) => (
                  <button
                    key={file.name}
                    type="button"
                    onClick={() => handleSelect(file.url)}
                    className="border border-slate-200 rounded p-2 hover:bg-slate-50 text-center"
                  >
                    <img src={file.url} alt={file.name} className="w-full h-20 object-cover rounded mb-1" />
                    <p className="text-xs truncate">{file.name}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}