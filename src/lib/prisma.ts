import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL

const prismaOptions = connectionString
  ? { adapter: new PrismaPg(connectionString) }
  : { datasourceUrl: "postgresql://dummy:dummy@localhost:5432/dummy" }

const prisma =
  global.prisma ||
  new PrismaClient(prismaOptions as any)

if (process.env.NODE_ENV !== "production") global.prisma = prisma

export { prisma }