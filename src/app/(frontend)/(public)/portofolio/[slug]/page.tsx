import { prisma } from "@/lib/prisma"

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      categoryProjects: { include: { category: true } },
      projectTeams: { include: { team: true } },
      testimonials: { take: 3 },
    },
  })
  if (!project) {
    return <div className="min-h-screen py-12 px-8 text-center"><h1 className="text-4xl">404</h1></div>
  }

  return (
    <div className="min-h-screen py-12 px-8 max-w-5xl mx-auto">
      <p className="text-blue-600 text-sm mb-6">← Back to Portfolio</p>
      <h1 className="text-3xl font-bold text-slate-800 mb-4">{project.title}</h1>
      <p className="text-slate-600 mb-4">{project.description?.slice(0, 200)}...</p>
      <p className="text-sm text-slate-400 mb-8">Status: {project.status} | Client: {project.client || "—"} | Location: {project.location || "—"}</p>

      <h2 className="text-xl font-bold text-slate-800 mb-4">Categories</h2>
      <div className="flex gap-2 mb-8">
        {(project.categoryProjects || []).map((cat: any) => (
          <span key={cat.categoryId} className="px-3 py-1 text-sm rounded-full bg-slate-100 text-slate-600">{cat.category.name}</span>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-4">Team ({project.projectTeams?.length || 0})</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {(project.projectTeams || []).map((pt: any) => (
          <div key={pt.teamId} className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
              {pt.team.avatar ? <img src={pt.team.avatar} alt={pt.team.name} className="w-12 h-12 rounded-full object-cover" /> : pt.team.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-slate-800">{pt.team.name}</p>
              <p className="text-xs text-slate-500">{pt.role || pt.team.position || "—"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}