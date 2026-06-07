import { NextResponse } from "next/server"
import type { ApiResponse, PaginatedResponse } from "@/lib/types"

export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status })
}

// api-response.ts
export function errorResponse(message: string, status = 400, errors?: Record<string, unknown> | unknown[]): NextResponse<ApiResponse & { errors?: Record<string, unknown> | unknown[] }> {
  return NextResponse.json(
    { success: false, error: message, ...(errors && { errors }) },
    { status }
  )
}

export function notFoundResponse(entity = "Resource"): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error: `${entity} not found` },
    { status: 404 }
  )
}

export function unauthorizedResponse(): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error: "Unauthorized" },
    { status: 401 }
  )
}

export function paginatedResponse<T>(data: T[], total: number, page: number, limit: number): PaginatedResponse<T> {
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  }
}