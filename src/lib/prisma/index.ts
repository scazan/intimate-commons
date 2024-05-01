import "server-only";
import { PrismaClient } from "@prisma/client";

const createPrismaClient = () => {
  return new PrismaClient({
    log: ["query"],
  });
};
const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV === "development") {
  globalThis.prisma = prisma;
}

export default prisma;
