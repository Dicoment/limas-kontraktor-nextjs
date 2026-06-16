import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"
import { blogPostUpdateSchema } from "@/backend-schemas/blog-post.schema"
import { z } from "zod"
import { formatBlogPost, validateAndParseDate } from "@/lib/blog-post-helpers"
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
    
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { 
        blogPostCategories: { include: { catEntry: true } }, 
        blogPostTags: { include: { tagEntry: true } } 
      },
    })
    
    if (!post) return notFoundResponse("BlogPost")
    
    const formattedPost = formatBlogPost(post)
    return successResponse(formattedPost)
  } catch (error) {
    console.error("GET /api/blog-posts/[id] error:", error)
    return errorResponse("Failed to fetch blog post", 500)
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

      const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads")
      try {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }
      } catch (error) {
        console.error("Gagal membuat direktori upload. Cek permission Docker volume:", error)
        return errorResponse("Server storage configuration error", 500)
      }

      if (imageFile) {
        if (!ALLOWED_MIME_TYPES.includes(imageFile.type)) {
          return errorResponse(`File type '${imageFile.type}' not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`, 400)
        }
        if (imageFile.data.length > MAX_FILE_SIZE) {
          return errorResponse(`Cover image size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`, 400)
        }
        
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
      } else if (fields.coverImage) {
        coverImageUrl = fields.coverImage
      }

      body = {
        title: fields.title,
        slug: fields.slug,
        content: fields.content,
        excerpt: fields.excerpt || null,
        published: fields.published === "true",
        publishedAt: fields.publishedAt || null,
        categoryIds: fields.categoryIds ? JSON.parse(fields.categoryIds) : [],
        tagIds: fields.tagIds ? JSON.parse(fields.tagIds) : [],
      }
    } else {
      try {
        body = await request.json()
      } catch (error) {
        return errorResponse("Invalid JSON body", 400)
      }
    }
    
    const validatedData = blogPostUpdateSchema.parse(body)
    
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    })
    
    if (!existingPost) return notFoundResponse("BlogPost")
    
    if (validatedData.slug && validatedData.slug !== existingPost.slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug: validatedData.slug }
      })
      
      if (slugExists) {
        return errorResponse("Slug already exists", 409)
      }
    }
    
    const { categoryIds, tagIds, published, publishedAt, ...data } = validatedData
    
    let finalPublishedAt = existingPost.publishedAt
    if (publishedAt !== undefined) {
      try {
        finalPublishedAt = validateAndParseDate(publishedAt)
      } catch (error) {
        return errorResponse("Invalid publishedAt date format", 400)
      }
    }
    
    if (validatedData.published === true && !existingPost.published && !finalPublishedAt) {
      finalPublishedAt = new Date()
    } else if (validatedData.published === false) {
      finalPublishedAt = null
    }
    
    const updateData: any = {
      ...data,
      coverImage: coverImageUrl ?? data.coverImage,
      published: validatedData.published ?? existingPost.published,
      publishedAt: finalPublishedAt,
    }
    
    const updated = await prisma.$transaction(async (tx: any) => {
      if (categoryIds !== undefined) {
        await tx.blogPostCategory.deleteMany({ where: { blogPostId: id } })
        if (categoryIds.length > 0) {
          await tx.blogPostCategory.createMany({
            data: categoryIds.map((cid: string) => ({ 
              blogPostId: id, 
              categoryId: cid 
            }))
          })
        }
      }
      
      if (tagIds !== undefined) {
        await tx.blogPostTag.deleteMany({ where: { blogPostId: id } })
        if (tagIds.length > 0) {
          await tx.blogPostTag.createMany({
            data: tagIds.map((tid: string) => ({ 
              blogPostId: id, 
              tagId: tid 
            }))
          })
        }
      }
      
      return await tx.blogPost.update({
        where: { id },
        data: updateData,
        include: { 
          blogPostCategories: { include: { catEntry: true } }, 
          blogPostTags: { include: { tagEntry: true } } 
        },
      })
    })
    
    const formattedPost = formatBlogPost(updated)
    return successResponse(formattedPost)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation failed", 400, error.flatten().fieldErrors)
    }
    console.error("PUT /api/blog-posts/[id] error:", error)
    return errorResponse("Failed to update blog post", 500)
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