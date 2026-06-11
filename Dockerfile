# Stage 1: Install semua dependencies (termasuk devDependencies agar prisma generate bisa jalan)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./

# ---> TAMBAHAN PENTING: Salin folder prisma sebelum npm ci <---
COPY prisma ./prisma/
COPY prisma.config.ts ./prisma.config.ts 

# Kita pakai npm ci tanpa --only=production agar prisma CLI tersedia
RUN npm ci

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# GUNAKAN DUMMY URL agar prisma generate tidak gagal saat build
RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy npx prisma generate
RUN npm run build

# Stage 3: Runner (Production)
FROM node:22-alpine AS runner
WORKDIR /app
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

EXPOSE 8000
CMD ["npm", "start"]