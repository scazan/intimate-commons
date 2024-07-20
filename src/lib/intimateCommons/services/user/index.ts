export const createUser = async (name: string) => {
  const newUser = await prisma.user.create({
    data: {
      name,
    },
  });

  return newUser;
};
