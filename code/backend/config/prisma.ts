import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { createMemoryPrisma } from "./memory-store.js";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// The no-database mode keeps the prototype demoable without external services.
// Keep this intentionally loose: the memory adapter implements only the calls used by routes.
export const prisma: any = process.env.DATABASE_URL
  ? globalForPrisma.prisma ?? new PrismaClient()
  : createMemoryPrisma();

if (process.env.DATABASE_URL && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
