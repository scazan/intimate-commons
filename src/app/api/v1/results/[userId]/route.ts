import { getAllGroups } from "@/lib/intimateCommons";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_: NextRequest, { params }) => {
  const { userId, group } = params;

  console.log("HERE", userId, group);
  const userResults = await prisma.$queryRaw`SELECT 
  c.id AS choice_id,
    c."userId",
    c."sessionId",
    c."created_at" AS choice_created_at,
    subItems."title" AS subject_title,
    objItems."title" AS object_title
  FROM 
  public."Choice" c
  JOIN public."Users" ON c."userId" = "Users".id
  JOIN 
  public."Item" subItems ON c."subId" = subItems.id
  JOIN 
  public."Item" objItems ON c."objId" = objItems.id
  WHERE
  "Users".id = ${userId};`;

  const [globalResults] = await Promise.all([
    prisma.choice.findMany({
      relationLoadStrategy: "join",
      where: {
        userId: userId,
      },
      include: {
        sub: true,
        obj: true,
      },
    }),
    getAllGroups(group),
  ]);

  return NextResponse.json({ user: userResults, global: globalResults });
};
export type ResultsData = Awaited<ReturnType<typeof GET>> extends NextResponse<
  infer T
>
  ? T
  : never;
