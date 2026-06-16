import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-response"
import { testimonialSchema } from "@/backend-schemas/testimonial.schema"
import { z } from "zod"
import { 
  formatTestimonials, 
  formatTestimonial,
  buildTestimonialWhereInput, 
  getPaginationParams,
  getSortParams,
  validateRating
} from "@/helpers/testimonial-helpers"
import fs from "fs"
import path from "path"
import crypto from "crypto"

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const where = buildTestimonialWhereInput(searchParams)
    const { page, limit, skip } = getPaginationParams(searchParams)
    const orderBy = getSortParams(searchParams)

    const [data, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              title: true,
              slug: true,
              coverImage: true
            }
          }
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.testimonial.count({ where }),
    ])
    
    const formattedData = formatTestimonials(data)
    const totalPages = Math.ceil(total / limit)
    
    const ratings = data.filter((t: { rating: number | null }) => t.rating !== null).map((t: { rating: number | null }) => t.rating as number)
    const averageRating = ratings.length > 0 
      ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length 
      : null
    
    return successResponse({
      items: formattedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      summary: {
        averageRating: averageRating ? Number(averageRating.toFixed(1)) : null,
        totalWithRating: ratings.length,
        totalPublished: data.filter((t: { published: boolean }) => t.published).length,
      }
    })
  } catch (error) {
    console.error("GET /api/testimonials error:", error)
    return errorResponse("Failed to fetch testimonials", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || ""
    
    let body: any
    let avatarUrl: string | null = null
    
    if (contentType.includes("multipart/form-data")) {
      const boundary = contentType.split("boundary=")[1]
      if (!boundary) {
        return errorResponse("No boundary found in content-type", 400)
      }

      const buf = await request.arrayBuffer()
      const buffer = Buffer.from(buf)
      const boundaryBuffer = Buffer.from(`--${boundary}`)
      
      const fields: Record<string, string> = {}
      const files: Array<{ name: string; data: Buffer; type: string; originalName: string }> = []
      
      let pos = 0
      while (pos < buffer.length) {
        const partStart = buffer.indexOf(boundaryBuffer, pos)
        if (partStart === -1) break
        
        const headerEnd = buffer.indexOf(boundaryBuffer, partStart + boundaryBuffer.length)
        if (headerEnd === -1) break
        
        const headersRaw = buffer.slice(partStart + boundaryBuffer.length, headerEnd).toString()
        
        const contentDispositionMatch = headersRaw.match(/Content-Disposition: form-data; name="([^"]+)"(?:; filename="([^"]+)")?/)
        if (!contentDispositionMatch) {
          pos = headerEnd + boundaryBuffer.length
          continue
        }
        
        const fieldName = contentDispositionMatch[1]
        const filename = contentDispositionMatch[2]
        
        const bodyStart = headerEnd + boundaryBuffer.length
        const bodyEnd = buffer.indexOf(boundaryBuffer, bodyStart)
        
        let content = buffer.slice(bodyStart, bodyEnd)
        if (content[0] === 0x0d) content = content.slice(1)
        if (content[0] === 0x0a) content = content.slice(1)
        if (content[content.length - 1] === 0x0d) content = content.slice(0, content.length - 1)
        if (content[content.length - 1] === 0x0a) content = content.slice(0, content.length - 1)
        
        if (filename) {
          const mimeMatch = headersRaw.match(/Content-Type: ([^\r\n]+)/)
          files.push({
            name: fieldName,
            data: content,
            type: mimeMatch ? mimeMatch[1].trim() : "",
            originalName: filename
          })
        } else {
          fields[fieldName] = content.toString()
        }
        
        pos = headerEnd + boundaryBuffer.length
      }

      const avatarFile = files.find(f => f.name === "avatar")

      if (avatarFile) {
        if (!ALLOWED_MIME_TYPES.includes(avatarFile.type)) {
          return errorResponse(`File type '${avatarFile.type}' not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`, 400)
        }
        if (avatarFile.data.length > MAX_FILE_SIZE) {
          return errorResponse(`Avatar size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`, 400)
        }
      }

      const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads")
      try {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }
      } catch (error) {
        console.error("Gagal membuat direktori upload. Cek permission Docker volume:", error)
        return errorResponse("Server storage configuration error", 500)
      }

      if (avatarFile) {
        const fileExtension = path.extname(avatarFile.originalName) || getFileExtensionFromMime(avatarFile.type)
        const uniqueFileName = `${generateId()}${fileExtension}`
        const filePath = path.join(uploadDir, uniqueFileName)

        try {
          fs.writeFileSync(filePath, avatarFile.data)
        } catch (error) {
          console.error("Gagal menyimpan file:", error)
          return errorResponse("Failed to save avatar", 500)
        }

        avatarUrl = `/uploads/${uniqueFileName}`
      } else if (fields.avatar) {
        avatarUrl = fields.avatar
      }

      body = {
        clientName: fields.clientName,
        content: fields.content,
        rating: fields.rating ? parseInt(fields.rating) : null,
        platform: fields.platform || "MANUAL",
        sourceUrl: fields.sourceUrl || null,
        avatar: avatarUrl,
        published: fields.published === "true",
        projectId: fields.projectId || null,
      }
    } else {
      try {
        body = await request.json()
      } catch (error) {
        return errorResponse("Invalid JSON body", 400)
      }
      
      if (body.avatar) {
        avatarUrl = body.avatar
      }
    }
    
    const validatedData = testimonialSchema.parse(body)
    
    const { 
      clientName, content, rating, platform, 
      sourceUrl, avatar, published, projectId 
    } = validatedData

    let validatedRating: number | null = null
    if (rating !== null && rating !== undefined) {
      try {
        validatedRating = validateRating(rating)
      } catch (error) {
        return errorResponse("Rating must be between 1 and 5", 400)
      }
    }

    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true, title: true }
      })
      
      if (!project) {
        return errorResponse("Project not found", 404)
      }
    }

    const testimonialData: any = {
      clientName,
      content,
      platform: platform || "MANUAL",
      sourceUrl: sourceUrl || null,
      avatar: avatar || null,
      published: published ?? false,
    }
    
    if (validatedRating !== null) {
      testimonialData.rating = validatedRating
    }
    if (projectId) {
      testimonialData.projectId = projectId
    }
    
    const testimonial = await prisma.testimonial.create({
      data: testimonialData,
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true
          }
        }
      }
    })
    
    const formattedTestimonial = formatTestimonial(testimonial)
    return successResponse(formattedTestimonial, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    console.error("POST /api/testimonials error:", error)
    return errorResponse("Failed to create testimonial", 500)
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