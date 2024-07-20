import * as z from "zod"

export const StoryModel = z.object({
  id: z.string(),
  text: z.string(),
  sessionId: z.string(),
  created_at: z.date(),
  mediaID: z.string().nullish(),
  groupId: z.string().nullish(),
})
