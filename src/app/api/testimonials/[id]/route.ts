import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"
import { testimonialUpdateSchema } from "@/backend-schemas/testimonial.schema"
import { z } from "zod"
import { formatTestimonial, validateRating } from "@/helpers/testimonial-helpers"
import fs from "fs"
import path from "path"
import crypto from "crypto"

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
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
    
    if (!testimonial) return notFoundResponse("Testimonial")
    
    const formattedTestimonial = formatTestimonial(testimonial)
    return successResponse(formattedTestimonial)
  } catch (error) {
    console.error("GET /api/testimonials/[id] error:", error)
    return errorResponse("Failed to fetch testimonial", 500)
  }
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const contentType = request.headers.get("content-type") || ""
    
    let body: any
    let avatarUrl: string | null | undefined = undefined
    
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
      
      const uploadDir = path.join(process.cwd(), "public", "uploads")
      try {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }
      } catch (error) {
        console.error("Gagal membuat direktori upload. Cek permission Docker volume:", error)
        return errorResponse("Server storage configuration error", 500)
      }

      if (avatarFile) {
        if (!ALLOWED_MIME_TYPES.includes(avatarFile.type)) {
          return errorResponse(`File type '${avatarFile.type}' not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`, 400)
        }
        if (avatarFile.data.length > MAX_FILE_SIZE) {
          return errorResponse(`Avatar size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`, 400)
        }
        
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
        avatar: avatarUrl ?? fields.avatarUrl ?? null,
        published: fields.published === "true",
        projectId: fields.projectId || null,
      }
    } else {
      try {
        body = await request.json()
      } catch (error) {
        return errorResponse("Invalid JSON body", 400)
      }
    }
    
    const validatedData = testimonialUpdateSchema.parse(body)
    
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    })
    
    if (!existingTestimonial) return notFoundResponse("Testimonial")
    
    let validatedRating: number | null = existingTestimonial.rating
    if (validatedData.rating !== undefined) {
      try {
        validatedRating = validateRating(validatedData.rating)
      } catch (error) {
        return errorResponse("Rating must be between 1 and 5", 400)
      }
    }
    
    if (validatedData.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: validatedData.projectId },
        select: { id: true, title: true }
      })
      
      if (!project) {
        return errorResponse("Project not found", 404)
      }
    }
    
    const { rating, ...restData } = validatedData
    
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...restData,
        rating: validatedRating ?? undefined,
        avatar: avatarUrl ?? restData.avatar,
      },
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
    return successResponse(formattedTestimonial)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return notFoundResponse("Testimonial")
    }
    console.error("PUT /api/testimonials/[id] error:", error)
    return errorResponse("Failed to update testimonial", 500)
  }
}

export async function PATCH(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    let body
    try {
      body = await request.json()
    } catch (error) {
      return errorResponse("Invalid JSON body", 400)
    }
    
    const validatedData = testimonialUpdateSchema.parse(body)
    
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    })
    
    if (!existingTestimonial) return notFoundResponse("Testimonial")
    
    let validatedRating: number | null = existingTestimonial.rating
    if (validatedData.rating !== undefined) {
      try {
        validatedRating = validateRating(validatedData.rating)
      } catch (error) {
        return errorResponse("Rating must be between 1 and 5", 400)
      }
    }
    
    if (validatedData.projectId && validatedData.projectId !== existingTestimonial.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: validatedData.projectId },
        select: { id: true, title: true }
      })
      
      if (!project) {
        return errorResponse("Project not found", 404)
      }
    }
    
    const { rating, ...restData } = validatedData
    
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...restData,
        ...(rating !== undefined && { rating: validatedRating ?? undefined }),
        projectId: validatedData.projectId,
      },
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
    return successResponse(formattedTestimonial)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return notFoundResponse("Testimonial")
    }
    console.error("PATCH /api/testimonials/[id] error:", error)
    return errorResponse("Failed to update testimonial", 500)
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    })
    
    if (!existingTestimonial) return notFoundResponse("Testimonial")
    
    await prisma.testimonial.delete({ 
      where: { id } 
    })
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("DELETE /api/testimonials/[id] error:", error)
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return notFoundResponse("Testimonial")
    }
    return errorResponse("Failed to delete testimonial", 500)
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