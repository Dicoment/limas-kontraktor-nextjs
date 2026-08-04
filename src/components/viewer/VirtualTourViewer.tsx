"use client"

import { useEffect, useRef } from "react"

type Scene = {
  id: string
  title: string
  imageUrl: string
  hotspots?: { targetSceneId: string; label: string; yaw: number; pitch: number }[]
}

export default function VirtualTourViewer({ scenes }: { scenes: Scene[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || scenes.length === 0) return

    let viewer: any
    let panoramaMap: Record<string, any> = {}

    // Panolens butuh window, jadi import secara dinamis di client
    import("panolens").then((PANOLENS) => {
      const container = containerRef.current!
      viewer = new PANOLENS.Viewer({ container })

      // Bikin semua panorama dari daftar scene
      scenes.forEach((scene) => {
        const panorama = new PANOLENS.ImagePanorama(scene.imageUrl)
        panoramaMap[scene.id] = panorama
        viewer.add(panorama)
      })

      // Tambahkan hotspot penghubung antar ruangan
      scenes.forEach((scene) => {
        const panorama = panoramaMap[scene.id]
        scene.hotspots?.forEach((hs) => {
          const target = panoramaMap[hs.targetSceneId]
          if (!target) return
          const infospot = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow)
          infospot.position.set(hs.yaw, hs.pitch, -1000)
          infospot.addEventListener("click", () => viewer.setPanorama(target))
          infospot.addHoverText(hs.label)
          panorama.add(infospot)
        })
      })

      viewer.setPanorama(panoramaMap[scenes[0].id])
    })

    return () => viewer?.dispose()
  }, [scenes])

  return <div ref={containerRef} className="w-full h-[70vh] rounded-lg overflow-hidden bg-black" />
}