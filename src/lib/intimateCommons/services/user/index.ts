import prisma from "@/lib/prisma";

export const createUser = async (name: string) => {
  const newUser = await prisma.user.create({
    data: {
      name,
    },
  });

  return newUser;
};
