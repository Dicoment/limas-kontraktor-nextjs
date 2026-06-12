import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL

const prisma =
  global.prisma ||
  (connectionString
    ? new PrismaClient({ adapter: new PrismaPg(connectionString) })
    : new PrismaClient())

if (process.env.NODE_ENV !== "production") global.prisma = prisma

export { prisma }