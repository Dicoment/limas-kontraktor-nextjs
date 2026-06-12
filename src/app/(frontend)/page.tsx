import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [projects, testimonials, teams] = await Promise.all([
    prisma.project.findMany({ take: 6, orderBy: { createdAt: "desc" } }),
    prisma.testimonial.findMany({ where: { published: true }, take: 6 }),
    prisma.team.findMany({ take: 6, orderBy: { displayOrder: "asc" } }),
  ])

  return (
    <div className="min-h-screen">
      <section className="bg-slate-900 text-white py-20 px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Limas Kontraktor</h1>
        <p className="text-slate-300 max-w-2xl mx-auto mb-8">Solusi konstruksi terpercaya untuk proyek komersial, industri, dan hunian. Dedikasi, kualitas, dan ketepatan waktu.</p>
        <a href="/portofolio" className="inline-block px-8 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600">Lihat Portofolio</a>
      </section>

      <section className="py-16 px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">Proyek Terbaru</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p: { id: string; slug: string; title: string; coverImage: string | null; status: string; client: string | null; location: string | null }) => (
            <a key={p.id} href={`/portofolio/${p.slug}`} className="bg-white rounded-lg shadow hover:shadow-lg transition block">
              <div className="h-48 bg-slate-100 rounded-t-lg flex items-center justify-center">
                {p.coverImage ? <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover rounded-t-lg" /> : <span className="text-slate-400">No Image</span>}
              </div>
              <div className="p-4">
                <span className={`inline-block px-2 py-1 text-xs rounded-full mb-2 ${p.status === "COMPLETED" ? "bg-green-100 text-green-700" : p.status === "ONGOING" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>{p.status}</span>
                <h3 className="font-semibold text-slate-800">{p.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{p.client || p.location || "Indonesia"}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="py-16 px-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-8">Apa Kata Klien Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t: { id: string; clientName: string; content: string; avatar: string | null; rating: number | null }) => (
                <div key={t.id} className="bg-white p-6 rounded-lg shadow">
                  <p className="text-slate-600 italic">"{t.content}"</p>
                  <div className="flex items-center gap-3 mt-4">
                    {t.avatar && <img src={t.avatar} alt={t.clientName} className="w-10 h-10 rounded-full" />}
                    <div>
                      <p className="font-medium text-slate-800">{t.clientName}</p>
                      {t.rating && <p className="text-xs text-slate-400">{"⭐".repeat(t.rating)}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}