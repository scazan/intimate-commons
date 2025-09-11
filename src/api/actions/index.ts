"use server";
import prisma from "@/lib/prisma";
import { getAllGroups } from "@/lib/intimateCommons";
import { UserDetailRow, createStory } from "@/lib/intimateCommons/stories";
import { Choice, Item, Story } from "@prisma/client";
import { generateAudio, getNewItems } from "@/lib/ai/query";
import { uploadBufferToStorage, generatePlaylist } from "@/lib/storage";
import { createUser as icCreateUser } from "@/lib/intimateCommons/services/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { setGroupID } from "..";
import { createUserSchema } from "@/lib/validation/schemas";
import { ZodError } from "zod";

export const createUser = async (data: FormData) => {
  "use server";

  try {
    // Clear any existing user cookies to ensure fresh start
    cookies().delete("userId");
    cookies().delete("userName");

    const formName = data.get("name") || "anonymous";
    const name = formName.valueOf().toString();

    // Validate the name using our schema
    const validatedData = createUserSchema.parse({ name });

    const newUser = await icCreateUser(validatedData.name);

    cookies().set("userId", newUser.id);
    cookies().set("userName", newUser.name);

    return { id: newUser.id };
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        `Validation failed: ${error.errors.map((e) => e.message).join(", ")}`,
      );
    }
    throw error;
  }
};

export const verifyUserAndNavigate = async (groupTitle?: string) => {
  "use server";
  const userIdCookie = cookies().get("userId");
  const userNameCookie = cookies().get("userName");
  const groupIdCookieObj = cookies().get("groupId");
  
  const userId = userIdCookie?.value;
  const userName = userNameCookie?.value;
  const groupIdCookie = groupIdCookieObj?.value;

  const currentUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!currentUser) {
    // if the user couldn't be found the userID was lost so create a new one.
    const newUser = await icCreateUser(userName);

    cookies().set("userId", newUser.id);
  }

  const groupId = await setGroupID(groupTitle || groupIdCookie);

  if (groupId) {
    cookies().set("groupId", groupId);
  }

  redirect("/questions");
};

const getComputedResults = (globalResults, userResults, userCount) => {
  const computedGlobalResults = globalResults.map((choice) => ({
    ...choice,
    percentage: choice.count / userCount,
  }));

  const computedUserResults = userResults.map((choice) => {
    // TODO: this is not right. percentages should be based on subject
    const globalObj = computedGlobalResults.find((globalChoice) => {
      return globalChoice.sub.id === choice.sub.id;
    });

    return {
      ...choice,
      percentage: globalObj?.percentage ?? 0,
    };
  });

  return {
    global: computedGlobalResults,
    user: computedUserResults,
  };
};

export const getResults = async ({ userId, sessionId, groupId }) => {
  // Ensure we always have a groupId, default to "default"
  const finalGroupId = groupId || "default";
  const userResultsDetails = (await prisma.$queryRaw`SELECT 
  c.id AS choice_id,
    c."userId",
    c."sessionId",
    c."created_at" AS choice_created_at,
    subItems."title" AS sub_title,
    objItems."title" AS obj_title,
    "User".name
  FROM 
  public."Choice" c
  JOIN public."User" ON c."userId" = "User".id
  JOIN 
  public."Item" subItems ON c."subId" = subItems.id
  JOIN 
  public."Item" objItems ON c."objId" = objItems.id
  WHERE
  "User".id = ${userId}`) as Array<UserDetailRow>;

  const [userResults, globalResults, existingStory, userCount] =
    await Promise.all([
      prisma.choice.findMany({
        relationLoadStrategy: "join",
        where: {
          userId,
        },
        include: {
          sub: true,
          obj: true,
        },
      }),
      getAllGroups(finalGroupId),
      prisma.story.findFirst({
        where: {
          sessionId,
        },
      }),

      prisma.user.count(),
    ]);

  if (existingStory) {
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

  // fork off the audio generation
  // waitUntil(
  await generateStoryAudio(newStory);
  // );
  await generateNewItemsForGroup(finalGroupId, userResults);

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

  // Update playlist after new audio is uploaded
  try {
    await updatePlaylist();
    console.log("Playlist updated after new audio upload");
  } catch (error) {
    console.error("Failed to update playlist after audio upload:", error);
  }

  return story.id;
};

export type ChoiceResults = Array<Choice & { sub: Item; obj: Item }>;

const generateNewItemsForGroup = async (
  groupId: string,
  userResults: ChoiceResults,
) => {
  const newItems = await getNewItems(userResults);

  await Promise.all(
    newItems.map(({ title, sentiment }) =>
      prisma.item.upsert({
        where: {
          title_groupId: { title, groupId },
        },
        update: {
          sentiment,
        },
        create: {
          title,
          sentiment,
          groupId,
        },
      }),
    ),
  );
};

export const updatePlaylist = async () => {
  "use server";

  try {
    const playlist = await generatePlaylist("intimate-commons-prod");
    const fs = await import("fs/promises");
    const path = await import("path");

    const publicPath = path.join(process.cwd(), "public", "playlist.json");
    await fs.writeFile(publicPath, JSON.stringify(playlist, null, 2));

    return { success: true, message: "Playlist updated successfully" };
  } catch (error) {
    console.error("Error updating playlist:", error);
    return { success: false, error: "Failed to update playlist" };
  }
};
