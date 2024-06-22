import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getAllGroups } from "@/lib/intimateCommons";

export const createUser = async (data: FormData) => {
  "use server";

  const formName = data.get("name") || "anonymous";
  const name = formName.valueOf().toString();

  const newUser = await prisma.users.create({
    data: {
      name,
    },
  });

  cookies().set("userId", newUser.id);
  cookies().set("userName", newUser.name);

  return { id: newUser.id };
};

export const getResults = async ({ userId }) => {
  const userResultsDetails = await prisma.$queryRaw`SELECT 
  c.id AS choice_id,
    c."userId",
    c."sessionId",
    c."created_at" AS choice_created_at,
    subItems."title" AS sub_title,
    objItems."title" AS obj_title,
    "Users".name
  FROM 
  public."Choices" c
  JOIN public."Users" ON c."userId" = "Users".id
  JOIN 
  public."Items" subItems ON c."subId" = subItems.id
  JOIN 
  public."Items" objItems ON c."objId" = objItems.id
  WHERE
  "Users".id = ${userId};`;

  const choiceProses = userResultsDetails.map(
    (choice: string) =>
      `${choice.name} would share their ${choice.obj_title} in exchange for ${choice.sub_title}`,
  );

  console.log("choiceProses", choiceProses);

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

  return { user: userResults, global: globalResults };
};

// Given the facts about about this person, craft a short story in which the user is living together with multiple other people. The story should be banal and be a picture of everyday life together.
