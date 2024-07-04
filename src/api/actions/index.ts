import { waitUntil } from "@vercel/functions";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getAllGroups } from "@/lib/intimateCommons";
import { UserDetailRow, createStory } from "@/lib/intimateCommons/stories";
import { Story } from "@prisma/client";
import { generateAudio } from "@/lib/ai/query";
import { uploadBufferToStorage } from "@/lib/storage";

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

const getComputedResults = (globalResults, userResults, userCount) => {
  const computedGlobalResults = globalResults.map((choice) => ({
    ...choice,
    percentage: choice.count / userCount,
  }));

  const computedUserResults = userResults.map((choice) => {
    // TODO: this is not right. percentages should be based on subject
    const globalObj = computedGlobalResults.find(
      (globalChoice) => globalChoice.obj.id === choice.obj.id,
    );

    console.log("globalObj", globalObj);
    return {
      ...choice,
      percentage: globalObj.percentage,
    };
  });

  return {
    global: computedGlobalResults,
    user: computedUserResults,
  };
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

  const [userResults, globalResults, existingStory, userCount] =
    await Promise.all([
      prisma.choices.findMany({
        relationLoadStrategy: "join",
        where: {
          userId,
        },
        include: {
          sub: true,
          obj: true,
        },
      }),
      getAllGroups(),
      prisma.story.findFirst({
        where: {
          sessionId,
        },
      }),

      prisma.users.count(),
    ]);

  if (existingStory) {
    console.log("already exists");
    const { global, user } = getComputedResults(
      globalResults,
      userResults,
      userCount,
    );

    return {
      totalUsers: userCount,
      user,
      global,
      story: existingStory,
      sessionId,
    };
  }

  const { story } = await createStory(userResultsDetails);

  const newStory = await prisma.story.create({
    data: {
      text: story,
      session: {
        connect: {
          id: sessionId,
        },
      },
    },
  });

  console.log("newStory", newStory);

  // fork off the audio generation
  // waitUntil(
  await generateStoryAudio(newStory);
  // );
  const { global, user } = getComputedResults(
    globalResults,
    userResults,
    userCount,
  );

  return {
    user,
    global,
    story: newStory,
    sessionId,
  };
};

const generateStoryAudio = async (story: Story) => {
  const text = story.text;
  const audioBuffer = await generateAudio(text);

  const result = await uploadBufferToStorage({
    buffer: audioBuffer,
    bucketName: "intimate-commons-prod",
    key: `${story.id}.mp3`,
  });

  console.log("Audio was Uploaded", `${story.id}.mp3`, result);

  return story.id;
};
