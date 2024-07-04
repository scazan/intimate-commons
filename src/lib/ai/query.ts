import { getAIClient } from "./client";
import { getAudio } from "./elevenLabs";

export const getUserStory = async (choiceProses: string[]) => {
  const client = getAIClient();

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Given the facts about about this person, craft a very short story in which the user is living together with multiple other people. The story should be banal and be a picture of everyday life together. Trading is not the main focus of the story. Limit the story to no more than a paragraph.`,
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

export const generateOpenAIAudio = async (text: string): Promise<Buffer> => {
  const client = getAIClient();

  const voices: Array<"shimmer" | "nova" | "onyx" | "echo"> = [
    "shimmer",
    "nova",
    "onyx",
    "echo",
  ];
  const randomIndex = Math.floor(Math.random() * voices.length);
  const mp3 = await client.audio.speech.create({
    model: "tts-1",
    voice: voices[randomIndex],
    input: text,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());

  return buffer;
};

export const generateElevenAudio = async (text: string): Promise<Buffer> => {
  const buffer = await getAudio(text);

  console.log("AUDIO", buffer);
  // const buffer = Buffer.from(await mp3.arrayBuffer());

  return buffer;
};

export const generateAudio = generateOpenAIAudio;
