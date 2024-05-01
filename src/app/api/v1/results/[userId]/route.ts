import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_: NextRequest, { params }) => {
  const { userId } = params;
  const allResults = await prisma.choices.findMany({
    where: {
      userId: userId,
    },
    include: {
      sub: true,
      obj: true,
    },
  });
  console.log("USERID", userId, allResults);

  return new NextResponse(JSON.stringify(allResults), {
    status: 200,
  });
};
