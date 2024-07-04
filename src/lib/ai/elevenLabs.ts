import { ElevenLabsClient } from "elevenlabs";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
if (!ELEVENLABS_API_KEY) {
  throw new Error("ELEVENLABS_API_KEY is not set in the environment variables");
}

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export const getAudio = async (text: string): Promise<Buffer> => {
  const audioStream = await client.generate({
    voice: "Rachel",
    model_id: "eleven_turbo_v2",
    text,
  });

  const chunks: Buffer[] = [];
  for await (const chunk of audioStream) {
    chunks.push(chunk);
  }

  const content = Buffer.concat(chunks);

  return content;
};
