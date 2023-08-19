import prisma from "@/lib/prisma";

export const getQuestions = async () => {
  const items = await prisma.items.findMany();

  return items;
};
