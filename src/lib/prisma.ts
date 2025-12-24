// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// 전역 변수에 prisma가 있는지 확인 (개발 모드 재실행 방지)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // 터미널에 SQL 쿼리 로그를 보여줌 (디버깅용)
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
