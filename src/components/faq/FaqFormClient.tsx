"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Placeholder from "@tiptap/extension-placeholder";
import { RiErrorWarningLine, RiCloseLine } from "react-icons/ri";
import LinkModal from "@/components/ui/LinkModal";
import FaqEditorToolbar from "./FaqEditorToolbar";

interface FaqFormClientProps {
  initialData?: { id: string; question: string; answer: string; published: boolean };
}

export default function FaqFormClient({ initialData }: FaqFormClientProps) {
  const router = useRouter();
  const [question, setQuestion] = useState(initialData?.question ?? "");
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, bulletList: false, orderedList: false, listItem: false }),
      BulletList.configure({ HTMLAttributes: { class: "list-disc pl-6 my-2 space-y-1" } }),
      OrderedList.configure({ HTMLAttributes: { class: "list-decimal pl-6 my-2 space-y-1" } }),
      ListItem,
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[#E87722] underline underline-offset-2 cursor-pointer" },
      }),
      Placeholder.configure({ placeholder: "Tulis jawaban di sini... bisa pakai list, angka, dan link." }),
    ],
    editorProps: {
      attributes: { class: "prose prose-slate max-w-none focus:outline-none min-h-[200px] p-4" },
    },
    content: initialData?.answer ?? "",
    immediatelyRender: false,
  });

  const confirmLink = (url: string) => {
    if (!url) editor?.chain().focus().unsetLink().run();
    else editor?.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
    setShowLinkModal(false);
  };

  const handleSubmit = async (publish: boolean) => {
    if (!question.trim()) {
      setErrorMsg("Pertanyaan wajib diisi.");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    const payload = {
      question,
      answer: editor?.getHTML() || "",
      published: publish,
    };

    try {
      const res = initialData
        ? await fetch(`/api/faqs/${initialData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/faqs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      const data = await res.json();
      if (!res.ok) {
        const detail = data.fieldErrors
          ? Object.entries(data.fieldErrors).map(([f, m]) => `${f}: ${(m as string[]).join(", ")}`).join(" | ")
          : "";
        throw new Error(`${data.error || "Gagal menyimpan"}${detail ? " — " + detail : ""}`);
      }

      router.push("/dashboard/faqs");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5">
      {showLinkModal && (
        <LinkModal
          defaultUrl={editor?.getAttributes("link").href || ""}
          onConfirm={confirmLink}
          onClose={() => setShowLinkModal(false)}
        />
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-800">{initialData ? "Edit FAQ" : "FAQ Baru"}</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition disabled:opacity-50"
          >
            Simpan Draf
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="px-4 py-2 text-xs font-bold bg-[#E87722] text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Terbitkan"}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg flex items-center gap-2 text-red-700 text-xs">
          <RiErrorWarningLine size={14} /> {errorMsg}
          <button type="button" onClick={() => setErrorMsg("")} className="ml-auto text-red-400 hover:text-red-600">
            <RiCloseLine size={14} />
          </button>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pertanyaan</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Cth: Berapa lama proses pembangunan rumah?"
          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#E87722]"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jawaban</label>
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <FaqEditorToolbar editor={editor} onAddLink={() => setShowLinkModal(true)} />
          <EditorContent editor={editor} className="bg-white" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-[#E87722]" />
        Published (tampil di halaman publik)
      </label>
    </div>
  );
}