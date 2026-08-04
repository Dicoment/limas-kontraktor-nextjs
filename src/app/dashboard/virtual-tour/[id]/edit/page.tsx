import { notFound } from "next/navigation"
import { getAllProjects } from "@/actions/misc.actions"
import { getVirtualTourSceneById, getAllVirtualTourScenes, createVirtualTourScene, updateVirtualTourScene } from "@/actions/virtual-tour.actions"
import VirtualTourFormClient from "@/components/virtual-tour/VirtualTourFormClient"

export const dynamic = "force-dynamic"

export default async function EditVirtualTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [scene, projects, sceneOptions] = await Promise.all([
    getVirtualTourSceneById(id),
    getAllProjects(),
    getAllVirtualTourScenes(),
  ])

  if (!scene) notFound()

  return (
    <div className="p-6">
      <VirtualTourFormClient
        scene={scene as any}
        projects={projects}
        sceneOptions={sceneOptions}
        createScene={createVirtualTourScene}
        updateScene={updateVirtualTourScene}
      />
    </div>
  )
}