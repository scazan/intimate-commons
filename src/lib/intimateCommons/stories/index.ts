import { getUserStory } from "@/lib/ai/query";

export type UserDetailRow = {
  choice_id: string;
  userId: string;
  sessionId: string;
  choice_created_at: string;
  sub_title: string;
  obj_title: string;
  name: string;
};

export const createStory = async (userResultsDetails: Array<UserDetailRow>) => {
  const choiceProses = userResultsDetails.map(
    (choice) =>
      `${choice.name} would share their ${choice.obj_title} in exchange for ${choice.sub_title}`,
  );

  const story = await getUserStory(choiceProses);

  return {
    story,
  };
};
