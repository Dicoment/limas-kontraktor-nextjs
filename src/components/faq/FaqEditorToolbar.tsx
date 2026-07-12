"use client";

import { useState, useEffect } from "react";
import type { Editor } from "@tiptap/react";
import { RiBold, RiItalic, RiListUnordered, RiListOrdered, RiLink } from "react-icons/ri";
import { ToolbarButton, ToolbarDivider } from "@/components/ui/EditorToolbarButton";

interface FaqEditorToolbarProps {
  editor: Editor | null;
  onAddLink: () => void;
}

/** Toolbar ringan buat jawaban FAQ — cuma yang perlu buat SEO/list, gak ada
 * heading/align/image kayak Project & Blog Post. Fix reaktivitas sama
 * kayak ProjectEditorToolbar (subscribe transaction/selectionUpdate). */
export default function FaqEditorToolbar({ editor, onAddLink }: FaqEditorToolbarProps) {
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const rerender = () => forceUpdate((n) => n + 1);
    editor.on("transaction", rerender);
    editor.on("selectionUpdate", rerender);
    return () => {
      editor.off("transaction", rerender);
      editor.off("selectionUpdate", rerender);
    };
  }, [editor]);

  return (
    <div className="border-b flex items-center gap-0.5 px-3 py-1.5 flex-shrink-0" style={{ background: "#1d2327", borderColor: "#3c434a" }}>
      <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")} title="Bold">
        <RiBold />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")} title="Italic">
        <RiItalic />
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")} title="Daftar Poin">
        <RiListUnordered />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")} title="Daftar Angka">
        <RiListOrdered />
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton onClick={onAddLink} active={editor?.isActive("link")} title="Sisipkan Link">
        <RiLink />
      </ToolbarButton>
    </div>
  );
}