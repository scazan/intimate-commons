export const createUser = async (name: string) => {
  const newUser = await prisma.users.create({
    data: {
      name,
    },
  });

  return newUser;
};
