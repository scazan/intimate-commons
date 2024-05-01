import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_: NextRequest, { params }) => {
  const { userId } = params;
  const allResults = await prisma.choices.findMany({
    relationLoadStrategy: "join",
    where: {
      userId: userId,
    },
    include: {
      sub: true,
      obj: true,
    },
  });

  return NextResponse.json(allResults);
};
export type ResultsData = Awaited<ReturnType<typeof GET>> extends NextResponse<
  infer T
>
  ? T
  : never;
