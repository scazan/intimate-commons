import { addChoice } from "@/api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  console.log(body);
  const choice = await addChoice({ subId: body.subId, objId: body.objId });

  return new NextResponse(JSON.stringify(choice), {
    status: 200,
  });
}
