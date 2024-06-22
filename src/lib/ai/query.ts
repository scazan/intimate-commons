import { getAIClient } from "./client";

export const getUserStory = async (choiceProses: string[]) => {
  const client = getAIClient();

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Given the facts about about this person, craft a short story in which the user is living together with multiple other people. The story should be banal and be a picture of everyday life together.`,
      },
      {
        role: "user",
        content: `Facts: ${choiceProses.join("\n")}`,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: false,
    n: 1,
  });

  return response.choices[0].message?.content;
};
