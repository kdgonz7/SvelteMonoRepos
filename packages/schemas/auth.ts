import z from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .regex(/^[a-zA-Z\d]+$/, "Username must only contain letters and numbers"),
  email: z.email(),
  password: z.string().min(3),
});
