# ==========================================
# STAGE 1: Install dependencies hanya untuk build
# ==========================================
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install semua deps (termasuk devDependencies) agar bisa nge-build
RUN npm ci

# ==========================================
# STAGE 2: Proses Build Aplikasi
# ==========================================
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NOTE: Mengabaikan validasi env saat build jika ada, agar tidak gagal di CI/CD
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma Client terlebih dahulu, baru jalankan build Next.js
RUN npx prisma generate
RUN npm run build

# ==========================================
# STAGE 3: Production Runner
# ==========================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set permission folder public agar aman
COPY --from=builder /app/public ./public

# Mengambil hasil build standalone Next.js (Sangat hemat size Docker image)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8000

# NOTE: Standalone build dijalankan langsung menggunakan node, bukan npm start lagi
CMD ["node", "server.js"]