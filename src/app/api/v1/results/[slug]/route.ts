import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const inputSchema = z.object({
  userId: z.string(),
});

export async function POST(request: Request) {
  const jsonBody = await request.json();

  const validated = inputSchema.safeParse(jsonBody);
  const { success } = validated;

  if (!success) {
    return new NextResponse(JSON.stringify({}), {
      status: 400,
    });
  }

  const { data: body } = validated;

  const allResults = await prisma.choices.findMany({
    where: {
      id: body.userId,
    },
  });

  return new NextResponse(JSON.stringify(allResults), {
    status: 200,
  });
}
