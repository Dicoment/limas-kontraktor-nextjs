"use client"

import { Editor } from "@tiptap/react"
import { Bold, Italic, List, ListOrdered, Quote, Link, Image as ImageIcon } from "lucide-react"

interface EditorToolbarProps {
  editor: Editor | null
  addLink: () => void
  addImage: () => void // 1. Tambahkan ini
}

export default function EditorToolbar({ editor, addLink, addImage }: EditorToolbarProps) { // 2. Tambahkan addImage di sini
  if (!editor) return null

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-slate-150 px-6 py-2 flex items-center justify-center flex-shrink-0 gap-1 shadow-sm select-none">
      <div className="max-w-3xl w-full flex items-center gap-1.5 text-slate-700">
        
        {/* Dropdown Paragraph / Heading */}
        <select
          value={
            editor.isActive("heading", { level: 1 }) ? "1" :
            editor.isActive("heading", { level: 2 }) ? "2" :
            editor.isActive("heading", { level: 3 }) ? "3" :
            editor.isActive("heading", { level: 4 }) ? "4" : "p"
          }
          onChange={(e) => {
            const val = e.target.value
            if (val === "p") editor.chain().focus().setParagraph().run()
            else editor.chain().focus().toggleHeading({ level: Number(val) as any }).run()
          }}
          className="bg-slate-50 text-xs font-bold text-slate-850 rounded-lg px-2.5 py-1.5 border border-slate-200 focus:ring-0 h-8 cursor-pointer outline-none"
        >
          <option value="p">Paragraf (¶)</option>
          <option value="1">Heading 1 (H1)</option>
          <option value="2">Heading 2 (H2)</option>
          <option value="3">Heading 3 (H3)</option>
          <option value="4">Heading 4 (H4)</option>
        </select>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Tombol-tombol Formatting */}
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded-lg w-8 h-8 flex items-center justify-center transition ${editor.isActive("bold") ? "bg-[#E87722] text-white shadow-sm" : "hover:bg-slate-100 text-slate-600"}`}><Bold size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded-lg w-8 h-8 flex items-center justify-center transition ${editor.isActive("italic") ? "bg-[#E87722] text-white shadow-sm" : "hover:bg-slate-100 text-slate-600"}`}><Italic size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded-lg w-8 h-8 flex items-center justify-center transition ${editor.isActive("bulletList") ? "bg-[#E87722] text-white shadow-sm" : "hover:bg-slate-100 text-slate-600"}`}><List size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded-lg w-8 h-8 flex items-center justify-center transition ${editor.isActive("orderedList") ? "bg-[#E87722] text-white shadow-sm" : "hover:bg-slate-100 text-slate-600"}`}><ListOrdered size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-1.5 rounded-lg w-8 h-8 flex items-center justify-center transition ${editor.isActive("blockquote") ? "bg-[#E87722] text-white shadow-sm" : "hover:bg-slate-100 text-slate-600"}`}><Quote size={15} /></button>
        <button type="button" onClick={addLink} className={`p-1.5 rounded-lg w-8 h-8 flex items-center justify-center transition ${editor.isActive("link") ? "bg-[#E87722] text-white shadow-sm" : "hover:bg-slate-100 text-slate-600"}`}><Link size={15} /></button>
        
        {/* Tombol Gambar */}
        <button type="button" onClick={addImage} className="p-1.5 rounded-lg w-8 h-8 flex items-center justify-center hover:bg-slate-100 text-slate-600"><ImageIcon size={15} /></button>
      </div>
    </div>
  )
}