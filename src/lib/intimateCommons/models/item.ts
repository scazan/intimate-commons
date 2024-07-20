import * as z from "zod"

export const ItemModel = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullish(),
  isUserDefined: z.boolean(),
  isSubjectOnly: z.boolean(),
  sentiment: z.number().int(),
  created_at: z.date(),
  groupId: z.string().nullish(),
})
