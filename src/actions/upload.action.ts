"use server"

import fs from "fs"
import path from "path"
import crypto from "crypto"

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"] as const
const MAX_FILE_SIZE = 5 * 1024 * 1024

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

  const fileExtension = path.extname(file.name) || getFileExtensionFromMime(mimeType)
  const uniqueFileName = `${generateId()}${fileExtension}`
  const filePath = path.join(uploadDir, uniqueFileName)

  try {
    fs.writeFileSync(filePath, buffer)
  } catch (error) {
    console.error("Gagal menyimpan file:", error)
    return { success: false, error: "Failed to save file" }
  }

  return { success: true, url: `/uploads/${uniqueFileName}` }
}

function getFileExtensionFromMime(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
  }
  return mimeToExt[mimeType] || ".bin"
}

function generateId(): string {
  return crypto.randomBytes(16).toString("hex")
}