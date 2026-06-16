import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]
const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads")

export async function GET(request: NextRequest) {
  try {
    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({ success: true, files: [] })
    }

    const entries = fs.readdirSync(uploadDir, { withFileTypes: true })
    const files = entries
      .filter(entry => entry.isFile())
      .filter(entry => ALLOWED_IMAGE_EXTENSIONS.includes(path.extname(entry.name).toLowerCase()))
      .map(entry => ({
        url: `/uploads/${entry.name}`,
        name: entry.name,
      }))

    return NextResponse.json({ success: true, files })
  } catch (error) {
    console.error("Error reading media directory:", error)
    return NextResponse.json({ success: false, error: "Failed to read media directory" }, { status: 500 })
  }
}