import { getAllGroups } from "@/lib/intimateCommons";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_: NextRequest, { params }) => {
  const { userId } = params;

  const [userResults, globalResults] = await Promise.all([
    prisma.choices.findMany({
      relationLoadStrategy: "join",
      where: {
        userId: userId,
      },
      include: {
        sub: true,
        obj: true,
      },
    }),
    getAllGroups(),
  ]);

  return NextResponse.json({ user: userResults, global: globalResults });
};
export type ResultsData = Awaited<ReturnType<typeof GET>> extends NextResponse<
  infer T
>
  ? T
  : never;
