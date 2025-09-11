import { ChoiceResults } from "@/api/actions";
import { getAIClient } from "./client";
import { getAudio } from "./elevenLabs";
import { playAudio } from "openai/helpers/audio";

export const getItemSentiment = async (item: string) => {
  const client = getAIClient();

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Given an item that one might have to share with someone else, choose a number between 1 and 5 indicating the level of intimacy associated with sharing the item. Do not say anything other than the number in response.

        ###
        Example:
        Item: Spouse

        5

        ###
        Example:
        Item: table

        1

        ###
        Example:
        Item: toothbrush

        4

        `,
      },
      {
        role: "user",
        content: `Item: ${item}`,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: false,
    n: 1,
  });

  const content = response.choices[0].message?.content;

  const sentiment = parseInt(content, 10);

  if (!isNaN(sentiment)) {
    return sentiment;
  }

  for (let char in content.split("")) {
    if (!isNaN(parseInt(char, 10))) {
      return parseInt(char, 10);
    }
  }

  return -1;
};

export const getUserStory = async (choiceProses: string[]) => {
  const client = getAIClient();

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        // content: `Given the facts about about this person, craft a very short story in which the user is living together with multiple other people. The story should be banal and be a picture of everyday life together. Trading is not the main focus of the story. Limit the story to no more than a paragraph.`,,
        content: `Given the facts about this person, craft a very short everyday story about living in a shared space with others. The story should capture a mundane, slice-of-life moment - perhaps a morning routine, an overheard conversation, someone's cooking mishap, or a small household negotiation. 

Vary your sentence openings and rhythms. Include natural pauses by using shorter sentences mixed with longer ones. Add ellipses... or dashes—for organic breaks in thought. 

The setting should feel warm and lived-in without explicitly using descriptive words like "cozy." Instead, convey comfort through specific details: worn furniture, familiar sounds, casual interactions.

Keep it to one paragraph, focusing on a single ordinary moment rather than summarizing daily life. Trading or transactions should not be the focus.`,
      },
      {
        role: "user",
        content: `Facts: ${choiceProses.join("\n")}`,
      },
    ],
    temperature: Math.random() * 0.3 + 1,
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
    model: "gpt-4o-mini-tts",
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

export const getNewItems = async (choices: ChoiceResults) => {
  const client = getAIClient();

  const choicesForContext = choices.map(
    (choice) =>
      `The user would trade ${choice.sub.title} for ${choice.obj.title}`,
  );

  const listOfSentiments = choices.map(
    (choice) => `
    ${choice.sub.title},${choice.sub.sentiment}
    ${choice.obj.title},${choice.obj.sentiment}
    `,
  );

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `
        Given the following choices made by a user and the accompanying list of intimacy scores for each item (between 1-5), generate a list of three other item recommendations that a user might be willing to trade. Base the decision on both the items as well as their associated intimacy score (between 1-5).

 Write the list with a new line for each item and the intimacy score following it, separated buy a comma and nothing else. Do not write anything other than the item and the intimacy score separated by a comma for each (ie. Item,5). Do not add bullets or any list numbering.
        `,
      },
      {
        role: "user",
        content: `
        User choices:
        ${choicesForContext.join("\n")}

        Item scores:
        ${listOfSentiments.join("\n")}
        `,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: false,
    n: 1,
  });

  const content = response.choices[0].message?.content;

  const items = content.split("\n").map((item) => {
    const [title, sentiment] = item.split(",");
    return {
      title: title.trim(),
      sentiment: parseInt(sentiment, 10),
    };
  });

  return items;
};

export const generateAudio = generateOpenAIAudio;
