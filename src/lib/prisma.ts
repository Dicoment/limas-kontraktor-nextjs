import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL

const prisma =
  global.prisma ||
  new PrismaClient({
    adapter: connectionString ? new PrismaPg(connectionString) : undefined,
  })

if (process.env.NODE_ENV !== "production") global.prisma = prisma

export { prisma }
