"use client"

import { useEffect } from "react"
import { setPageTitleOverride } from "@/lib/page-title-store"

export function SetPageTitle({ title }: { title: string }) {
  useEffect(() => {
    setPageTitleOverride(title)
    return () => setPageTitleOverride(null)
  }, [title])

  return null
}