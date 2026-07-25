import { notFound } from "next/navigation"
import Link from "next/link"
import { cache } from "react"
import type { Metadata } from "next"
import { getLeadsLogById } from "@/actions/misc.actions"
import { SetPageTitle } from "@/components/admin/SetPageTitle"
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Folder, 
  MessageSquare, 
  Globe, 
  Shield, 
  Monitor, 
  Calendar, 
  Send,
  ExternalLink
} from "lucide-react"

export const dynamic = "force-dynamic"

// Menggunakan React cache agar generateMetadata dan Halaman tidak melakukan query ganda
const getLead = cache((id: string) => getLeadsLogById(id))

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const lead = await getLead(id)
  return {
    title: lead?.name ? `${lead.name} — Leads Log` : "Detail Leads Log",
  }
}

export default async function LeadsLogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lead = await getLead(id)

  if (!lead) notFound()

  const rawPhone = lead.phone ? lead.phone.replace(/\D/g, "") : ""
  const formattedPhone = rawPhone.startsWith("0") ? `62${rawPhone.slice(1)}` : rawPhone

  const defaultWaMessage = encodeURIComponent(
    `Halo ${lead.name || ""}, terima kasih telah menghubungi kami melalui website. Ada yang bisa kami bantu?`
  )
  const waLink = rawPhone ? `https://wa.me/${formattedPhone}?text=${defaultWaMessage}` : null

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
      <SetPageTitle title={lead.name || "Detail Leads Log"} />

      <div className="space-y-3">
        <Link 
          href="/dashboard/leads-logs" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" /> 
          Kembali ke Leads Log
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight break-words">
              {lead.name || "Anonymous Lead"}
            </h1>
            <p className="text-xs text-slate-400 font-mono">ID: {id}</p>
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium self-start sm:self-auto shrink-0">
            <Calendar size={13} className="text-slate-400" />
            {new Date(lead.createdAt).toLocaleString("id-ID", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </div>
        </div>
      </div>

      {waLink && (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h2 className="text-sm font-semibold text-emerald-900">Respons Cepat</h2>
            <p className="text-xs text-emerald-700">
              Langsung hubungi <span className="font-medium">{lead.name || "klien"}</span> via WhatsApp.
            </p>
          </div>
          
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium rounded-lg shadow-sm transition-all active:scale-[0.98] shrink-0 w-full sm:w-auto"
          >
            <Send size={15} />
            Hubungi via WhatsApp
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Informasi Kontak</h2>
          
          <div className="space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-50 text-slate-500 rounded-lg shrink-0">
                <User size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-xs text-slate-400 block font-medium">Nama Lengkap</span>
                <span className="text-sm font-semibold text-slate-800 break-words">{lead.name || "-"}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                <Phone size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-xs text-slate-400 block font-medium">No. HP / WhatsApp</span>
                {waLink ? (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1.5 break-all"
                  >
                    {lead.phone}
                    <ExternalLink size={12} className="shrink-0" />
                  </a>
                ) : (
                  <span className="text-sm text-slate-800">{lead.phone || "-"}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Konteks Proyek</h2>
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Folder size={18} />
            </div>
            <div className="min-w-0">
              <span className="text-xs text-slate-400 block font-medium">Proyek Terkait</span>
              <span className="text-sm font-semibold text-slate-800 break-words">
                {lead.project ? (
                  lead.project.title
                ) : lead.projectId ? (
                  <span className="text-amber-600 font-normal">
                    ID: {lead.projectId} <span className="text-xs opacity-75">(Proyek dihapus)</span>
                  </span>
                ) : (
                  "-"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <MessageSquare size={14} /> Pesan / Pertanyaan
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3.5 sm:p-4 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line break-words">
          {lead.message ? lead.message : <span className="text-slate-400 italic">Tidak ada pesan yang ditinggalkan.</span>}
        </div>
      </div>

      <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Metadata Teknikal</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          <div className="flex items-start gap-2.5">
            <Globe size={15} className="text-slate-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="font-medium text-slate-500 block">Halaman Asal (URL):</span>
              {lead.pageUrl ? (
                <a 
                  href={lead.pageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline break-all font-mono"
                >
                  {lead.pageUrl}
                </a>
              ) : (
                <span className="text-slate-400">-</span>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Shield size={15} className="text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-slate-500 block">Alamat IP:</span>
              <span className="font-mono text-slate-700">{lead.ipAddress || "-"}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 md:col-span-2">
            <Monitor size={15} className="text-slate-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="font-medium text-slate-500 block">User Agent:</span>
              <span className="font-mono text-slate-600 break-all leading-normal">
                {lead.userAgent || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}