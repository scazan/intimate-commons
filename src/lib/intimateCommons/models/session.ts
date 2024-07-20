import * as z from "zod"

export const SessionModel = z.object({
  id: z.string(),
  userId: z.string(),
  created_at: z.date(),
  groupId: z.string(),
})
