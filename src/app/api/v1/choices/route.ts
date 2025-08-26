import { addChoice, addItem } from "@/api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { choiceSubmissionSchema, type ChoiceSubmissionData } from "@/lib/validation/schemas";
import { ZodError } from "zod";

export const GET = () => {
  return new NextResponse("hello");
};

export async function POST(request: Request) {
  try {
    const { value: groupId } = cookies().get("groupId") || {};
    const jsonBody = await request.json();

    let body: ChoiceSubmissionData;
    try {
      body = choiceSubmissionSchema.parse(jsonBody);
    } catch (error) {
      if (error instanceof ZodError) {
        return new NextResponse(
          JSON.stringify({
            error: "Invalid input",
            details: error.errors,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      throw error;
    }

    const newItem = body.isCustom
      ? await addItem({ title: body.objId, groupId })
      : null;

    const choice = await addChoice({
      sessionId: body.sessionId,
      subId: body.subId,
      ...(body.isCustom ? { objId: newItem!.id } : { objId: body.objId }),
    });

    return new NextResponse(JSON.stringify(choice), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing choice submission:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
