import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getAllGroups } from "@/lib/intimateCommons";
import { UserDetailRow, createStory } from "@/lib/intimateCommons/stories";

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

export const getResults = async ({ userId, sessionId }) => {
  const userResultsDetails = (await prisma.$queryRaw`SELECT 
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
  "Users".id = ${userId};`) as Array<UserDetailRow>;

  const { story } = await createStory(userResultsDetails);

  const newStory = await prisma.story.create({
    data: {
      text: story,
      sessionId: sessionId,
    },
  });

  console.log("newStory", newStory);

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
