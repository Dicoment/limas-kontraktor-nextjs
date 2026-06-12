import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response"

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const tag = await prisma.tag.findUnique({
      where: { slug },
      include: {
        blogPostTags: {
          include: {
            postEntry: {
              select: {
                id: true,
                title: true,
                slug: true,
                published: true,
                publishedAt: true
              }
            }
          }
        }
      }
    })
    
    if (!tag) return notFoundResponse("Tag")
    
    // Format response with blog posts
    const formattedTag = {
      ...tag,
      blogPosts: tag.blogPostTags
        .filter((bpt: { postEntry: { published: boolean | null } }) => bpt.postEntry.published)
        .map((bpt: { postEntry: any }) => bpt.postEntry)
    }
    
    return successResponse(formattedTag)
  } catch (error) {
    console.error("GET /api/tags/slug/[slug] error:", error)
    return errorResponse("Failed to fetch tag", 500)
  }
}