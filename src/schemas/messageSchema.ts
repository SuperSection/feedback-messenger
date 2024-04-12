import { z } from "zod";


export const messageSchema = z.object({
  content: z
    .string()
    .min(5, "Content must be at least of 5 characters.")
    .max(500, "Content must be no longer than 300 characters."),
});
