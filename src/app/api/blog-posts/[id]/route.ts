import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, notFoundResponse } from "@/lib/api-response"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: { blogPostCategories: { include: { catEntry: true } }, blogPostTags: { include: { tagEntry: true } } },
  })
  if (!post) return notFoundResponse("BlogPost")
  return successResponse(post)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const { categoryIds, tagIds, ...data } = body

    await prisma.blogPostCategory.deleteMany({ where: { postId: id } })
    await prisma.blogPostTag.deleteMany({ where: { postId: id } })
    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        blogPostCategories: { create: categoryIds?.map((cid: string) => ({ category: { connect: { id: cid } } })) || [] },
        blogPostTags: { create: tagIds?.map((tid: string) => ({ tag: { connect: { id: tid } } })) || [] },
      },
      include: { blogPostCategories: { include: { catEntry: true } }, blogPostTags: { include: { tagEntry: true } } },
    })
    return successResponse(updated)
  } catch {
    return notFoundResponse("BlogPost")
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.blogPost.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}