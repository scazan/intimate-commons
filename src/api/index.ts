import prisma from "@/lib/prisma";

export const getQuestions = async () => {
  const items = await prisma.items.findMany({
    take: 20,
  });

  return items;
};
