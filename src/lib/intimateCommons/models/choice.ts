import * as z from "zod"

export const ChoiceModel = z.object({
  id: z.string(),
  userId: z.string(),
  subId: z.string(),
  objId: z.string(),
  sessionId: z.string(),
  created_at: z.date(),
})
