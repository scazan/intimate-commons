import { PrismaClient } from "@prisma/client";
import { things, users } from "./seedData";

const prisma = new PrismaClient();

const randomIndex = (length) => Math.floor(Math.random() * (length - 1));

async function main() {
  const defaultGroup = await prisma.group.create({
    data: {
      title: "default",
    },
  });

  // create a bunch of random items from the seed data
  const itemsPromise = prisma.item.createMany({
    data: Object.entries(things).map(([title, sentiment]) => ({
      title,
      isSubjectOnly: true,
      sentiment,
    })),
  });

  // create a bunch of users from the seed data with seed- prepended to the name
  const testUsersPromise = prisma.user.createMany({
    data: users.map((user) => ({
      name: `seed-${user}`,
    })),
  });

  await Promise.all([itemsPromise, testUsersPromise]);

  const [items, testUsers] = await Promise.all([
    prisma.item.findMany(),
    prisma.user.findMany(),
  ]);

  const session = await prisma.session.create({
    data: {
      user: {
        connect: {
          id: testUsers[0].id,
        },
      },
      group: {
        connect: {
          id: defaultGroup.id,
        },
      },
    },
  });

  // add random choices made for each user
  const newChoices = await Promise.all(
    testUsers.map((user) => {
      const subId = items[randomIndex(items.length)].id;
      const objId = items[randomIndex(items.length)].id;

      return prisma.choice.createMany({
        data: new Array(2).fill(null).map(() => ({
          userId: user.id,
          sessionId: session.id,
          subId,
          objId,
        })),
      });
    }),
  );

  const neverItem = await prisma.item.create({
    data: {
      title: "never",
      isSubjectOnly: false,
      sentiment: 0,
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
