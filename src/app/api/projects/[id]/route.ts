import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"
import { projectUpdateSchema } from "@/backend-schemas/project.schema"
import { z } from "zod"
import { formatProject, validateGallery } from "@/helpers/project-helpers"
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
    
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        categoryProjects: { include: { catEntry: true } },
        projectTeams: { include: { teamEntry: true } },
        testimonials: true,
      },
    })
    
    if (!project) return notFoundResponse("Project")
    
    const formattedProject = formatProject(project)
    return successResponse(formattedProject)
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error)
    return errorResponse("Failed to fetch project", 500)
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
    let coverImageUrl: string | null | undefined = undefined
    
    if (contentType.includes("multipart/form-data")) {
      const boundary = contentType.split("boundary=")[1]
      if (!boundary) {
        return errorResponse("No boundary found in content-type", 400)
      }

      const buf = await request.arrayBuffer()
      const buffer = Buffer.from(buf)
      const boundaryBuffer = Buffer.from(`--${boundary}`)
      
      const fields: Record<string, string> = {}
      const fileField = { name: "", data: null as Buffer | null, type: "", originalName: "" }
      
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
          fileField.name = fieldName
          fileField.data = content
          fileField.type = mimeMatch ? mimeMatch[1].trim() : ""
          fileField.originalName = filename
        } else {
          fields[fieldName] = content.toString()
        }
        
        pos = headerEnd + boundaryBuffer.length
      }

      if (fileField.data) {
        if (!ALLOWED_MIME_TYPES.includes(fileField.type)) {
          return errorResponse(`File type '${fileField.type}' not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`, 400)
        }
        if (fileField.data.length > MAX_FILE_SIZE) {
          return errorResponse(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`, 400)
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

        const fileExtension = path.extname(fileField.originalName) || getFileExtensionFromMime(fileField.type)
        const uniqueFileName = `${generateId()}${fileExtension}`
        const filePath = path.join(uploadDir, uniqueFileName)

        try {
          fs.writeFileSync(filePath, fileField.data)
        } catch (error) {
          console.error("Gagal menyimpan file:", error)
          return errorResponse("Failed to save file", 500)
        }

        coverImageUrl = `/uploads/${uniqueFileName}`
      } else if (fields.coverImage) {
        coverImageUrl = fields.coverImage
      }

      body = {
        title: fields.title,
        slug: fields.slug,
        description: fields.description,
        location: fields.location || null,
        client: fields.client || null,
        limasRole: fields.limasRole || null,
        gallery: fields.gallery ? JSON.parse(fields.gallery) : [],
        status: fields.status,
        seoTitle: fields.seoTitle || null,
        seoDescription: fields.seoDescription || null,
        categoryIds: fields.categoryIds ? JSON.parse(fields.categoryIds) : [],
        teamIds: fields.teamIds ? JSON.parse(fields.teamIds) : [],
      }
    } else {
      try {
        body = await request.json()
      } catch (error) {
        return errorResponse("Invalid JSON body", 400)
      }
    }
    
    const validatedData = projectUpdateSchema.parse(body)
    
    const existingProject = await prisma.project.findUnique({
      where: { id }
    })
    
    if (!existingProject) return notFoundResponse("Project")
    
    if (validatedData.slug && validatedData.slug !== existingProject.slug) {
      const slugExists = await prisma.project.findUnique({
        where: { slug: validatedData.slug }
      })
      
      if (slugExists) {
        return errorResponse("Slug already exists", 409)
      }
    }
    
    const { categoryIds, teamIds, gallery, ...updateData } = validatedData
    
    const validatedGallery = gallery !== undefined ? validateGallery(gallery) : undefined
    
    const updatePayload: any = {
      ...updateData,
      ...(validatedGallery !== undefined && { gallery: validatedGallery }),
    }
    
    if (coverImageUrl !== undefined) {
      updatePayload.coverImage = coverImageUrl
    }
    
    const updatedProject = await prisma.$transaction(async (tx: any) => {
      if (categoryIds !== undefined) {
        await tx.categoryProject.deleteMany({ where: { projectId: id } })
        if (categoryIds.length > 0) {
          await tx.categoryProject.createMany({
            data: categoryIds.map((cid: string) => ({ 
              projectId: id, 
              categoryId: cid 
            }))
          })
        }
      }
      
      if (teamIds !== undefined) {
        await tx.projectTeam.deleteMany({ where: { projectId: id } })
        if (teamIds.length > 0) {
          await tx.projectTeam.createMany({
            data: teamIds.map(({ teamId, role }: { teamId: string; role?: string }) => ({ 
              projectId: id, 
              teamId: teamId,
              role: role || null
            }))
          })
        }
      }
      
      return await tx.project.update({
        where: { id },
        data: updatePayload,
      })
    })
    
    const finalProject = await prisma.project.findUnique({
      where: { id },
      include: {
        categoryProjects: { include: { catEntry: true } },
        projectTeams: { include: { teamEntry: true } },
        testimonials: true,
      },
    })
    
    const formattedProject = formatProject(finalProject!)
    return successResponse(formattedProject)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    console.error("PUT /api/projects/[id] error:", error)
    return errorResponse("Failed to update project", 500)
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        testimonials: { select: { id: true } }
      }
    })
    
    if (!existingProject) return notFoundResponse("Project")
    
    if (existingProject.testimonials.length > 0) {
      return errorResponse(
        "Cannot delete project because it has testimonials. Delete testimonials first.",
        409
      )
    }
    
    await prisma.project.delete({ 
      where: { id } 
    })
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error)
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return notFoundResponse("Project")
    }
    return errorResponse("Failed to delete project", 500)
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