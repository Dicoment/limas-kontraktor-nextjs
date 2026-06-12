# ==========================================
# Stage 1: Install semua dependencies (deps)
# ==========================================
FROM node:22-alpine AS deps
WORKDIR /app

# Salin file konfigurasi npm
COPY package.json package-lock.json ./

# Salin folder prisma agar file schema tersedia jika dibutuhkan
COPY prisma ./prisma/
COPY prisma.config.ts ./prisma.config.ts 

# JURUS PAMUNGKAS: Instal dependencies dan PAKSA abaikan semua script otomatis (postinstall Prisma)
RUN npm ci --ignore-scripts

# ==========================================
# Stage 2: Builder
# ==========================================
FROM node:22-alpine AS builder
WORKDIR /app

# Salin node_modules dari tahap deps
COPY --from=deps /app/node_modules ./node_modules

# Salin seluruh kode sumber proyek
COPY . .

# GUNAKAN DUMMY URL agar prisma generate tidak gagal saat build.
# Di sinilah Prisma Client benar-benar di-generate secara aman.
RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy npx prisma generate

# Jalankan proses build Next.js
RUN npm run build

# ==========================================
# Stage 3: Runner (Production)
# ==========================================
FROM node:22-alpine AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000

# Copy runtime essentials
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

# Penting: Copy folder prisma dan config agar runtime bisa akses skema
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Ekspos port yang digunakan aplikasi
EXPOSE 8000

# Perintah utama untuk menyalakan server Next.js
CMD ["npm", "start"]