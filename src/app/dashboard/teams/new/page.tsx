import { prisma } from "@/lib/prisma"

export default async function NewTeamPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold text-slate-800">New Team Member</h1>
      <form action="/api/teams" method="POST" className="bg-white rounded-lg shadow p-6 space-y-4">
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Name</label><input name="name" className="w-full px-3 py-2 border border-slate-300 rounded" required /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Position</label><input name="position" className="w-full px-3 py-2 border border-slate-300 rounded" /></div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
          <textarea name="bio" rows={3} className="w-full px-3 py-2 border border-slate-300 rounded" />
        </div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Avatar URL</label><input name="avatar" type="url" className="w-full px-3 py-2 border border-slate-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Email</label><input name="email" type="email" className="w-full px-3 py-2 border border-slate-300 rounded" /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Phone</label><input name="phone" className="w-full px-3 py-2 border border-slate-300 rounded" /></div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
          <input name="displayOrder" type="number" defaultValue={0} className="w-full px-3 py-2 border border-slate-300 rounded" />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">Create</button>
          <a href="/dashboard/teams" className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50">Cancel</a>
        </div>
      </form>
    </div>
  )
}