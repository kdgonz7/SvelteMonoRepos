import { command } from "$app/server";
import { db } from "$lib/server/db";
import { task } from "$lib/server/db/schema";
import z from "zod";

export const createTask = command(
  z.object({
    title: z.string(),
    priority: z.number().default(1),
  }),
  async ({ title, priority }) => {
    await db.insert(task).values({
      title,
      priority,
    });
  },
);
