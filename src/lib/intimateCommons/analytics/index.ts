import prisma from "@/lib/prisma";

export const getAllGroups = async (groupId: string) => {
  // const allGroups = await prisma.choice.groupBy({
  // by: ["subId", "objId"],
  // _count: {
  // subId: true,
  // },
  // });
  // const allGroups = await prisma.choice.groupBy({
  // by: ["subId", "objId"],
  // _count: {
  // subId: true,
  // },
  // where: {
  // session: {
  // groupId: "clyuk0r2l000010eoikuwlcgj",
  // },
  // },
  // include: {
  // session: true,
  // },
  // });

  const allGroups = (await prisma.$queryRaw`SELECT
    "Choice"."subId",
    "Choice"."objId",
    count("Choice"."objId")

    FROM "Choice"
    JOIN "Session" ON "Choice"."sessionId" = "Session".id

    WHERE "Session"."groupId" = ${groupId}

    GROUP BY "Choice"."objId", "Choice"."subId"
  `) as Array<{ objId: string; subId: string; count: number }>;

  const allItemsInResults = allGroups.map((item) => [item.objId, item.subId]);

  // TODO: Need to pull this into SQL side code instead maybe
  const allItems = (
    await prisma.item.findMany({
      relationLoadStrategy: "join",
      where: {
        id: { in: allItemsInResults.flat() },
      },
    })
  ).reduce((accum, item) => {
    accum[item.id] = item;
    return accum;
  }, {});

  const resolved = allGroups.map((group) => ({
    count: parseInt(group.count.toString(), 10),
    sub: allItems[group.subId],
    obj: allItems[group.objId],
  }));

  return resolved;
};
