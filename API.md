# 📋 Dokumentasi API - Limas Kontraktor
**Tanggal:** 6 Juni 2026  
**Repo:** `D:\GRINDING\GUDANG\limas-kontraktor`

---

## 🌐 Overview

API RESTful yang dibangun menggunakan Next.js App Router di `src/app/api/`. API ini digunakan untuk komunikasi antara frontend Next.js dan backend, serta dapat diakses oleh aplikasi eksternal.

Semua endpoint menggunakan format JSON untuk request dan response.

Response format standar:
```json
{
  "success": true,
  "data": { ... }
}
```

Response error format:
```json
{
  "success": false,
  "error": "Pesan error"
}
```

---

## 🔐 Autentikasi

Endpoint `/api/auth/[...nextauth]` dikelola oleh NextAuth.js v5 dengan Credentials Provider. Untuk mengakses endpoint yang dilindungi, sertakan cookie `next-auth.session-token` atau header `Authorization: Bearer <jwt>` (tergantung konfigurasi NextAuth).

Endpoint yang **tidak** memerlukan autentikasi:
- `/api/auth/*`

> **Catatan:** Pada implementasi saat ini, API tidak memiliki middleware autentikasi tersendiri. Untuk produksi, disarankan menambahkan middleware autentikasi ke API.

---

## 📋 Daftar Endpoint

### 🔐 Autentikasi
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth endpoint (login, logout, callback, etc.) |

### 👥 Tim (Teams)
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/teams` | GET | Ambil daftar tim (paginated, support search, hasProject filter) |
| `/api/teams` | POST | Buat tim baru |
| `/api/teams/[id]` | GET | Ambil detail tim (include project relations) |
| `/api/teams/[id]` | PUT | Update tim |
| `/api/teams/[id]` | PATCH | Update tim (partial) |
| `/api/teams/[id]` | DELETE | Hapus tim |
| `/api/teams/reorder` | PATCH | Reorder tim (update displayOrder) |

**Query Parameters (GET /api/teams):**
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `search` (opsional, cari di name/position/bio/email)
- `hasProject` (opsional, true/false - filter by project assignment)
- `sortBy` (default: displayOrder, options: name, position, createdAt, updatedAt)
- `sortOrder` (default: asc)

---

### 🏷️ Tags
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/tags` | GET | Ambil daftar tags (paginated, support search) |
| `/api/tags` | POST | Buat tag baru |
| `/api/tags/[id]` | GET | Ambil detail tag (include usage count) |
| `/api/tags/[id]` | PUT | Update tag |
| `/api/tags/[id]` | PATCH | Update tag (partial) |
| `/api/tags/[id]` | DELETE | Hapus tag |
| `/api/tags/slug/[slug]` | GET | Ambil tag by slug dengan blog posts |

**Query Parameters (GET /api/tags):**
- `page` (default: 1)
- `limit` (default: 50, max: 100)
- `search` (opsional, cari di name/slug)
- `sortBy` (default: name, options: name, slug, createdAt, updatedAt)
- `sortOrder` (default: asc)

---

### 📂 Kategori (Categories)
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/categories` | GET | Ambil daftar kategori (paginated) |
| `/api/categories` | POST | Buat kategori baru |
| `/api/categories/[id]` | GET | Ambil detail kategori (include relations) |
| `/api/categories/[id]` | PUT | Update kategori |
| `/api/categories/[id]` | DELETE | Hapus kategori |

**Query Parameters (GET /api/categories):**
- `page` (default: 1)
- `limit` (default: 50, max: 100)

---

### 📦 Proyek (Projects)
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/projects` | GET | Ambil daftar proyek (paginated, support search & filter status) |
| `/api/projects` | POST | Buat proyek baru |
| `/api/projects/[id]` | GET | Ambil detail proyek by ID (include relations) |
| `/api/projects/[id]` | PUT | Update proyek |
| `/api/projects/[id]` | PATCH | Update proyek (partial) |
| `/api/projects/[id]` | DELETE | Hapus proyek |
| `/api/projects/slug/[slug]` | GET | Ambil detail proyek by slug (public access) |

**Query Parameters (GET /api/projects):**
- `page` (default: 1)
- `limit` (default: 10, max: 100)
- `search` (opsional, cari di title/description/location)
- `status` (opsional, filter by status: DRAFT, ONGOING, COMPLETED)
- `categoryId` (opsional, filter by category)
- `teamId` (opsional, filter by team)
- `sortBy` (default: createdAt, options: createdAt, name, etc.)
- `sortOrder` (default: desc)

---

### 📄 Halaman (Pages)
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/pages` | GET | Ambil daftar halaman (paginated, support filter published) |
| `/api/pages` | POST | Buat halaman baru |
| `/api/pages/[id]` | GET | Ambil detail halaman |
| `/api/pages/[id]` | PUT | Update halaman |
| `/api/pages/[id]` | DELETE | Hapus halaman |
| `/api/pages/slug/[slug]` | GET | Ambil halaman by slug (public access, hanya published) |

**Query Parameters (GET /api/pages):**
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `published` (opsional, true/false)

---

### 📝 Blog Posts
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/blog-posts` | GET | Ambil daftar blog posts (paginated, support filter) |
| `/api/blog-posts` | POST | Buat blog post baru |
| `/api/blog-posts/[id]` | GET | Ambil detail blog post by ID |
| `/api/blog-posts/[slug]` | GET | Ambil detail blog post by slug |
| `/api/blog-posts/[slug]` | PUT | Update blog post (full update) |
| `/api/blog-posts/[slug]` | PATCH | Update blog post (partial update) |
| `/api/blog-posts/[slug]` | DELETE | Hapus blog post |

**Query Parameters (GET /api/blog-posts):**
- `page` (default: 1)
- `limit` (default: 20)
- `search` (opsional)
- `published` (opsional, true/false)
- `categoryId` (opsional, filter by category)
- `tagId` (opsional, filter by tag)

---

### ⭐ Testimonials
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/testimonials` | GET | Ambil daftar testimonials (paginated, support filter published) |
| `/api/testimonials` | POST | Buat testimonial baru |
| `/api/testimonials/[id]` | GET | Ambil detail testimonial |
| `/api/testimonials/[id]` | PUT | Update testimonial |
| `/api/testimonials/[id]` | PATCH | Update testimonial (partial) |
| `/api/testimonials/[id]` | DELETE | Hapus testimonial |
| `/api/testimonials/project/[projectId]` | GET | Ambil testimonials by project ID |

**Query Parameters (GET /api/testimonials):**
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `published` (opsional, true/false)
- `platform` (opsional, filter by platform: MANUAL, SOCIAL_MEDIA)
- `projectId` (opsional, filter by project)
- `minRating` (opsional, filter rating minimum)
- `maxRating` (opsional, filter rating maksimum)
- `search` (opsional, cari di clientName/content)

---

### 📋 Leads Logs
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/leads-logs` | GET | Ambil daftar leads logs (paginated) |
| `/api/leads-logs` | POST | Buat leads log baru |
| `/api/leads-logs/[id]` | GET | Ambil detail leads log |
| `/api/leads-logs/[id]` | PUT | Update leads log |
| `/api/leads-logs/[id]` | PATCH | Update leads log (partial) |
| `/api/leads-logs/[id]` | DELETE | Hapus leads log |

**Query Parameters (GET /api/leads-logs):**
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `search` (opsional, cari di name/phone/message)
- `projectId` (opsional, filter by project)
- `startDate` (opsional, filter tanggal mulai)
- `endDate` (opsional, filter tanggal akhir)
- `hasPhone` (opsional, true/false)
- `hasMessage` (opsional, true/false)
- `sortOrder` (default: desc)

---

### ⚙️ Settings
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/settings` | GET | Ambil daftar settings (format object) |
| `/api/settings` | PUT | Bulk update settings |
| `/api/settings/[key]` | GET | Ambil setting by key |
| `/api/settings/[key]` | PUT | Upsert setting |
| `/api/settings/[key]` | DELETE | Hapus setting |

---

## 🚦 Status Code Respons

| Kode | Deskripsi |
|------|-----------|
| 200 | OK |
| 201 | Created |
| 204 | No Content (DELETE success) |
| 400 | Bad Request (validasi gagal, data tidak lengkap, etc.) |
| 401 | Unauthorized (belum login) |
| 403 | Forbidden (tidak memiliki izin) |
| 404 | Not Found |
| 409 | Conflict (duplicate slug/key) |
| 500 | Internal Server Error |

---

## 📁 Struktur File API

```
src/app/api/
├── auth/
│   └── [...nextauth]/
│       └── route.ts
├── blog-posts/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── categories/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── leads-logs/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── pages/
│   ├── route.ts
│   ├── [id]/
│   │   └── route.ts
│   └── slug/
│       └── [slug]/
│           └── route.ts
├── projects/
│   ├── route.ts
│   ├── [id]/
│   │   └── route.ts
│   └── slug/
│       └── [slug]/
│           └── route.ts
├── settings/
│   ├── route.ts
│   └── [key]/
│       └── route.ts
├── tags/
│   ├── route.ts
│   ├── [id]/
│   │   └── route.ts
│   └── slug/
│       └── [slug]/
│           └── route.ts
├── teams/
│   ├── route.ts
│   ├── [id]/
│   │   └── route.ts
│   └── reorder/
│       └── route.ts
└── testimonials/
    ├── route.ts
    ├── [id]/
    │   └── route.ts
    └── project/
        └── [projectId]/
            └── route.ts
```

---

## 🔧 Implementasi Teknis

API dibangun menggunakan Next.js App Router dengan `route.ts` yang mengekspos fungsi async untuk setiap HTTP method:
```typescript
export async function GET(request: NextRequest) { /* ... */ }
export async function POST(request: NextRequest) { /* ... */ }
// dst.
```

Data diambil/dari database menggunakan Prisma Client yang diinisialisasi di `src/lib/prisma.ts`.

Response helper tersedia di `src/lib/api-response.ts`:
- `successResponse(data, status)` — response sukses
- `errorResponse(message, status, errors)` — response error
- `notFoundResponse(entity)` — response 404
- `unauthorizedResponse()` — response 401

---

## 📓 Riwayat Perubahan

- **6 Juni 2026**: Dokumentasi API diperbarui dengan semua endpoint yang terinisialisasi (blog-posts, categories, leads-logs, pages, projects, settings, tags, teams, testimonials)
- **19 Mei 2026**: Dokumentasi dibuat untuk autentikasi dan health check
- **17 Mei 2026**: Dokumentasi awal dibuat setelah migrasi dari Laravel/Filament ke Next.js + Prisma dengan lengkap endpoint API untuk proyek, blog, halaman, tim, kategori, tag, testimoni, leads log, dan pengaturan.

---

*Dokumentasi ini menggambarkan API yang telah dibangun sebagai bagian dari migrasi sistem Laravel/Filament ke Next.js Full-Stack.*