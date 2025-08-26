import { z } from "zod";

export const questionFormSchema = z.object({
  object: z.string().min(1, "Please select an option"),
  customInput: z.string().optional(),
}).refine((data) => {
  if (data.object === "custom") {
    return data.customInput && data.customInput.trim().length > 0;
  }
  return true;
}, {
  message: "Please provide a custom exchange option",
  path: ["customInput"],
});

export const createUserSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
});

export const choiceSubmissionSchema = z.object({
  subId: z.string().min(1, "Subject ID is required"),
  objId: z.string().min(1, "Object ID is required"),
  isCustom: z.boolean(),
  sessionId: z.string().min(1, "Session ID is required"),
});

export type QuestionFormData = z.infer<typeof questionFormSchema>;
export type CreateUserData = z.infer<typeof createUserSchema>;
export type ChoiceSubmissionData = z.infer<typeof choiceSubmissionSchema>;