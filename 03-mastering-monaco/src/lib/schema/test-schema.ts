import z from "zod";

export const FormScheme = z.object({
  title: z.string(),
  date: z.string(),
});
