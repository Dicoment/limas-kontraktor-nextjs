import { getPublishedVirtualTourScenes } from "@/actions/virtual-tour.actions"
import VirtualTourViewer from "@/components/viewer/VirtualTourViewer"

export const dynamic = "force-dynamic"

export default async function VirtualTourPage() {
  const scenes = await getPublishedVirtualTourScenes()

  const formattedScenes = scenes.map((s) => ({
    id: s.id,
    title: s.title,
    imageUrl: s.imageUrl,
    hotspots: (s.hotspots as any[]) || [],
  }))

  if (formattedScenes.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400 text-sm">
        Virtual tour belum tersedia.
      </div>
    )
  }

  return (
    <div className="bg-slate-950">
      <div className="max-w-7xl mx-auto px-5 py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Virtual Tour 360°</h1>
        <VirtualTourViewer scenes={formattedScenes} />
      </div>
    </div>
  )
}