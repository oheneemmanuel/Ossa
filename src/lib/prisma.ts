import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

export const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prisma: PrismaClient

if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma
} else {
  // 1. Create a native connection pool using your connection string
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  
  // 2. Instantiate the Prisma driver adapter wrapper
  const adapter = new PrismaPg(pool)
  
  // 3. Pass the adapter directly into the client constructor
  prisma = new PrismaClient({ adapter })
}

export const db = prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db




