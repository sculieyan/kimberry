/* ------------------------------------------------------------------ */
/*  Shared Prisma client (Next.js dev-server hot-reload safe)          */
/* ------------------------------------------------------------------ */

import { PrismaClient } from "./generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
