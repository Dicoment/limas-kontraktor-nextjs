import { getAllProjects } from "@/actions/misc.actions"
import { getAllVirtualTourScenes, createVirtualTourScene, updateVirtualTourScene } from "@/actions/virtual-tour.actions"
import VirtualTourFormClient from "@/components/virtual-tour/VirtualTourFormClient"

export const dynamic = "force-dynamic"

export default async function NewVirtualTourPage() {
  const [projects, sceneOptions] = await Promise.all([getAllProjects(), getAllVirtualTourScenes()])

  return (
    <div className="p-6">
      <VirtualTourFormClient
        projects={projects}
        sceneOptions={sceneOptions}
        createScene={createVirtualTourScene}
        updateScene={updateVirtualTourScene}
      />
    </div>
  )
}