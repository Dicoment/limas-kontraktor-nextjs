# 📋 Dokumentasi API - Limas Kontraktor
**Tanggal:** 17 Mei 2026  
**Repo:** `D:\GRINDING\GUDANG\limas-kontraktor`

---

## 🌐 Overview

API RESTful yang dibangun menggunakan Next.js App Router di `src/app/api/`. API ini digunakan untuk komunikasi antara frontend Next.js dan backend, serta dapat diakses oleh aplikasi eksternal.

Semua endpoint menggunakan format JSON untuk request dan response.

## 🔐 Autentikasi

Endpoint `/api/auth/[...nextauth]` dikelola oleh NextAuth.js v5 dengan Credentials Provider. Untuk mengakses endpoint yang dilindungi, sertakan cookie `next-auth.session-token` atau header `Authorization: Bearer <jwt>` (tergantung konfigurasi NextAuth).

Endpoint yang **tidak** memerlukan autentikasi:
- `/api/auth/*`
- `/api/health`
- Semua endpoint publik (jika ada)

Endpoint yang **memerlukan** autentikasi admin:
- Semua endpoint di bawah `/api/*` kecuali yang disebutkan di atas (sesuai middleware di `backend/src/middleware.ts` yang melindungi route `/admin/*` namun API tidak terpengaruh langsung oleh middleware ini karena API berada di `/api/*`). Namun, untuk keamanan, disarankan semua endpoint API dilindungi kecuali yang secara eksplisit publik.

> **Catatan:** Pada implementasi saat ini, API tidak memiliki middleware autentikasi tersendiri, melainkan mengandalkan proteksi dari middleware Next.js yang hanya berlaku untuk route non-API. Untuk produksi, disarankan menambahkan middleware autentikasi ke API.

## 📋 Daftar Endpoint

### 🔐 Autentikasi
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/auth/[...nextauth]` | GET, POST, etc. | NextAuth endpoint (login, logout, callback, etc.) |

### 📁 Proyek
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/projects` | GET | Mendapatkan daftar proyek (support pagination, filtering, search via query params) |
| `/api/projects` | POST | Membuat proyek baru |
| `/api/projects/[id]` | GET | Mendapatkan detail proyek berdasarkan ID |
| `/api/projects/[id]` | PUT | Memperbarui proyek berdasarkan ID |
| `/api/projects/[id]` | DELETE | Menghapus proyek berdasarkan ID |

### 📝 Blog Post
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/blog-posts` | GET | Mendapatkan daftar blog post |
| `/api/blog-posts` | POST | Membuat blog post baru |
| `/api/blog-posts/[id]` | GET | Mendapatkan detail blog post |
| `/api/blog-posts/[id]` | PUT | Memperbarui blog post |
| `/api/blog-posts/[id]` | DELETE | Menghapus blog post |

### 📄 Halaman Statis
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/pages` | GET | Mendapatkan daftar halaman |
| `/api/pages` | POST | Membuat halaman baru |
| `/api/pages/[id]` | GET | Mendapatkan detail halaman |
| `/api/pages/[id]` | PUT | Memperbarui halaman |
| `/api/pages/[id]` | DELETE | Menghapus halaman |

### 👥 Tim
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/teams` | GET | Mendapatkan daftar tim |
| `/api/teams` | POST | Membuat tim baru |
| `/api/teams/[id]` | GET | Mendapatkan detail tim |
| `/api/teams/[id]` | PUT | Memperbarui tim |
| `/api/teams/[id]` | DELETE | Menghapus tim |

### 🏷️ Kategori
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/categories` | GET | Mendapatkan daftar kategori (support filtering by `type`) |
| `/api/categories` | POST | Membuat kategori baru |
| `/api/categories/[id]` | GET | Mendapatkan detail kategori |
| `/api/categories/[id]` | PUT | Memperbarui kategori |
| `/api/categories/[id]` | DELETE | Menghapus kategori |

### 🔖 Tag
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/tags` | GET | Mendapatkan daftar tag |
| `/api/tags` | POST | Membuat tag baru |
| `/api/tags/[id]` | GET | Mendapatkan detail tag |
| `/api/tags/[id]` | PUT | Memperbarui tag |
| `/api/tags/[id]` | DELETE | Menghapus tag |

### 💬 Testimoni
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/testimonials` | GET | Mendapatkan daftar testimoni |
| `/api/testimonials` | POST | Membuat testimoni baru |
| `/api/testimonials/[id]` | GET | Mendapatkan detail testimoni |
| `/api/testimonials/[id]` | PUT | Memperbarui testimoni |
| `/api/testimonials/[id]` | DELETE | Menghapus testimoni |

### 📈 Leads Log
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/leads-logs` | GET | Mendapatkan daftar leads log (support filtering by `projectId`) |
| `/api/leads-logs` | POST | Membuat leads log baru (jarang digunakan karena biasanya dibuat dari frontend) |
| `/api/leads-logs/[id]` | GET | Mendapatkan detail leads log |
| `/api/leads-logs/[id]` | PUT | Memperbarui leads log |
| `/api/leads-logs/[id]` | DELETE | Menghapus leads log |

### ⚙️ Pengaturan
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/settings` | GET | Mendapatkan daftar pengaturan |
| `/api/settings` | POST | Membuat pengaturan baru |
| `/api/settings/[id]` | GET | Mendapatkan detail pengaturan |
| `/api/settings/[id]` | PUT | Memperbarui pengaturan |
| `/api/settings/[id]` | DELETE | Menghapus pengaturan |

### ❤️ Kesehatan Server
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/health` | GET | Health check endpoint (mengembalikan `{ status: "OK", timestamp: ISO string }`) |

## 📥 Contoh Request & Response

### Mendapatkan Daftar Proyek
**Request:**
```http
GET /api/projects?page=1&limit=10&search=rumah&type=project
```

**Response:**
```json
{
  "data": [
    {
      "id": "cj9...",
      "title": "Rijang Modern",
      "slug": "rijang-modern",
      "description": "Proyek rijang 2 lantai",
      "location": "Jakarta",
      "client": "PT. Sejahtera",
      "limasRole": "Konsultan",
      "coverImage": "/images/rijang.jpg",
      "gallery": ["image1.jpg", "image2.jpg"],
      "status": "COMPLETED",
      "seoTitle": "Rijang Modern - Limas Kontraktor",
      "seoDescription": "Rijang modern 2 lantai di Jakarta",
      "createdAt": "2026-05-01T10:00:00Z",
      "updatedAt": "2026-05-01T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

### Membuat Proyek Baru
**Request:**
```http
POST /api/projects
Content-Type: application/json

{
  "title": "Gedung Kantor",
  "slug": "gedung-kantor",
  "description": "Gedung kantor 8 lantai",
  "location": "Bandung",
  "client": "CV. Maju",
  "limasRole": "Kontraktor Utama",
  "coverImage": "/images/gedung.jpg",
  "gallery": ["image1.jpg", "image2.jpg"],
  "status": "ONGOING",
  "seoTitle": "Gedung Kantor - Limas Kontraktor",
  "seoDescription": "Gedung kantor 8 lantai di Bandung"
}
```

**Response:**
```json
{
  "id": "ck0...",
  "title": "Gedung Kantor",
  "slug": "gedung-kantor",
  "description": "Gedung kantor 8 lantai",
  "location": "Bandung",
  "client": "CV. Maju",
  "limasRole": "Kontraktor Utama",
  "coverImage": "/images/gedung.jpg",
  "gallery": ["image1.jpg", "image2.jpg"],
  "status": "ONGOING",
  "seoTitle": "Gedung Kantor - Limas Kontraktor",
  "seoDescription": "Gedung kantor 8 lantai di Bandung",
  "createdAt": "2026-05-17T14:30:00Z",
  "updatedAt": "2026-05-17T14:30:00Z"
}
```

## ⚙️ Query Parameters Umum

Beberapa endpoint mendukung query parameters untuk pagination, filtering, dan searching:

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `page` | integer | Nomor halaman (default: 1) |
| `limit` | integer | Jumlah item per halaman (default: 10) |
| `search` | string | Term pencarian (biasanya pada field `name` atau `title`) |
| `type` | string | Untuk kategori, nilai bisa `blog` atau `project` |
| `projectId` | string | Untuk leads-log, filter berdasarkan project ID |

## 🚦 Status Code Respons

| Kode | Deskripsi |
|------|-----------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (validasi gagal, data tidak lengkap, etc.) |
| 401 | Unauthorized (belum login) |
| 403 | Forbidden (tidak memiliki izin) |
| 404 | Not Found |
| 500 | Internal Server Error |

## 📁 Struktur File API

Backend API berada di `src/app/api/` dengan struktur berikut:
```
api/
├── auth/                 # NextAuth endpoint (dibiarkan default)
├── projects/
│   ├── route.ts          # GET, POST
│   └── [id]/
│       └── route.ts      # GET, PUT, DELETE
├── blog-posts/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── pages/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── teams/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── categories/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── tags/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── testimonials/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── leads-logs/
│   ├── route.ts          # GET, POST
│   └── [id]/
│       └── route.ts      # GET, PUT, DELETE
├── settings/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
└── health/
    └── route.ts          # GET only
```

Setiap `route.ts` berisi handler HTTP method yang memanggil service layer di `src/services/`.

## 🔧 Implementasi Teknis

API dibangun menggunakan Next.js App Router dengan `route.ts` yang mengekspos fungsi async untuk setiap HTTP method:
```typescript
export async function GET(request: Request) { /* ... */ }
export async function POST(request: Request) { /* ... */ }
// dst.
```

Data diambil/dari database menggunakan Prisma Client yang diinisialisasi di `src/lib/prisma.ts`.

Logika bisnis dienkapsulasi dalam service layer di `src/services/` untuk memisahkan concerns antara API routes dan business logic.

Validasi input dilakukan menggunakan Zod schemas dari `src/backend-schemas/` sebelum memproses request.

## 📦 Service Layer

Service layer terdiri dari file-file berikut:
- `src/services/lead.service.ts` - Operasi leads-log (getLeadsLogs, deleteLeadsLog)
- `src/services/category.service.ts` - Operasi category
- `src/services/project.service.ts` - Operasi project
- `src/services/team.service.ts` - Operasi team

Setiap service mengekspor fungsi-fungsi async yang dapat dipanggil dari API routes.

## 🛡️ Keamanan

Catatan keamanan terkait API:
1. Semua data yang diterima divalidasi dengan Zod sebelum diproses
2. Password tidak pernah dikembalikan dalam response API
3. Data sensitif seperti token disimpan dalam cookie yang aman oleh NextAuth
4. Untuk produksi, disarankan:
   - Menambahkan rate limiting
   - Menggunakan HTTPS
   - Menambahkan security headers (helmet-like)
   - Melakukan audit dependencies secara berkala

## 📝 Catatan Pengembangan

- API dirancang untuk sesuai dengan prinsip REST
- Setiap resource memiliki endpoint koleksi (`/resource`) dan endpoint item (`/resource/[id]`)
- Filtering, pagination, dan searching diimplementasikan melalui query parameters
- Respons konsisten dengan struktur `{ data, total, page, totalPages }` untuk endpoint koleksi
- Error respons mengikuti format `{ error: "pesan error" }` atau `{ message: "pesan" }` tergantung pada sumber error

---
*Dokumentasi ini menggambarkan API yang telah dibangun sebagai bagian dari migrasi sistem Laravel/Filament ke Next.js Full-Stack.*