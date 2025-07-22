import { PrismaClient } from '@prisma/client'

// PrismaClient est attaché à l'objet `global` en développement pour éviter d'épuiser
// votre limite de connexions
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
