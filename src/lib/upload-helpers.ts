import fs from "fs"
import path from "path"
import crypto from "crypto"

export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"] as const
export const MAX_FILE_SIZE = 5 * 1024 * 1024

export const getUploadDir = () => {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads")
}

export const ensureUploadDir = (): { success: boolean; error?: string } => {
  const uploadDir = getUploadDir()
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    return { success: true }
  } catch (error) {
    console.error("Gagal membuat direktori upload. Cek permission Docker volume:", error)
    return { success: false, error: "Server storage configuration error" }
  }
}

export const validateFileType = (mimeType: string): boolean => {
  return ALLOWED_MIME_TYPES.includes(mimeType as any)
}

export const validateFileSize = (size: number): boolean => {
  return size <= MAX_FILE_SIZE
}

export const generateUniqueFilename = (originalName: string): string => {
  const extension = path.extname(originalName) || getFileExtensionFromMime(getMimeFromExtension(path.extname(originalName)) || "application/octet-stream")
  return `${generateId()}${extension}`
}

export const saveUploadedFile = (buffer: Buffer, filename: string): { success: boolean; url?: string; error?: string } => {
  const uploadDir = getUploadDir()
  const filePath = path.join(uploadDir, filename)
  
  try {
    fs.writeFileSync(filePath, buffer)
    return { success: true, url: `/uploads/${filename}` }
  } catch (error) {
    console.error("Gagal menyimpan file:", error)
    return { success: false, error: "Failed to save file" }
  }
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

function getMimeFromExtension(ext: string): string | undefined {
  const extToMime: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
  }
  return extToMime[ext.toLowerCase()]
}

function generateId(): string {
  return crypto.randomBytes(16).toString("hex")
}