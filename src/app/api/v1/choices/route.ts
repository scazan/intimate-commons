import { addChoice, addItem } from "@/api";
import { NextResponse } from "next/server";

interface IChoicesBody {
  subId: string;
  objId: string;
  sessionId: string;
  isCustom?: boolean;
}

export async function POST(request: Request) {
  const body = await request.json();

  console.log(body);
  let choice;
  if (body.isCustom) {
    const newItem = await addItem({ title: body.objId });

    choice = await addChoice({
      sessionId: body.sessionId,
      subId: body.subId,
      objId: newItem.id,
    });
  } else {
    choice = await addChoice({
      sessionId: body.sessionId,
      subId: body.subId,
      objId: body.objId,
    });
  }

  return new NextResponse(JSON.stringify(choice), {
    status: 200,
  });
}
