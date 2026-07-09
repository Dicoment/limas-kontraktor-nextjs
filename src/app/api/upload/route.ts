import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
const MAX_FILE_SIZE = 5 * 1024 * 1024

const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads")

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

// Helper untuk mencegah overwrite jika nama file persis sama sudah ada
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

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || ""
    
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Content-Type must be multipart/form-data" }, { status: 400 })
    }

    const boundary = contentType.split("boundary=")[1]
    if (!boundary) {
      return NextResponse.json({ error: "No boundary found in content-type" }, { status: 400 })
    }

    const body = await request.arrayBuffer()
    const buffer = Buffer.from(body)
    
    const boundaryBuffer = Buffer.from(`--${boundary}`)
    
    const fileStart = buffer.indexOf(boundaryBuffer)
    if (fileStart === -1) {
      return NextResponse.json({ error: "No file found in request" }, { status: 400 })
    }

    const headerEnd = buffer.indexOf(boundaryBuffer, fileStart + boundaryBuffer.length)
    const headersRaw = buffer.slice(fileStart + boundaryBuffer.length, headerEnd).toString()
    
    const contentDisposition = headersRaw.match(/Content-Disposition: form-data; name="([^"]+)"; filename="([^"]+)"/)
    if (!contentDisposition) {
      return NextResponse.json({ error: "Invalid file field in form data" }, { status: 400 })
    }

    const originalName = contentDisposition[2]

    const mimeMatch = headersRaw.match(/Content-Type: ([^\r\n]+)/)
    const mimeType = mimeMatch ? mimeMatch[1].trim() : "application/octet-stream"

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json({ error: `File type '${mimeType}' not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}` }, { status: 400 })
    }

    const bodyStart = headerEnd + boundaryBuffer.length
    const bodyEnd = buffer.indexOf(boundaryBuffer, bodyStart)
    
    let fileData = buffer.slice(bodyStart, bodyEnd)
    if (fileData[0] === 0x0d) fileData = fileData.slice(1)
    if (fileData[0] === 0x0a) fileData = fileData.slice(1)
    if (fileData[fileData.length - 1] === 0x0d) fileData = fileData.slice(0, fileData.length - 1)
    if (fileData[fileData.length - 1] === 0x0a) fileData = fileData.slice(0, fileData.length - 1)

    if (fileData.length > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB` }, { status: 400 })
    }

    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
    } catch (error) {
      console.error("Gagal membuat direktori upload. Cek permission Docker volume:", error)
      return NextResponse.json({ error: "Server storage configuration error" }, { status: 500 })
    }

    // --- PROSES NAMA SEO ---
    // 1. Bersihkan nama file (Contoh: "Foto Desain Rumah Baru.PNG" -> "foto-desain-rumah-baru.png")
    const seoFriendlyName = slugifyFileName(originalName)

    // 2. Proteksi duplikat (Contoh jika sudah ada: "foto-desain-rumah-baru-1.png")
    const targetFileName = getUniqueSEOFileName(uploadDir, seoFriendlyName)
    const filePath = path.join(uploadDir, targetFileName)

    try {
      fs.writeFileSync(filePath, fileData)
    } catch (error) {
      console.error("Gagal menyimpan file:", error)
      return NextResponse.json({ error: "Failed to save file" }, { status: 500 })
    }

    const relativeUrl = `/uploads/${targetFileName}`

    return NextResponse.json({ success: true, url: relativeUrl, filename: targetFileName }, { status: 201 })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}