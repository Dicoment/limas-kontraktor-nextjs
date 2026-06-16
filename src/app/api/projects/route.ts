import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-response"
import { projectSchema } from "@/backend-schemas/project.schema"
import { z } from "zod"
import { 
  formatProjects, 
  formatProject,
  buildProjectWhereInput, 
  getPaginationParams,
  getSortParams,
  validateGallery
} from "@/helpers/project-helpers"
import fs from "fs"
import path from "path"
import crypto from "crypto"

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const where = buildProjectWhereInput(searchParams)
    const { page, limit, skip } = getPaginationParams(searchParams)
    const orderBy = getSortParams(searchParams)

    const [data, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          categoryProjects: { include: { catEntry: true } },
          projectTeams: { include: { teamEntry: true } },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.project.count({ where }),
    ])
    
    const formattedData = formatProjects(data)
    const totalPages = Math.ceil(total / limit)
    
    return successResponse({
      items: formattedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    })
  } catch (error) {
    console.error("GET /api/projects error:", error)
    return errorResponse("Failed to fetch projects", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || ""
    
    if (!contentType.includes("multipart/form-data")) {
      return errorResponse("Content-Type must be multipart/form-data", 400)
    }

    const boundary = contentType.split("boundary=")[1]
    if (!boundary) {
      return errorResponse("No boundary found in content-type", 400)
    }

    const rawBody = await request.arrayBuffer()
    const buffer = Buffer.from(rawBody)
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

    const imageFile = files.find(f => f.name === "image")
    const galleryFiles = files.filter(f => f.name === "galleryFiles")

    if (imageFile) {
      if (!ALLOWED_MIME_TYPES.includes(imageFile.type)) {
        return errorResponse(`File type '${imageFile.type}' not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`, 400)
      }
      if (imageFile.data.length > MAX_FILE_SIZE) {
        return errorResponse(`Cover image size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`, 400)
      }
    }

    for (const gf of galleryFiles) {
      if (!ALLOWED_MIME_TYPES.includes(gf.type)) {
        return errorResponse(`Gallery file type '${gf.type}' not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`, 400)
      }
      if (gf.data.length > MAX_FILE_SIZE) {
        return errorResponse(`Gallery file size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`, 400)
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

    let coverImageUrl: string | null = fields.coverImage || null
    
    if (imageFile) {
      const fileExtension = path.extname(imageFile.originalName) || getFileExtensionFromMime(imageFile.type)
      const uniqueFileName = `${generateId()}${fileExtension}`
      const filePath = path.join(uploadDir, uniqueFileName)

      try {
        fs.writeFileSync(filePath, imageFile.data)
      } catch (error) {
        console.error("Gagal menyimpan file:", error)
        return errorResponse("Failed to save cover image", 500)
      }

      coverImageUrl = `/uploads/${uniqueFileName}`
    }

    let galleryUrls: string[] = []
    
    for (const gf of galleryFiles) {
      const fileExtension = path.extname(gf.originalName) || getFileExtensionFromMime(gf.type)
      const uniqueFileName = `${generateId()}${fileExtension}`
      const filePath = path.join(uploadDir, uniqueFileName)

      try {
        fs.writeFileSync(filePath, gf.data)
      } catch (error) {
        console.error("Gagal menyimpan gallery file:", error)
        return errorResponse("Failed to save gallery image", 500)
      }

      galleryUrls.push(`/uploads/${uniqueFileName}`)
    }

    const parsedBody = {
      title: fields.title,
      slug: fields.slug,
      description: fields.description,
      location: fields.location || null,
      client: fields.client || null,
      limasRole: fields.limasRole || null,
      coverImage: coverImageUrl,
      gallery: galleryUrls.length > 0 ? galleryUrls : (fields.gallery ? JSON.parse(fields.gallery) : []),
      status: fields.status,
      seoTitle: fields.seoTitle || null,
      seoDescription: fields.seoDescription || null,
      categoryIds: fields.categoryIds ? JSON.parse(fields.categoryIds) : [],
      teamIds: fields.teamIds ? JSON.parse(fields.teamIds) : [],
    }

    const validatedData = projectSchema.parse(parsedBody)
    
    const { 
      title, slug, description, location, client, limasRole, 
      coverImage, gallery, status, seoTitle, seoDescription, 
      categoryIds, teamIds 
    } = validatedData

    const existing = await prisma.project.findUnique({ 
      where: { slug } 
    })
    
    if (existing) {
      return errorResponse("Project with this slug already exists", 409)
    }

    const validatedGallery = validateGallery(gallery)

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description: description || "",
        location: location || null,
        client: client || null,
        limasRole: limasRole || null,
        coverImage: coverImage || null,
        gallery: validatedGallery,
        status: status || "DRAFT",
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        categoryProjects: categoryIds?.length
          ? { create: categoryIds.map((cid: string) => ({ catEntry: { connect: { id: cid } } })) }
          : undefined,
        projectTeams: teamIds?.length
          ? { create: teamIds.map(({ teamId, role }) => ({ 
              teamEntry: { connect: { id: teamId } }, 
              role: role || null 
            })) }
          : undefined,
      },
      include: {
        categoryProjects: { include: { catEntry: true } },
        projectTeams: { include: { teamEntry: true } },
      },
    })
    
    const formattedProject = formatProject(project)
    return successResponse(formattedProject, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    console.error("POST /api/projects error:", error)
    return errorResponse("Failed to create project", 500)
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