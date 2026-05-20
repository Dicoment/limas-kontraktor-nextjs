import 'dotenv/config'
import { PrismaClient } from '../src/generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL!),
})

async function main() {
  await prisma.user.deleteMany()

  const hashedPassword = await bcrypt.hash('adminlimas', 10)

  await prisma.user.create({
    data: {
      email: 'admin@limas.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'superadmin',
    },
  })

  console.log('Seed complete: admin@limas.com / adminlimas')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
