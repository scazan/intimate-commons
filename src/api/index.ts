import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export const getQuestions = async () => {
  const { value: userId } = cookies().get("userId");
  // const items = await prisma.items.findMany({
  // where: {
  // NOT: {
  // id: "never",
  // },
  // },
  // take: 20,
  // });

  const randomChoices = await prisma.$queryRaw`SELECT *
    FROM "Items"
    WHERE Id <> 'never'
    ORDER BY random()
    LIMIT 20;`;

  const newSession = await prisma.sessions.create({
    data: {
      userId,
    },
  });
  return { choices: randomChoices, sessionId: newSession.id };
};

// based in a semantic triple
export const addChoice = async ({ subId, objId, sessionId }) => {
  const { value: userId } = cookies().get("userId");

  console.log(sessionId, "-", userId, "would trade", subId, "for", objId);

  const choice = await prisma.choices.create({
    data: {
      user: { connect: { id: userId } },
      sub: { connect: { id: subId } },
      obj: { connect: { id: objId } },
      session: {
        connect: { id: sessionId },
      },
    },
  });

  return choice;
};

export const addItem = async ({ title }) => {
  // TODO: check for duplicates

  const item = await prisma.items.create({
    data: {
      title,
    },
  });

  return item;
};

export const getChoiceCounts = async () => {
  const { value: userId } = cookies().get("userId");

  // const objectCounts = await prisma.$queryRaw`
  // SELECT objItems.title as ObjectTitle, subItems.title as SubTitle, Count(*)
  // FROM "Choices"
  // LEFT OUTER JOIN "Items" as objItems ON objItems.id = "Choices"."objId"
  // LEFT OUTER JOIN "Items" as subItems ON subItems.id = "Choices"."subId"

  // WHERE "objId" IN (SELECT "objId" FROM "Choices" WHERE "userId"='${userId}')

  // GROUP BY objItems.title, subItems.title
  // ;`;

  const subCounts = await prisma.$queryRaw`
    SELECT items.title, Count(*)
    FROM "Choices"
    LEFT OUTER JOIN "Items" as items ON items.id="subId"

    WHERE "subId" IN (SELECT "subId" FROM "Choices" WHERE "userId"='clmbyc3pm0000mp08xw37rgbe')

    GROUP BY items.title
  ;`;

  return subCounts;
};
