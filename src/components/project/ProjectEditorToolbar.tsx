"use client";

import type { Editor } from "@tiptap/react";
import {
  RiBold,
  RiItalic,
  RiUnderline,
  RiListUnordered,
  RiListOrdered,
  RiDoubleQuotesL,
  RiLink,
  RiImageLine,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiAlignJustify,
} from "react-icons/ri";
import { ToolbarButton, ToolbarDivider } from "@/components/ui/EditorToolbarButton";

interface ProjectEditorToolbarProps {
  editor: Editor | null;
  onAddLink: () => void;
  onAddImage: () => void;
}

/**
 * Toolbar lengkap untuk editor deskripsi project (Tiptap):
 * dropdown heading, format teks, list, alignment, link, gambar, undo/redo.
 */
export default function ProjectEditorToolbar({ editor, onAddLink, onAddImage }: ProjectEditorToolbarProps) {
  const getCurrentBlockType = () => {
    if (!editor) return "p";
    for (const lvl of [1, 2, 3, 4, 5, 6] as const) {
      if (editor.isActive("heading", { level: lvl })) return String(lvl);
    }
    return "p";
  };

  const setBlockType = (val: string) => {
    if (!editor) return;
    if (val === "p") editor.chain().focus().setParagraph().run();
    else editor.chain().focus().setHeading({ level: Number(val) as 1 | 2 | 3 | 4 | 5 | 6 }).run();
  };

  return (
    <div
      className="border-b flex items-center gap-0.5 px-3 py-1.5 flex-shrink-0 flex-wrap"
      style={{ background: "#1d2327", borderColor: "#3c434a" }}
    >
      <div className="relative mr-1">
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
      <ToolbarDivider />
      <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")} title="Bold">
        <RiBold />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")} title="Italic">
        <RiItalic />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive("underline")} title="Underline">
        <RiUnderline />
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")} title="Bullet List">
        <RiListUnordered />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")} title="Ordered List">
        <RiListOrdered />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive("blockquote")} title="Blockquote">
        <RiDoubleQuotesL />
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign("left").run()} active={editor?.isActive({ textAlign: "left" })} title="Rata Kiri">
        <RiAlignLeft />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign("center").run()} active={editor?.isActive({ textAlign: "center" })} title="Tengah">
        <RiAlignCenter />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign("right").run()} active={editor?.isActive({ textAlign: "right" })} title="Rata Kanan">
        <RiAlignRight />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign("justify").run()} active={editor?.isActive({ textAlign: "justify" })} title="Justify">
        <RiAlignJustify />
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton onClick={onAddLink} active={editor?.isActive("link")} title="Link">
        <RiLink />
      </ToolbarButton>
      <ToolbarButton onClick={onAddImage} title="Gambar">
        <RiImageLine />
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()} title="Undo">
        <RiArrowGoBackLine />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()} title="Redo">
        <RiArrowGoForwardLine />
      </ToolbarButton>
    </div>
  );
}