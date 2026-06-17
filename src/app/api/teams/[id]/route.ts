import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"
import { teamUpdateSchema } from "@/backend-schemas/team.schema"
import { z } from "zod"
import { formatTeam, validateEmail, validatePhone } from "@/helpers/team-helpers"
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
    
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        projectTeams: {
          include: {
            projEntry: {
              select: {
                id: true,
                title: true,
                slug: true,
                status: true,
                coverImage: true
              }
            }
          }
        }
      }
    })
    
    if (!team) return notFoundResponse("Team")
    
    const formattedTeam = formatTeam(team)
    return successResponse(formattedTeam)
  } catch (error) {
    console.error("GET /api/teams/[id] error:", error)
    return errorResponse("Failed to fetch team", 500)
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
        name: fields.name,
        position: fields.position || null,
        bio: fields.bio || null,
        avatar: avatarUrl ?? fields.avatarUrl ?? null,
        email: fields.email || null,
        phone: fields.phone || null,
        displayOrder: fields.displayOrder ? parseInt(fields.displayOrder) : 0,
      }
    } else {
      try {
        body = await request.json()
      } catch (error) {
        return errorResponse("Invalid JSON body", 400)
      }
    }
    
    const validatedData = teamUpdateSchema.parse(body)
    
    const existingTeam = await prisma.team.findUnique({
      where: { id }
    })
    
    if (!existingTeam) return notFoundResponse("Team")
    
    let validatedEmail = existingTeam.email
    if (validatedData.email !== undefined) {
      if (validatedData.email) {
        try {
          validatedEmail = validateEmail(validatedData.email)
        } catch (error) {
          return errorResponse("Invalid email format", 400)
        }
      } else {
        validatedEmail = null
      }
    }
    
    let validatedPhone = existingTeam.phone
    if (validatedData.phone !== undefined) {
      if (validatedData.phone) {
        try {
          validatedPhone = validatePhone(validatedData.phone)
        } catch (error) {
          return errorResponse("Invalid phone number format", 400)
        }
      } else {
        validatedPhone = null
      }
    }
    
    const team = await prisma.team.update({
      where: { id },
      data: {
        ...validatedData,
        email: validatedEmail,
        phone: validatedPhone,
      },
      include: {
        projectTeams: {
          include: {
            projEntry: {
              select: {
                id: true,
                title: true,
                slug: true,
                status: true,
                coverImage: true
              }
            }
          }
        }
      }
    })
    
    const formattedTeam = formatTeam(team)
    return successResponse(formattedTeam)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return notFoundResponse("Team")
    }
    console.error("PUT /api/teams/[id] error:", error)
    return errorResponse("Failed to update team", 500)
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