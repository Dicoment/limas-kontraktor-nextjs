# 📋 Limas Kontraktor — Developer Handover Documentation

> Dokumen ini dibuat untuk developer baru yang akan melanjutkan pengerjaan project website Limas Kontraktor.
> Baca seluruh dokumen ini sebelum mulai coding.

---

## 🧭 Ringkasan Project

Website resmi **Limas Kontraktor** — perusahaan konstruksi. Dibangun dengan:

| Stack | Versi |
|-------|-------|
| Laravel | 11.x |
| Filament PHP | 5.x (versi terbaru) |
| Database | SQLite (development) → MySQL (production) |
| CSS Framework | Tailwind (bawaan Filament) + custom `app.css` |
| PHP | 8.3 |

**Pendekatan:** Dashboard-First — semua konten dikelola via admin panel Filament sebelum tampil ke frontend.

---

## ✅ Status Pekerjaan

### Sudah Selesai

| Bagian | Status | Catatan |
|--------|--------|---------|
| Database migrations (15 tabel) | ✅ Done | Semua sudah di-migrate |
| Model + relasi | ✅ Done | Semua model sudah ada dengan relasi |
| Enum ProjectStatus & TestimonialPlatform | ✅ Done | |
| Filament admin panel install | ✅ Done | Bisa diakses di `/admin` |
| Filament Resource auto-generate (semua modul) | ✅ Done | Masih default, belum dikustomisasi |
| ProjectResource form (kiri/kanan layout) | 🔄 In Progress | Form sudah ada, CSS layout masih bermasalah |
| Custom CSS admin panel | 🔄 In Progress | Sidebar & warna sudah, layout full-width belum fix |

### Belum Dikerjakan

| Bagian | Prioritas |
|--------|-----------|
| Fix CSS full-width layout di ProjectResource | 🔴 Tinggi |
| BlogPostResource — rich text editor, kategori, tag, SEO panel | 🔴 Tinggi |
| TeamResource — CRUD karyawan | 🟡 Sedang |
| CategoryResource — CRUD kategori blog & project | 🟡 Sedang |
| TagResource — CRUD tag blog | 🟡 Sedang |
| TestimonialResource — rating bintang | 🟡 Sedang |
| SettingsResource — key-value editor | 🟡 Sedang |
| LeadsLogResource — read-only, tidak bisa diedit | 🟡 Sedang |
| **Frontend (semua halaman publik)** | 🔴 Tinggi |

---

## 🗂️ Struktur Folder Penting

```
LIMAS-KONTRAKTOR/
├── app/
│   ├── Enums/
│   │   ├── ProjectStatus.php          # Enum: draft, ongoing, completed
│   │   └── TestimonialPlatform.php    # Enum: manual, social_media
│   ├── Filament/
│   │   └── Resources/
│   │       ├── BlogPosts/             # Resource Blog (auto-generate, belum dikustom)
│   │       ├── LeadsLogs/             # Resource Leads (auto-generate)
│   │       ├── Pages/                 # Resource Pages (auto-generate)
│   │       ├── Projects/
│   │       │   ├── Pages/             # ListProjects, CreateProject, EditProject
│   │       │   ├── Schemas/
│   │       │   │   └── ProjectForm.php  # ⭐ Form 2 kolom (kiri/kanan)
│   │       │   └── Tables/
│   │       │       └── ProjectsTable.php
│   │       │   └── ProjectResource.php
│   │       ├── Settings/              # Resource Settings (auto-generate)
│   │       ├── Teams/                 # Resource Teams (auto-generate)
│   │       └── Testimonials/          # Resource Testimonials (auto-generate)
│   ├── Models/
│   │   ├── BlogPost.php               # Relasi: categories, tags
│   │   ├── Category.php               # Scope: forBlog(), forProject()
│   │   ├── LeadsLog.php               # Helper: capture()
│   │   ├── Page.php
│   │   ├── Project.php                # Relasi: categories, teams
│   │   ├── ProjectStatus.php          # ⚠️ Ini duplikat, harusnya di Enums/
│   │   ├── Setting.php                # Helper: get(), set(), cache otomatis
│   │   ├── Tag.php
│   │   ├── Team.php
│   │   ├── Testimonial.php
│   │   └── User.php
│   └── Providers/
│       └── Filament/
│           └── AdminPanelProvider.php  # Konfigurasi panel Filament
├── database/
│   └── migrations/                    # 15 file migration
├── public/
│   └── css/
│       └── filament/admin/
│           ├── theme.css              # CSS Filament (jangan diedit)
│           └── app.css                # ⭐ Custom CSS admin panel (edit di sini)
└── resources/
    └── css/
        └── app.css                    # CSS frontend (belum dipakai)
```

---

## 🗄️ Struktur Database

### Tabel Utama

| Tabel | Fungsi |
|-------|--------|
| `projects` | Portofolio proyek |
| `blog_posts` | Artikel blog |
| `pages` | Halaman statis (Layanan, Tentang, dll) |
| `teams` | Karyawan/tim Limas |
| `categories` | Kategori (blog & project, dibedakan kolom `type`) |
| `tags` | Tag khusus blog |
| `testimonials` | Testimoni pelanggan |
| `leads_logs` | Log klik WhatsApp dari pengunjung |
| `settings` | Key-value config global |

### Tabel Pivot (Relasi Many-to-Many)

| Tabel | Relasi |
|-------|--------|
| `blog_post_category` | Blog ↔ Kategori |
| `blog_post_tag` | Blog ↔ Tag |
| `category_project` | Project ↔ Kategori |
| `project_team` | Project ↔ Team (+ kolom `role`) |

### Kolom Penting Project

```
projects: title, slug, description, location, client, limas_role,
          cover_image, gallery (JSON), status (enum),
          seo_title, seo_description
```

---

## ⚙️ Cara Setup Lokal

### Prasyarat
- PHP 8.3+
- Composer 2.x
- Node.js 20.x
- Laragon / XAMPP / Laravel Herd

### Langkah

```bash
# 1. Clone repo
git clone https://github.com/[repo-url]/limas-kontraktor.git
cd limas-kontraktor

# 2. Install dependencies
composer install
npm install

# 3. Setup environment
cp .env.example .env
php artisan key:generate

# 4. Buat file database SQLite
New-Item database/database.sqlite -ItemType File   # Windows (PowerShell)
touch database/database.sqlite                      # Mac/Linux

# 5. Jalankan migration
php artisan migrate

# 6. Buat admin user
php artisan make:filament-user

# 7. Buat symlink storage
php artisan storage:link

# 8. Jalankan server
php artisan serve
npm run dev   # terminal terpisah
```

Akses admin: `http://localhost:8000/admin`

---

## 🔑 Konfigurasi `.env` Penting

```dotenv
APP_NAME="Limas Kontraktor"
APP_URL=http://localhost:8000
APP_LOCALE=id

DB_CONNECTION=sqlite

SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=public
```

---

## 🎨 Panduan CSS Admin Panel

File CSS admin ada di **dua lokasi berbeda:**

| File | Untuk Apa |
|------|-----------|
| `public/css/filament/admin/app.css` | ⭐ Yang aktif dipakai Filament sekarang |
| `resources/css/app.css` | Frontend (belum dipakai) |

**Cara edit styling admin:** edit file `public/css/filament/admin/app.css`.

### Variabel Warna Brand

```css
--navy:   #1B3A6B   /* Warna sidebar & heading */
--orange: #E87722   /* Warna tombol primary & active menu */
```

### Masalah CSS Yang Belum Fix

Layout form 2 kolom (kiri 2/3, kanan 1/3) sudah ada di CSS tapi Filament v5 override dengan `grid-auto-columns` dari inline style. Perlu investigasi lebih lanjut dengan inspect element untuk menemukan selector yang tepat.

---

## 📦 Dependencies Penting

```json
{
  "filament/filament": "^5.x",
  "spatie/laravel-sluggable": "^3.x"
}
```

### Perintah Artisan Yang Sering Dipakai

```bash
# Reset cache (wajib setelah ubah config)
php artisan optimize:clear

# Buat Filament Resource baru
php artisan make:filament-resource NamaModel --generate

# Reset database (HAPUS SEMUA DATA)
php artisan migrate:fresh

# Tinker (debug database)
php artisan tinker
```

---

## 🔜 Pekerjaan Selanjutnya (Prioritas)

### 1. Fix CSS Full-Width (Segera)

Di `public/css/filament/admin/app.css`, cari selector yang override `grid-auto-columns` bawaan Filament v5. Masalah ada di `.fi-page-content` yang pakai `display: grid` dengan `grid-auto-columns: minmax(0, 1fr)`.

### 2. BlogPostResource

Buat file `app/Filament/Resources/BlogPosts/Schemas/BlogPostForm.php` dengan:
- Rich text editor (TipTap — install dulu: `composer require awcodes/filament-tiptap-editor`)
- Multi-select kategori (filter `type = 'blog'`)
- Multi-select tag
- SEO Panel: preview Google, keyword density, readability score

### 3. Frontend (Halaman Publik)

Halaman yang perlu dibuat:

| Route | Halaman |
|-------|---------|
| `/` | Homepage — hero, portofolio terbaru, testimoni, CTA WhatsApp |
| `/portofolio` | Listing proyek + filter kategori |
| `/portofolio/{slug}` | Detail proyek — gallery, tim, info |
| `/blog` | Listing artikel |
| `/blog/{slug}` | Detail artikel |
| `/{slug}` | Halaman statis dari modul Pages |

### 4. SEO Meta Tag

Pasang `spatie/laravel-seo` atau buat Blade component untuk meta tag dinamis per halaman.

---

## ⚠️ Hal Yang Perlu Diperhatikan

1. **`ProjectStatus.php` ada di dua tempat** — `app/Models/ProjectStatus.php` dan `app/Enums/ProjectStatus.php`. Yang benar ada di `Enums/`. File di `Models/` perlu dihapus agar tidak konflik.

2. **Storage upload** — pastikan `php artisan storage:link` sudah dijalankan sebelum test upload gambar.

3. **`Setting::get('key')`** — model Setting pakai cache otomatis. Setelah update setting via admin, cache otomatis clear. Tapi kalau ada masalah jalankan `php artisan cache:clear`.

4. **Tim Proyek** — relasi `project_team` punya kolom `role` (jabatan di proyek ini). Saat membuat form Tim di Filament, gunakan `withPivot('role')`.

5. **Kategori** — satu tabel `categories` untuk blog dan project, dibedakan kolom `type`. Selalu filter dengan `->where('type', 'blog')` atau `->where('type', 'project')` saat query.

---

## 📞 Kontak

hello@dicoment.com
---

*Last updated: Mei 2026*