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
      <div className="min-h-[70vh] pt-44 flex items-center justify-center text-slate-500 text-sm bg-[#080B11]">
        Virtual tour belum tersedia.
      </div>
    )
  }

  return (
    <main className="w-full bg-[#080B11] text-white pt-36 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Ultra Minimalis - 1 Garis Aja */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <h1 className="text-xl md:text-2xl font-light tracking-wide text-white uppercase">
            Virtual Tour <span className="font-semibold text-slate-400">| VR 360°</span>
          </h1>
        </div>

        {/* Viewer Box Presisi 16:9 */}
        <div className="w-full aspect-[16/9] bg-black rounded-xl overflow-hidden border border-slate-800/80 shadow-2xl relative">
          <VirtualTourViewer scenes={formattedScenes} />
        </div>

      </div>
    </main>
  )
}