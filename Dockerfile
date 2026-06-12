# ==========================================
# Stage 1: Dependencies (deps)
# ==========================================
FROM node:22-alpine AS deps
WORKDIR /app

# Salin file konfigurasi npm
COPY package.json package-lock.json ./

# Salin folder prisma sebelum instalasi agar file schema tersedia
COPY prisma ./prisma/
COPY prisma.config.ts ./prisma.config.ts 

# MATIKAN fitur auto-generate bawaan Prisma saat npm ci
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# Instalasi dependencies tanpa memicu prisma generate secara prematur
RUN npm ci

# ==========================================
# Stage 2: Builder
# ==========================================
FROM node:22-alpine AS builder
WORKDIR /app

# Salin node_modules dari tahap deps
COPY --from=deps /app/node_modules ./node_modules

# Salin seluruh kode sumber proyek
COPY . .

# Eksekusi prisma generate secara manual menggunakan DUMMY URL 
# agar tidak butuh koneksi database asli saat proses build
RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy npx prisma generate

# Jalankan proses kompilasi Next.js
RUN npm run build

# ==========================================
# Stage 3: Runner (Production)
# ==========================================
FROM node:22-alpine AS runner
WORKDIR /app

# Set environment variables untuk mode production
ENV NODE_ENV=production
ENV PORT=8000

# Salin file-file yang dibutuhkan untuk menjalankan aplikasi
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

# Salin folder prisma dan config agar runtime bisa mengakses skema database
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Buka port 8000
EXPOSE 8000

# Perintah utama untuk menyalakan server Next.js
CMD ["npm", "start"]