import { command, query } from "$app/server";
import { db } from "$lib/server/db";
import { task } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import z from "zod";

export const getAllTasks = query(async () => {
  return await db.select().from(task);
});

export const deleteTask = command(z.string(), async (id) => {
  await db.delete(task).where(eq(task.id, id));
});
