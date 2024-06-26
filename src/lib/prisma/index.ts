import "server-only";
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: ReturnType<typeof createPrismaClient> | undefined;
}

const createPrismaClient = () => {
  if (process.env.NODE_ENV === "development") {
    return new PrismaClient({
      log: ["query"],
    });
  }

  return new PrismaClient();
};
const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV === "development") {
  globalThis.prisma = prisma;
}

export default prisma;
