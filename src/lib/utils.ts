import { format } from "date-fns"

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—"
  return typeof date === "string" ? date : format(date, "yyyy-MM-dd")
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + "..." : str
}

export function formatCurrency(value: number | null | undefined) {
  if (value == null) return "—"
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value)
}

export function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ")
}