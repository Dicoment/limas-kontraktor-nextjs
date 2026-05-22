# 📋 Dokumentasi Database - Limas Kontraktor
**Tanggal:** 22 Mei 2026 (Diperbarui)  
**Repo:** `D:\GRINDING\GUDANG\limas-kontraktor`

---

## 🗄️ Skema Database (Prisma ORM — PostgreSQL)

Database menggunakan **PostgreSQL** dengan **Prisma v7.8.0** (`@prisma/client`).
Semua model didefinisikan di `prisma/schema.prisma`. Generated Prisma Client berada di `src/generated/`.

### Gambaran Relasi Database

```
┌─────────────────────────────────────────────────────────────────────────┐
│                               DATABASE                                   │
├──────────────┐       ┌──────────────────────────────────────────────── ─┤
│   users      │       │  projects                                      │
│  ─────────   │       │  ────────                                      │
│  id (PK)  ├──┼───────┤  id (PK)                                      │
│  email    │  │       │  title                                        │
│  password │  │       │  slug (unique)                                 │
│  name     │  │       │  description                                  │
│  role     │  │       │  location                                     │
│  createdAt│  │       │  client                                       │
│  updatedAt│  └───┐   │  limas_role  ←→  roles.role                    │
│            1    │   │  cover_image                                    │
│           admin  │   │  gallery (JSON[])                               │
│                 │   │  status  → ProjectStatus enum                   │
│                 │   │  seo_title                                      │
│                 │   │  seo_description                                │
│                 │   │  createdAt                                      │
│                 │   │  updatedAt                                      │
│                 │   │                                                 │
│                 │   │  projectTeams (PK: projectId+teamId, unique)    │
│                 │   │  ├── projectId  → projects.id                   │
│                 │   │  └── teamId     → teams.id                       │
│                 │   │         role (String)                                │
│                 │   │                                                     │
│                 │   │  testimonials                                     │
│                 │   │  ─────────────                                     │
│                 │   │  id (PK)  ←→  testimonials.projectId             │
│                 │   │  reviewText                                       │
│                 │   │  rating  → TestimonialPlatform enum              │
│                 │   │  featured (boolean)                               │
│                 │   │  createdAt                                        │
│                 │   └────────────────────────────────────────────────── │
│                 │                                                        │
│                 │         ┌──────────────┐       ┌─────────────────┐   │
│                 │         │   teams      │       │  testimonial_    │   │
│                 │         │  ────────    │       │  platforms       │   │
│                 │         │  id (PK)  ◄──┘       │  ─────────────── │   │
│                 │         │  name      └───────►│  id (PK)         │   │
│                 │         │  position           │  name            │   │
│                 │         │  bio                │  createdAt       │   │
│                 │         │  createdAt          └─────────────────┘   │
│                 │         │  updatedAt                                   │
│                 │         └──────────────────────────────────────────────┘
│                 │
│  ┌──────────────┼─────────────────────────────────────────────────────┐
│  │  blog_posts  │                                                        │
│  │  ─────────   │                                                        │
│  │  id (PK)    │       ┌──────────────┐  ┌──────────────┐              │
│  │  title      │       │  tags        │  │  categories  │               │
│  │  slug       │       │  ───────     │  │  ──────────  │               │
│  │  content    │       │  id (PK)    │  │  id (PK)     │               │
│  │  excerpt    │       │  name       │  │  name        │               │
│  │  coverImg   │       │  slug        │  │  slug        │               │
│  │  seo_title  │       │  createdAt   │  │  type        │               │
│  │  seo_desc   │       └──────────────┘  └──────────────┘               │
│  │  published  │                                                           
│  │  publishedAt│                                                           
│  │  createdAt  │                                                           
│  │  updatedAt  │                                                           
│  │             │                                                           
│  │  blogPostTags  (id / blogPostId / tagId / createdAt)                   │
│  │  blogPostCategories (id / blogPostId / categoryId / createdAt)         │
│  └──────────────┘                                                           
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────┐    │
│  │  pages                                                              │    │
│  │  ─────                                                              │    │
│  │  id (PK)   title  slug  content  seo_title  seo_description        │    │
│  │  published publishedAt  createdAt  updatedAt                        │    │
│  └───────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────┐    │
│  │  settings                                                           │    │
│  │  ────────                                                           │    │
│  │  id (PK)   key (unique)   value   createdAt   updatedAt             │    │
│  └───────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────┐    │
│  │  leads_logs                                                         │    │
│  │  ──────────                                                         │    │
│  │  id (PK)   name  phone  message  projectId  pageUrl  ipAddress     │    │
│  │  userAgent  createdAt                                                │    │
│  └───────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

*Diagram menunjukkan relasi antara 10 model utama dan 4 tabel pivot dalam database PostgreSQL.*

---

## 📊 Model Utama

| Model | Tabel | Deskripsi |
|-------|-------|-----------|
| **User** | `users` | Akun pengguna sistem (admin dashboard) |
| **Project** | `projects` | Portofolio proyek konstruksi |
| **BlogPost** | `blog_posts` | Artikel/blog website |
| **Page** | `pages` | Halaman statis dinamis (`/tentang-kami`, `/karir`, dll.) |
| **Team** | `teams` | Data anggota tim/karyawan |
| **Category** | `categories` | Kategori Projek & Blog |
| **Tag** | `tags` | Tag artikel blog |
| **Testimonial** | `testimonials` | Testimonial/review dari klien |
| **LeadsLog** | `leads_logs` | Log calon pelanggan (read-only) |
| **Setting** | `settings` | Konfigurasi key-value global |

---

## 🔗 Relasi Many-to-Many (Tabel Pivot)

| Tabel Pivot | Relasi Between | Kolom Tambahan |
|-------------|---------------|----------------|
| **project_teams** | Project ↔ Team | `role` — jabatan anggota tim di proyek tersebut |
| **blog_post_categories** | BlogPost ↔ Category | *(tidak ada)* |
| **blog_post_tags** | BlogPost ↔ Tag | *(tidak ada)* |
| **category_projects** | Category ↔ Project | *(tidak ada)* |

---

## 🎨 Enums

```typescript
enum ProjectStatus {
  DRAFT     // Proyek belum dirilis
  ONGOING   // Proyek sedang berjalan
  COMPLETED // Proyek selesai
}

enum TestimonialPlatform {
  MANUAL       // Diinput manual oleh admin
  SOCIAL_MEDIA // Import dari media sosial
}
```

---

## ⚙️ Konfigurasi Prisma

File `prisma/schema.prisma`:

```prisma
generator client {
  provider   = "prisma-client"
  output     = "../src/generated"
}

datasource db {
  provider = "postgresql"
}

enum ProjectStatus { DRAFT, ONGOING, COMPLETED }
enum TestimonialPlatform { MANUAL, SOCIAL_MEDIA }
```

Catatan:
- `generator.output = "../src/generated"` — Prisma Client di-generate ke dalam direktori `src/`, bukan `node_modules/`.
- Tidak ada bidang `url` di blok `datasource`; koneksi disediakan melalui adapter (`@prisma/adapter-pg`).

---

## 📦 Inisialisasi Prisma Client (Prisma 7)

Di Prisma 7, `PrismaClient` memerlukan opsi konstruktor yang **tidak kosong** — yaitu `{ adapter }` atau `{ accelerateUrl }`.
Adapter PostgreSQL digunakan secara eksplisit:

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '../generated/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('ERROR: DATABASE_URL environment variable is not set.')
  process.exit(1)
}

const adapter = new PrismaPg(connectionString)
const prisma = new PrismaClient({ adapter })

export default prisma
```

---

## 🔄 Migrasi & Perintah Database

Perintah yang tersedia di `package.json`:

| Perintah | Deskripsi |
|----------|-----------|
| `npm run db:generate` | Menghasilkan Prisma Client ke `src/generated/` |
| `npm run db:push` | Mendorong perubahan schema ke database |
| `npm run db:seed` | Menjalankan seeder (`prisma/seed.ts`) |
| `npm run db:studio` | Membuka Prisma Studio (GUI database) |

---

## 🌱 Seed Data (`prisma/seed.ts`)

Seeder mengisi database dengan data awal:
- **Users**: 2 akun (`admin@limas.co.id`, `manager@limas.co.id`)
- **Teams**: 3 anggota tim
- **Categories**: 3 kategori proyek + 2 kategori blog
- **Tags**: 3 tag artikel
- **Projects**: 3 proyek (status berbeda: DRAFT, ONGOING, COMPLETED)
- **BlogPosts**: 2 artikel (1 published, 1 draft)
- **Pages**: 2 halaman (1 published, 1 draft)
- **Testimonials**: 3 testimoni
- **LeadsLogs**: 2 log calon pelanggan
- **Settings**: 5 pengaturan global

Seeder melakukan **deleteMany** di semua tabel terlebih dahulu (dalam transaksi) sebelum insert data baru,
dengan urutan menghormati foreign key constraints:
`leadsLogs → blogPostTag / blogPostCategory / categoryProject / projectTeam → testimonials / blogPosts / pages → projects → teams → categories → tags → settings → users`.

---

## 📝 Catatan Penting

1. **Prisma 7 breaking change** — `PrismaClient()` tanpa opsi sekarang melempar `PrismaClientInitializationError`. Selalu satu adapter (`PrismaPg`) atau `accelerateUrl`.
2. Semua kolom timestamp menggunakan `DateTime` dengan mapping snake_case (`created_at`, `updated_at`) di database.
3. Kolom JSON seperti `gallery` menggunakan tipe `Json?` dengan default `[]`.
4. Semua ID menggunakan `cuid()` untuk keunikan.
5. Enum dideklarasikan terlebih dahulu sebelum digunakan di model.
6. Relasi many-to-many eksplisit untuk `Project ↔ Team` karena tabel pivot `project_teams` memerlukan kolom tambahan `role`.

---

## 📓 Riwayat Perubahan

- **22 Mei 2026** — Memperbaiki `prisma/seed.ts` untuk kompatibilitas Prisma 7 (import path, adapter, seeding method). Memperbarui dokumentasi database dan menambahkan dokumentasi hari ini.
- **19 Mei 2026** — Pembersihan file yang tidak digunakan, struktur autentikasi diperbarui.
- **17 Mei 2026** — Migrasi dari Laravel/Filament ke Next.js + Prisma selesai. Prisma schema lengkap, Zod schemas, REST API, Admin Dashboard, dan halaman publik siap digunakan.

---

*Dokumentasi ini mendeskripsikan struktur database PostgreSQL yang mendukung seluruh fitur Limas Kontraktor dan dokumentasi aktivitas pengembangan terbaru.*
