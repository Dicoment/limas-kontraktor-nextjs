# 📋 Dokumentasi Database - Limas Kontraktor
**Tanggal:** 17 Mei 2026 (Diperbarui)  
**Repo:** `D:\GRINDING\GUDANG\limas-kontraktor`

---

## 🗄️ Struktur Database (Prisma ORM)

Database menggunakan PostgreSQL dengan ORM Prisma v7.8.0. Semua model didefinisikan dalam file `prisma/schema.prisma`.

## 📊 Model Utama

| Model | Deskripsi | Kolom Penting |
|-------|-----------|---------------|
| **User** | Autentikasi admin dashboard | `id`, `email` (unique), `password` (bcrypt), `name`, `role`, `createdAt`, `updatedAt` |
| **Project** | Portofolio proyek konstruksi | `id`, `title`, `slug` (unique), `description`, `location`, `client`, `limasRole`, `coverImage`, `gallery` (JSON), `status` (enum), `seoTitle`, `seoDescription`, `createdAt`, `updatedAt` |
| **BlogPost** | Artikel blog | `id`, `title`, `slug` (unique), `content`, `excerpt`, `coverImage`, `seoTitle`, `seoDescription`, `published`, `publishedAt`, `createdAt`, `updatedAt` |
| **Page** | Halaman statis (Layanan, Tentang, dll) | `id`, `title`, `slug` (unique), `content`, `seoTitle`, `seoDescription`, `published`, `createdAt`, `updatedAt` |
| **Team** | Data karyawan/tim | `id`, `name`, `position`, `bio`, `avatar`, `email`, `phone`, `displayOrder`, `createdAt`, `updatedAt` |
| **Category** | Kategori umum untuk blog & project | `id`, `name`, `slug` (unique), `type` (blog/project), `description`, `createdAt`, `updatedAt` |
| **Tag** | Tag khusus untuk blog | `id`, `name`, `slug` (unique), `createdAt`, `updatedAt` |
| **Testimonial** | Testimoni klien | `id`, `clientName`, `content`, `rating`, `platform` (enum), `sourceUrl`, `avatar`, `published`, `projectId` (relasi), `createdAt`, `updatedAt` |
| **LeadsLog** | Log historis klik klien (read-only) | `id`, `name`, `phone`, `message`, `projectId`, `pageUrl`, `ipAddress`, `userAgent`, `createdAt` |
| **Setting** | Konfigurasi global (key-value) | `id`, `key` (unique), `value`, `createdAt`, `updatedAt` |

## 🔗 Relasi Many-to-Many (Tabel Pivot)

| Tabel Pivot | Relasi | Kolom Tambahan |
|-------------|--------|----------------|
| **ProjectTeam** | Project ↔ Team | `role` (String) - jabatan tim di proyek tersebut |
| **BlogPostCategory** | BlogPost ↔ Category | Tidak ada |
| **BlogPostTag** | BlogPost ↔ Tag | Tidak ada |
| **CategoryProject** | Category ↔ Project | Tidak ada |

## 🎨 Enums

| Enum | Nilai |
|------|-------|
| **ProjectStatus** | DRAFT, ONGOING, COMPLETED |
| **TestimonialPlatform** | MANUAL, SOCIAL_MEDIA |

## ⚙️ Konfigurasi Prisma

File `prisma/schema.prisma` mengandung:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 📦 Cara Menggunakan Prisma Client

Dalam aplikasi, Prisma client diinisialisasi sebagai singleton di `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
```

## 🔄 Migrasi Database

Perintah yang tersedia dalam `package.json`:

- `npm run db:generate` - Menghasilkan Prisma Client
- `npm run db:push` - Mendorong perubahan skema ke database
- `npm run db:studio` - Membuka Prisma Studio untuk melihat data

## 📝 Catatan Penting

1. Semua kolom timestamp menggunakan tipe `DateTime` dengan mapping ke nama kolom snake_case di database (`created_at`, `updated_at`)
2. Kolom JSON seperti `gallery` menggunakan tipe `Json?` dengan default nilai `"[]"`
3. Relasi menggunakan referensi `@id` dengan fungsi `cuid()` untuk ID unik
4. Enum di-deklarasikan terlebih dahulu sebelum digunakan dalam model
5. Relasi many-to-many eksplisit dibuat untuk Project-Team karena perlu kolom tambahan `role`
6. Database masih menggunakan struktur yang sama seperti Laravel (tidak ada perubahan skema)

---
*Dokumentasi ini menjelaskan struktur database yang digunakan dalam proyek Limas Kontraktor setelah migrasi dari Laravel/Filament ke Next.js + Prisma.*