import { z } from "zod";


export const usernameValidation = z
  .string()
  .min(2, "Username must contain at least 2 characters")
  .max(20, "Username can be upto only 20 charcters.")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain alphanumeric characters."
  );
  

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Please use a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});
