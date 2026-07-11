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
    
    const formData = await request.formData()
    
    const body: Record<string, any> = {}
    for (const [key, value] of (formData as any).entries()) {
      if (typeof value === "string") {
        body[key] = value
      }
    }
    
    let coverImageUrl: string | null = null
    const imageFile = formData.get("image") as File | null
    
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
    } catch (error) {
      console.error("Gagal membuat direktori upload. Cek permission Docker volume:", error)
      return errorResponse("Server storage configuration error", 500)
    }

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const mimeType = imageFile.type
      
      if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        return errorResponse(`File type '${mimeType}' not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`, 400)
      }
      if (buffer.length > MAX_FILE_SIZE) {
        return errorResponse(`Cover image size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`, 400)
      }
      
      const fileExtension = path.extname(imageFile.name) || getFileExtensionFromMime(mimeType)
      const uniqueFileName = `${generateId()}${fileExtension}`
      const filePath = path.join(uploadDir, uniqueFileName)

      try {
        fs.writeFileSync(filePath, buffer)
      } catch (error) {
        console.error("Gagal menyimpan file:", error)
        return errorResponse("Failed to save cover image", 500)
      }

      coverImageUrl = `/uploads/${uniqueFileName}`
    } else if (body.coverImage) {
      coverImageUrl = body.coverImage
    }
    
    if (typeof body.categoryIds === "string") {
      try {
        body.categoryIds = JSON.parse(body.categoryIds)
      } catch {
        body.categoryIds = []
      }
    }
    if (typeof body.tagIds === "string") {
      try {
        body.tagIds = JSON.parse(body.tagIds)
      } catch {
        body.tagIds = []
      }
    }
    // FIX: formData.entries() cuma ngasih string mentah, "published" gak pernah
    // dikonversi ke boolean asli sebelum divalidasi (beda sama POST yang udah
    // bener: `fields.published === "true"`). Kalau blogPostUpdateSchema
    // mendefinisikan published sebagai z.boolean(), string "true"/"false"
    // mentah bakal ditolak Zod — ini kemungkinan besar penyebab 400 pas edit.
    if (typeof body.published === "string") {
      body.published = body.published === "true"
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