import { PrismaClient } from '../generated/client'
import { PrismaPg } from '@prisma/adapter-pg'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    adapter: new PrismaPg(process.env.DATABASE_URL!),
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
