import prisma from "@/lib/prisma";

export const getAllGroups = async () => {
  const allGroups = await prisma.choice.groupBy({
    by: ["subId", "objId"],
    _count: {
      subId: true,
    },
  });

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
    count: group._count.subId,
    sub: allItems[group.subId],
    obj: allItems[group.objId],
  }));

  return resolved;
};
