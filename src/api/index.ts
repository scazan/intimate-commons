"use server";
import { getItemSentiment } from "@/lib/ai/query";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export const getQuestions = async () => {
  const { value: userId } = cookies().get("userId");
  const { value: group } = cookies().get("group");

  // if there was no cookie for a group, use the default group
  let groupRecord = await prisma.group.findFirst({
    where: { title: group || "default" },
  });

  if (!groupRecord) {
    groupRecord = await prisma.group.create({
      data: {
        title: group,
      },
    });
  }

  const randomChoices =
    await prisma.$queryRaw`SELECT "Item".id, "Item"."groupId", "Item"."title", "Item"."isUserDefined", "Item"."isSubjectOnly", "Item".sentiment
    FROM "Item"
    LEFT JOIN "Group" ON "Group".id = "Item"."groupId"
    WHERE "Group".id IS NULL
    OR "Group".title = '${groupRecord.id}'

    ORDER BY random()
    LIMIT 20;`;

  const newSession = await prisma.session.create({
    data: {
      user: {
        connect: { id: userId },
      },
      group: {
        connect: { id: groupRecord.id },
      },
    },
  });

  return { userId, choices: randomChoices, sessionId: newSession.id };
};

// based in a semantic triple
// SUBJECT ---predicate: "would share in exchange for"---> OBJECT
export const addChoice = async ({ subId, objId, sessionId }) => {
  const { value: userId } = cookies().get("userId");

  console.log(sessionId, "-", userId, "would trade", subId, "for", objId);

  const choice = await prisma.choice.create({
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
  // check for duplicates
  const existingRecord = await prisma.item.findFirst({ where: { title } });

  if (existingRecord) {
    return existingRecord;
  }

  // calculate sentiment
  const sentiment = await getItemSentiment(title);

  const item = await prisma.item.create({
    data: {
      title: title.trim(),
      sentiment,
      isUserDefined: true,
    },
  });

  return item;
};

export const getChoiceCounts = async () => {
  const { value: userId } = cookies().get("userId");

  // const objectCounts = await prisma.$queryRaw`
  // SELECT objItems.title as ObjectTitle, subItems.title as SubTitle, Count(*)
  // FROM "Choice"
  // LEFT OUTER JOIN "Item" as objItems ON objItems.id = "Choice"."objId"
  // LEFT OUTER JOIN "Item" as subItems ON subItems.id = "Choice"."subId"

  // WHERE "objId" IN (SELECT "objId" FROM "Choice" WHERE "userId"='${userId}')

  // GROUP BY objItems.title, subItems.title
  // ;`;

  const subCounts = await prisma.$queryRaw`
    SELECT item.title, Count(*)
    FROM "Choice"
    LEFT OUTER JOIN "Item" as item ON item.id="subId"

    WHERE "subId" IN (SELECT "subId" FROM "Choice" WHERE "userId"='clmbyc3pm0000mp08xw37rgbe')

    GROUP BY item.title
  ;`;

  return subCounts;
};
