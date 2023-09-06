import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export const getQuestions = async () => {
  const items = await prisma.items.findMany({
    take: 20,
  });

  return items;
};

// based in a semantic triple
export const addChoice = async ({ subId, objId }) => {
  const userId = cookies().get("userId");

  console.log(userId.value, "would trade", subId, "for", objId);

  const choice = await prisma.choices.create({
    data: {
      userId: userId.value,
      subId,
      objId,
    },
  });

  return choice;
};
