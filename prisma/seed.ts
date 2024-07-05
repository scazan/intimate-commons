import { PrismaClient } from "@prisma/client";
import { things, users } from "./seedData";

const prisma = new PrismaClient();

const randomIndex = (length) => Math.floor(Math.random() * (length - 1));

async function main() {
  // create a bunch of random items from the seed data
  const itemsPromise = prisma.items.createMany({
    data: things.map((thing) => ({
      title: thing,
      isSubjectOnly: true,
    })),
  });

  // create a bunch of users from the seed data with seed- prepended to the name
  const testUsersPromise = prisma.users.createMany({
    data: users.map((user) => ({
      name: `seed-${user}`,
    })),
  });

  await Promise.all([itemsPromise, testUsersPromise]);

  const [items, testUsers] = await Promise.all([
    prisma.items.findMany(),
    prisma.users.findMany(),
  ]);

  const session = await prisma.sessions.create({
    data: {
      user: {
        connect: {
          id: testUsers[0].id,
        },
      },
    },
  });

  // add random choices made for each user
  const newChoices = await Promise.all(
    testUsers.map((user) => {
      const subId = items[randomIndex(items.length)].id;
      const objId = items[randomIndex(items.length)].id;

      return prisma.choices.createMany({
        data: new Array(2).fill(null).map(() => ({
          userId: user.id,
          sessionId: session.id,
          subId,
          objId,
        })),
      });
    }),
  );

  const neverItem = await prisma.items.create({
    data: {
      title: "never",
      isSubjectOnly: false,
    },
  });

  console.log(newChoices);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
