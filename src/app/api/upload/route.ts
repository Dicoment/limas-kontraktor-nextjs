import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import crypto from "crypto"

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
const MAX_FILE_SIZE = 5 * 1024 * 1024

const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads")

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
    const boundaryEnd = Buffer.from(`--${boundary}--`)
    
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

    const fieldName = contentDisposition[1]
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

    const fileExtension = path.extname(originalName) || getFileExtensionFromMime(mimeType)
    const uniqueFileName = `${generateId()}${fileExtension}`
    const filePath = path.join(uploadDir, uniqueFileName)

    try {
      fs.writeFileSync(filePath, fileData)
    } catch (error) {
      console.error("Gagal menyimpan file:", error)
      return NextResponse.json({ error: "Failed to save file" }, { status: 500 })
    }

    const relativeUrl = `/uploads/${uniqueFileName}`

    return NextResponse.json({ success: true, url: relativeUrl, filename: uniqueFileName }, { status: 201 })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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

function generateId(): string {
  return crypto.randomBytes(16).toString("hex")
}