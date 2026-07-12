# ==========================================
# Stage 1: Install semua dependencies (deps)
# ==========================================
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ==========================================
# Stage 2: Builder
# ==========================================
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependencies dari stage 1
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# OPTIMASI MEMORI: 
# 1. Batasi Node memory agar tidak membengkak (1.8GB max)
# 2. Matikan source maps (menghemat 30-40% RAM build)
# 3. Matikan telemetry
ENV NODE_OPTIONS="--max-old-space-size=1800"
ENV GENERATE_SOURCEMAP=false
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma Client
RUN npx prisma generate

# Jalankan proses build
RUN npm run build

# ==========================================
# Stage 3: Runner (Production)
# ==========================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000

# Copy hasil build saja (jauh lebih ringan)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 8000

# PERINGATAN: Gunakan skrip terpisah untuk migrasi jika memungkinkan
CMD ["npm", "start"]