"use client"

import { useState } from "react"
import MediaPicker from "@/components/ui/MediaPicker"

interface ProjectFormClientProps {
  categories: any[]
  teams: any[]
}

export default function ProjectFormClient({ categories, teams }: ProjectFormClientProps) {
  const [coverImage, setCoverImage] = useState("")

  return (
    <form action="/api/projects" method="POST" className="bg-white rounded-lg shadow p-6 space-y-6">
      <input type="hidden" name="coverImage" value={coverImage} />
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <Field label="Title">
            <input name="title" className="w-full px-3 py-2 border border-slate-300 rounded" required />
          </Field>
          <Field label="Slug">
            <input name="slug" className="w-full px-3 py-2 border border-slate-300 rounded" required />
          </Field>
          <Field label="Location">
            <input name="location" className="w-full px-3 py-2 border border-slate-300 rounded" />
          </Field>
          <Field label="Client">
            <input name="client" className="w-full px-3 py-2 border border-slate-300 rounded" />
          </Field>
          <Field label="Limas Role">
            <input name="limasRole" className="w-full px-3 py-2 border border-slate-300 rounded" />
          </Field>
          <Field label="Cover Image">
            <MediaPicker value={coverImage} onChange={setCoverImage} />
            <p className="text-xs text-slate-400 mt-1">Pilih dari FileGator atau masukkan URL langsung</p>
          </Field>
        </div>
        <div className="space-y-4">
          <Field label="Status">
            <select name="status" defaultValue="DRAFT" className="w-full px-3 py-2 border border-slate-300 rounded">
              <option value="DRAFT">Draft</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </Field>
          <Field label="SEO Title">
            <input name="seoTitle" className="w-full px-3 py-2 border border-slate-300 rounded" />
          </Field>
          <Field label="SEO Description">
            <input name="seoDescription" className="w-full px-3 py-2 border border-slate-300 rounded" />
          </Field>
          <Field label="Categories">
            <select name="categoryIds" multiple className="w-full px-3 py-2 border border-slate-300 rounded h-24">
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
              ))}
            </select>
            <p className="text-xs text-slate-400">Ctrl+Click for multiple</p>
          </Field>
          <Field label="Team">
            {teams.map((team: any) => (
              <div key={team.id} className="flex gap-2 items-center mb-1">
                <input type="checkbox" name="teamIds" value={team.id} className="accent-blue-600" />
                <span className="text-sm w-24">{team.name}</span>
                <input name="teamRoles" placeholder="Role" className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm" />
              </div>
            ))}
          </Field>
        </div>
      </div>

      <Field label="Description">
        <textarea name="description" rows={4} className="w-full px-3 py-2 border border-slate-300 rounded" required />
      </Field>

      <Field label="Gallery URLs (JSON array)">
        <textarea name="gallery" rows={3} className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono" placeholder='["/uploads/image1.jpg", "/uploads/image2.jpg"]' />
      </Field>

      <div className="flex gap-3">
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
          Create Project
        </button>
        <a href="/dashboard/projects" className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50">Cancel</a>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  )
}