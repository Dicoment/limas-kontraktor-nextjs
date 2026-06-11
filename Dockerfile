FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Tambahkan baris ini agar postinstall (prisma generate) bisa berjalan
COPY prisma ./prisma/
RUN npm ci --only=production

FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
# Tambahkan baris ini juga untuk proses build
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

EXPOSE 8000
CMD ["npm", "start"]