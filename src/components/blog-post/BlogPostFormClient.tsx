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
import BlogPostTopBar, { SaveStatus } from "@/components/blog-post/BlogPostTopBar";
import ProjectEditorToolbar from "@/components/project/ProjectEditorToolbar";
import BlogPostSidebar from "@/components/blog-post/BlogPostSidebar";
import type { FormattedBlogPost } from "@/lib/blog-post-helpers";

interface BlogPostFormClientProps {
  categories: any[];
  tags: any[];
  initialData?: FormattedBlogPost;
}

/**
 * Halaman editor Blog Post (tambah/edit). Struktur identik ProjectFormClient
 * (topbar + toolbar + kanvas Tiptap + sidebar collapsible, full-screen
 * overlay biar gak numpuk sama AdminLayout), TAPI:
 * - Gak ada state teams/selectedTeams/gallery (blog gak punya Tim & Galeri)
 * - Ada state excerpt & selectedTags (field baru khusus blog)
 * - status jadi boolean `published`, bukan string enum
 */
export default function BlogPostFormClient({
  categories: initialCategories = [],
  tags: initialTags = [],
  initialData,
}: BlogPostFormClientProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "");
  const [published, setPublished] = useState<boolean>(initialData?.published ?? false);
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription ?? "");

  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [tags, setTags] = useState<any[]>(initialTags);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    () => initialData?.categories?.map((c) => c.id) ?? []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    () => initialData?.tags?.map((t) => t.id) ?? []
  );

  const [postId, setPostId] = useState<string | null>(initialData?.id ?? null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"pos" | "blok">("pos");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const canPreview = !!postId && !!slug;

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
      Placeholder.configure({ placeholder: "Mulai ketik isi artikel di sini..." }),
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
    content: initialData?.content ?? "",
    immediatelyRender: false,
  });

  const [slugTouched, setSlugTouched] = useState(!!initialData?.slug);
  useEffect(() => {
    if (slugTouched) return;
    const formatted = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setSlug(formatted);
  }, [title, slugTouched]);

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

  // ASUMSI: target /api/blog-posts mirror pola /api/projects yang dipakai
  // ProjectFormClient. BELUM diverifikasi karena route handler-nya belum
  // pernah saya lihat isinya — sesuaikan field FormData ini begitu file
  // route.ts aslinya di-share.
  const handleSubmit = async (publish: boolean) => {
    if (!title.trim()) {
      setErrorMsg("Judul artikel wajib diisi.");
      return;
    }
    setLoading(true);
    setSaveStatus("saving");
    setErrorMsg("");

    const fd = new FormData();
    fd.append("title", title);
    fd.append("slug", slug);
    fd.append("content", editor?.getHTML() || "");
    fd.append("excerpt", excerpt);
    fd.append("published", String(publish));
    fd.append("coverImage", coverImage);
    fd.append("seoTitle", seoTitle || title);
    fd.append("seoDescription", seoDescription);
    fd.append("categoryIds", JSON.stringify(selectedCategories));
    fd.append("tagIds", JSON.stringify(selectedTags));

    try {
      const res = postId
        ? await fetch(`/api/blog-posts/${postId}`, { method: "PUT", body: fd })
        : await fetch("/api/blog-posts", { method: "POST", body: fd });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const id = data?.data?.id || data?.id;
      if (id) setPostId(id);
      setPublished(publish);

      if (!publish) {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        window.location.href = "/dashboard/blog-posts";
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

      {/* Full-screen overlay, sama alasannya kayak ProjectFormClient — keluar
          dari flow AdminLayout (Header + BottomNav) biar gak rebutan tinggi. */}
      <div className="fixed inset-0 z-[999] flex flex-col bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
        <BlogPostTopBar
          title={title}
          published={published}
          slug={slug}
          loading={loading}
          saveStatus={saveStatus}
          canPreview={canPreview}
          onSaveDraft={() => handleSubmit(false)}
          onPublish={() => handleSubmit(true)}
          onPreviewBlocked={() => setErrorMsg("Simpan draf dulu sebelum preview.")}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
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

            <div className="flex-1 overflow-y-auto bg-white min-h-0" style={{ scrollbarGutter: "stable" }}>
              <div className="px-10 pt-10 pb-2 border-b border-slate-100">
                <input
                  className="text-[2rem] font-bold w-full outline-none text-[#0F2340] placeholder:text-slate-300 leading-snug"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tambahkan judul"
                />
                {slug && (
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">
                    /<span className="text-[#E87722]">{slug}</span>
                  </p>
                )}
              </div>
              <EditorContent editor={editor} className="w-full" />
            </div>
          </div>

          <BlogPostSidebar
            editor={editor}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            open={sidebarOpen}
            published={published}
            setPublished={setPublished}
            publishedAt={initialData?.publishedAt}
            slug={slug}
            setSlug={(v) => {
              setSlugTouched(true);
              setSlug(v);
            }}
            excerpt={excerpt}
            setExcerpt={setExcerpt}
            categories={categories}
            setCategories={setCategories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            tags={tags}
            setTags={setTags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            coverImage={coverImage}
            setCoverImage={setCoverImage}
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