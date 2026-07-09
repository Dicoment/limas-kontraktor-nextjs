"use server"

import fs from "fs"
import path from "path"

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"] as const
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Helper untuk membersihkan nama file agar aman untuk URL/SEO
function slugifyFileName(fileName: string): string {
  const ext = path.extname(fileName)
  const baseName = path.basename(fileName, ext)
  
  const cleanBase = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-") // Ganti spasi & karakter aneh jadi tanda hubung (-)
    .replace(/-+/g, "-")         // Hapus tanda hubung ganda berturut-turut
    .replace(/^-|-$/g, "")       // Hapus tanda hubung di awal/akhir nama

  return `${cleanBase || "image"}${ext.toLowerCase()}`
}

// Helper untuk mencegah overwrite jika nama file persis sama sudah ada di disk
function getUniqueSEOFileName(dir: string, targetName: string): string {
  const ext = path.extname(targetName)
  const baseName = path.basename(targetName, ext)
  
  let finalName = targetName
  let counter = 1

  while (fs.existsSync(path.join(dir, finalName))) {
    finalName = `${baseName}-${counter}${ext}`
    counter++
  }

  return finalName
}

export async function uploadImage(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  const file = formData.get("file") as File | null
  
  if (!file) {
    return { success: false, error: "No file provided" }
  }

  const mimeType = file.type
  if (!ALLOWED_MIME_TYPES.includes(mimeType as any)) {
    return { success: false, error: `File type '${mimeType}' not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}` }
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  if (buffer.length > MAX_FILE_SIZE) {
    return { success: false, error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB` }
  }

  const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads")
  
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
  } catch (error) {
    console.error("Gagal membuat direktori upload. Cek permission Docker volume:", error)
    return { success: false, error: "Server storage configuration error" }
  }

  // --- PROSES NAMA SEO ---
  // 1. Ubah nama file asli menjadi format bersih (Contoh: "Desain Rumah Baru Limas.PNG" -> "desain-rumah-baru-limas.png")
  const seoFriendlyName = slugifyFileName(file.name)

  // 2. Cek duplikasi di folder volume disk
  const targetFileName = getUniqueSEOFileName(uploadDir, seoFriendlyName)
  const filePath = path.join(uploadDir, targetFileName)

  try {
    fs.writeFileSync(filePath, buffer)
  } catch (error) {
    console.error("Gagal menyimpan file:", error)
    return { success: false, error: "Failed to save file" }
  }

  // Mengembalikan URL berbasis nama SEO bersih
  return { success: true, url: `/uploads/${targetFileName}` }
}