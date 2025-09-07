import "server-only";

import OpenAI from "openai";
const apiKey = process.env.OPENAI_API_KEY as string;
const organization = process.env.OPENAI_ORG as string;
const baseURL = process.env.AI_BASEURL as string;
let aiClient: OpenAI;

export const getAIClient = () => {
  if (aiClient) {
    return aiClient;
  }

  aiClient = new OpenAI({
    organization,
    apiKey,
  });
  return aiClient;
};
