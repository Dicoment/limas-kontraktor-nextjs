# 📋 Dokumentasi API - Limas Kontraktor
**Tanggal:** 19 Mei 2026  
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

Endpoint yang **memerlukan** autentikasi admin:
- Saat ini tidak ada endpoint API lain yang aktif selain autentikasi dan health check, karena sebagian besar file API dan layanan telah dihapus sebagai bagian dari pembersihan kode.

> **Catatan:** Pada implementasi saat ini, API tidak memiliki middleware autentikasi tersendiri, melainkan mengandalkan proteksi dari middleware Next.js yang hanya berlaku untuk route non-API. Untuk produksi, disarankan menambahkan middleware autentikasi ke API.

## 📋 Daftar Endpoint

### 🔐 Autentikasi
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/auth/[...nextauth]` | GET, POST, etc. | NextAuth endpoint (login, logout, callback, etc.) |

### ❤️ Kesehatan Server
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/health` | GET | Health check endpoint (mengembalikan `{ status: "OK", timestamp: ISO string }`) |

## ⚙️ Query Parameters Umum

Endpoint yang tersedia saat ini tidak menggunakan query parameters khusus.

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
│   └── [...nextauth]/
│       └── route.ts      # GET, POST, etc. (diupdate)
└── health/
    └── route.ts          # GET only
```

## 🔧 Implementasi Teknis

API dibangun menggunakan Next.js App Router dengan `route.ts` yang mengekspos fungsi async untuk setiap HTTP method:
```typescript
export async function GET(request: Request) { /* ... */ }
export async function POST(request: Request) { /* ... */ }
// dst.
```

Data diambil/dari database menggunakan Prisma Client yang diinisialisasi di `src/lib/prisma.ts`.

## 📝 Catatan Pengembangan

- API dirancang untuk sesuai dengan prinsip REST
- Saat ini hanya tersedia endpoint autentikasi dan health check
- Beberapa endpoint API lain sebelumnya telah dihapus sebagai bagian dari pembersihan kode dan akan diimplementasikan kembali sesuai kebutuhan

## 📓 Riwayat Perubahan

- **19 Mei 2026**: 
  - Dihapus file-file API dan layanan yang tidak digunakan lagi:
    - src/routes/api/categories.ts
    - src/routes/api/projects.ts
    - src/services/category.service.ts
    - src/services/project.service.ts
    - src/services/team.service.ts
    - src/middleware/auth.ts
    - src/middleware/validate.ts
  - Memperbarui endpoint autentikasi: src/app/api/auth/[...nextauth]/route.ts (+3 baris)
  - Memperbarui utility autentikasi: src/lib/auth.ts (+11 baris)
  - Memperbarui utility umum: src/lib/utils.ts (+5 baris)
- **17 Mei 2026**: Dokumentasi awal dibuat setelah migrasi dari Laravel/Filament ke Next.js + Prisma dengan lengkap endpoint API untuk proyek, blog, halaman, tim, kategori, tag, testimoni, leads log, dan pengaturan.

---
*Dokumentasi ini menggambarkan API yang telah dibangun sebagai bagian dari migrasi sistem Laravel/Filament ke Next.js Full-Stack.*