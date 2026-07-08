"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import { RiErrorWarningLine, RiCloseLine } from "react-icons/ri";

import LinkModal from "@/components/ui/LinkModal";
import ImageUploadModal from "@/components/ui/ImageUploadModal";
import ProjectTopBar, { SaveStatus } from "@/components/project/ProjectTopBar";
import ProjectEditorToolbar from "@/components/project/ProjectEditorToolbar";
import ProjectSidebar from "@/components/project/ProjectSidebar";

interface ProjectFormClientProps {
  categories: any[];
  teams: any[];
}

/**
 * Halaman editor project (tambah/edit). Menggabungkan top bar, toolbar
 * editor, kanvas Tiptap, dan sidebar kanan (Pos & Blok) menjadi satu
 * pengalaman edit yang utuh.
 */
export default function ProjectFormClient({ categories: initialCategories = [], teams: initialTeams = [] }: ProjectFormClientProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [location, setLocation] = useState("");
  const [client, setClient] = useState("");
  const [limasRole, setLimasRole] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [status, setStatus] = useState("DRAFT");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  // categories & teams disimpan sebagai state lokal (bukan langsung props)
  // karena sidebar bisa menambahkan kategori/tim baru secara on-the-fly
  // tanpa reload halaman.
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [teams, setTeams] = useState<any[]>(initialTeams);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<{ teamId: string; role: string }[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"pos" | "blok">("pos");

  const canPreview = !!projectId && !!slug;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
      }),
      BulletList.configure({ HTMLAttributes: { class: "list-disc pl-6 my-3 space-y-1" } }),
      OrderedList.configure({ HTMLAttributes: { class: "list-decimal pl-6 my-3 space-y-1" } }),
      ListItem,
      Blockquote.configure({
        HTMLAttributes: { class: "border-l-4 border-[#E87722]/50 pl-5 italic my-4 text-slate-500" },
      }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[#E87722] underline underline-offset-2 cursor-pointer" },
      }),
      TiptapImage.configure({
        HTMLAttributes: { class: "max-w-full rounded-xl my-5 shadow-sm" },
        allowBase64: false,
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      Placeholder.configure({ placeholder: "Mulai ketik deskripsi proyek di sini..." }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-slate prose-lg prose-headings:font-bold prose-headings:text-[#0F2340] prose-a:text-[#E87722] max-w-none focus:outline-none min-h-[60vh] p-10",
      },
      handlePaste(view, event) {
        const text = event.clipboardData?.getData("text/plain");
        if (!text) return false;
        const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
        if (lines.length <= 1) return false;
        event.preventDefault();
        const content = lines.map((line) => {
          const trimmed = line.trim();
          const isHeading =
            trimmed.length > 0 &&
            trimmed.length <= 80 &&
            !/[.,;:!?]$/.test(trimmed) &&
            !/^[-*•]/.test(trimmed);
          return isHeading
            ? { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: trimmed }] }
            : { type: "paragraph", content: [{ type: "text", text: trimmed }] };
        });
        view.dispatch(
          view.state.tr.replaceSelectionWith(view.state.schema.nodeFromJSON({ type: "doc", content }))
        );
        return true;
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    const formatted = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setSlug(formatted);
  }, [title]);

  const handleAddLink = useCallback(() => setShowLinkModal(true), []);
  const confirmLink = useCallback(
    (url: string) => {
      if (!url) editor?.chain().focus().unsetLink().run();
      else editor?.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
      setShowLinkModal(false);
    },
    [editor]
  );

  const handleAddImage = useCallback(() => setShowImageModal(true), []);
  const confirmImage = useCallback(
    (url: string) => {
      editor?.chain().focus().setImage({ src: url }).run();
      setShowImageModal(false);
    },
    [editor]
  );

  const handleSubmit = async (publishStatus: string) => {
    if (!title.trim()) {
      setErrorMsg("Judul proyek wajib diisi.");
      return;
    }
    setLoading(true);
    setSaveStatus("saving");
    setErrorMsg("");

    const fd = new FormData();
    fd.append("title", title);
    fd.append("slug", slug);
    fd.append("description", editor?.getHTML() || "");
    fd.append("status", publishStatus);
    fd.append("location", location);
    fd.append("client", client);
    fd.append("limasRole", limasRole);
    fd.append("coverImage", coverImage);
    fd.append("gallery", JSON.stringify(gallery));
    fd.append("seoTitle", seoTitle || title);
    fd.append("seoDescription", seoDescription);
    fd.append("categoryIds", JSON.stringify(selectedCategories));
    fd.append("teamIds", JSON.stringify(selectedTeams));

    try {
      const res = projectId
        ? await fetch(`/api/projects/${projectId}`, { method: "PUT", body: fd })
        : await fetch("/api/projects", { method: "POST", body: fd });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const id = data?.data?.id || data?.id;
      if (id) setProjectId(id);

      if (publishStatus === "DRAFT") {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        window.location.href = "/dashboard/projects";
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showLinkModal && (
        <LinkModal
          defaultUrl={editor?.getAttributes("link").href || ""}
          onConfirm={confirmLink}
          onClose={() => setShowLinkModal(false)}
        />
      )}
      {showImageModal && <ImageUploadModal onSelect={confirmImage} onClose={() => setShowImageModal(false)} />}

      <div className="flex flex-col" style={{ height: "calc(100vh - 64px)", fontFamily: "'Inter', sans-serif" }}>
        <ProjectTopBar
          title={title}
          status={status}
          slug={slug}
          loading={loading}
          saveStatus={saveStatus}
          canPreview={canPreview}
          onSaveDraft={() => handleSubmit("DRAFT")}
          onPublish={() => handleSubmit("COMPLETED")}
          onPreviewBlocked={() => setErrorMsg("Simpan draf dulu sebelum preview.")}
        />

        {errorMsg && (
          <div className="bg-red-50 border-b border-red-200 px-5 py-2 flex items-center gap-2 text-red-700 text-xs font-medium flex-shrink-0 z-20">
            <RiErrorWarningLine size={14} /> {errorMsg}
            <button
              type="button"
              onClick={() => setErrorMsg("")}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <RiCloseLine size={14} />
            </button>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden min-h-0" style={{ background: "#f0f0f1" }}>
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            <ProjectEditorToolbar editor={editor} onAddLink={handleAddLink} onAddImage={handleAddImage} />

            <div className="flex-1 overflow-y-auto bg-white min-h-0">
              <div className="px-10 pt-10 pb-2 border-b border-slate-100">
                <input
                  className="text-[2rem] font-bold w-full outline-none text-[#0F2340] placeholder:text-slate-300 leading-snug"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tambahkan judul"
                />
                {slug && (
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">
                    /proyek/<span className="text-[#E87722]">{slug}</span>
                  </p>
                )}
              </div>
              <EditorContent editor={editor} className="w-full" />
            </div>
          </div>

          <ProjectSidebar
            editor={editor}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            status={status}
            setStatus={setStatus}
            slug={slug}
            setSlug={setSlug}
            location={location}
            setLocation={setLocation}
            client={client}
            setClient={setClient}
            limasRole={limasRole}
            setLimasRole={setLimasRole}
            categories={categories}
            setCategories={setCategories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            teams={teams}
            setTeams={setTeams}
            selectedTeams={selectedTeams}
            setSelectedTeams={setSelectedTeams}
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            gallery={gallery}
            setGallery={setGallery}
            title={title}
            seoTitle={seoTitle}
            setSeoTitle={setSeoTitle}
            seoDescription={seoDescription}
            setSeoDescription={setSeoDescription}
          />
        </div>
      </div>
    </>
  );
}