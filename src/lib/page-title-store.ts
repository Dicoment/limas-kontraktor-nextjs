type Listener = () => void

let overrideTitle: string | null = null
const listeners = new Set<Listener>()

export function setPageTitleOverride(title: string | null) {
  overrideTitle = title
  listeners.forEach((l) => l())
}

export function getPageTitleOverride() {
  return overrideTitle
}

export function subscribePageTitleOverride(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}