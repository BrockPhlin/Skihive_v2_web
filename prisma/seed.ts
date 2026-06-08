import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('123456', 10)
  await prisma.user.upsert({
    where: { email: 'admin' },
    update: {},
    create: {
      email: 'admin',
      password: adminPassword,
      nickname: '管理员',
      isAdmin: true,
      coins: 9999,
    },
  })
  console.log('Seed completed: admin user created')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
