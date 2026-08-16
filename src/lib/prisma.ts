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
  //    max: 1 caps the number of DB connections each serverless function
  //    instance can open. Without this, the default is 10 per instance,
  //    which can quickly exceed your database's connection limit when
  //    multiple instances spin up under concurrent traffic (e.g. many
  //    people signing up at once).
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
  })

  // 2. Instantiate the Prisma driver adapter wrapper
  const adapter = new PrismaPg(pool)

  // 3. Pass the adapter directly into the client constructor
  prisma = new PrismaClient({ adapter })
}

export const db = prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db