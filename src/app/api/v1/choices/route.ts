import { addChoice, addItem } from "@/api";
import { NextResponse } from "next/server";
import { z } from "zod";

const inputSchema = z.object({
  subId: z.string(),
  objId: z.string(),
  sessionId: z.string(),
  isCustom: z.coerce.boolean(),
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

  const newItem = body.isCustom ? await addItem({ title: body.objId }) : null;

  const choice = await addChoice({
    sessionId: body.sessionId,
    subId: body.subId,
    ...(body.isCustom ? { objId: newItem.id } : { objId: body.objId }),
  });

  return new NextResponse(JSON.stringify(choice), {
    status: 200,
  });
}
