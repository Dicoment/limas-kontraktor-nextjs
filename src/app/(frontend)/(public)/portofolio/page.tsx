import { prisma } from "@/lib/prisma"

export default async function PortfolioPage() {
  const [allCategories, allProjects] = await Promise.all([
    prisma.category.findMany({ where: { type: "project" }, orderBy: { name: "asc" } }),
    prisma.project.findMany({ include: { categoryProjects: { include: { catEntry: true } } }, orderBy: { createdAt: "desc" } }),
  ])

  return (
    <div className="min-h-screen py-12 px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Portofolio</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm">All</button>
        {allCategories.map((c) => (
          <button key={c.id} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200">
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allProjects.map((project) => (
          <a key={project.id} href={`/portofolio/${project.slug}`} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition block">
            <div className="h-56 bg-slate-100 relative">
              {project.coverImage ? (
                <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">No Image</div>
              )}
              <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full ${
                project.status === "COMPLETED" ? "bg-green-500 text-white" :
                project.status === "ONGOING" ? "bg-blue-500 text-white" : "bg-amber-500 text-white"
              }`}>
                {project.status}
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h3 className="font-bold text-lg text-slate-800">{project.title}</h3>
              <p className="text-sm text-slate-600 line-clamp-2">{project.description}</p>
              <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                <span>{project.client || project.location || "Indonesia"}</span>
                <span>{new Date(project.createdAt).toLocaleDateString("id-ID")}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}