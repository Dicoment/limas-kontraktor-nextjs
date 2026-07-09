import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads")

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    // 1. Ambil nama file SEO dari URL secara async (Next.js 16 standard)
    const { filename } = await params
    const filePath = path.join(uploadDir, filename)

    // 2. Jika file tidak ada di volume VPS, kirim 404
    if (!fs.existsSync(filePath)) {
      return new NextResponse("Image Not Found", { status: 404 })
    }

    // 3. Baca file dari disk fisik
    const fileBuffer = fs.readFileSync(filePath)
    
    // 4. Tentukan Content-Type berdasarkan ekstensi file SEO-nya
    const ext = path.extname(filename).toLowerCase()
    let contentType = "image/jpeg"
    if (ext === ".webp") contentType = "image/webp"
    if (ext === ".png") contentType = "image/png"
    if (ext === ".gif") contentType = "image/gif"
    if (ext === ".svg") contentType = "image/svg+xml"

    // 5. Kembalikan raw data gambar beserta cache header biar loading web kencang
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Gagal menyajikan gambar SEO:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}