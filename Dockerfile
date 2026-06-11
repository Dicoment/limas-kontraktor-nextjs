FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Pastikan prisma tercopy di sini untuk generate
COPY prisma ./prisma/
RUN npm ci --only=production

FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8000

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
# --- BAGIAN INI YANG DITAMBAHKAN ---
COPY --from=builder /app/prisma ./prisma
# ------------------------------------

EXPOSE 8000
CMD ["npm", "start"]