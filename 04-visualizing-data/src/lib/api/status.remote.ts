import z from "zod";

import { command } from "$app/server";
import { db } from "$lib/server/db";
import { task } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

/** Change status of task with id to new status.
 *
 * Uses database features. Safe function when used in code.
 */
export const changeTaskStatus = command(
  z.object({
    id: z.string(),
    newStatus: z.string(),
  }),
  async ({ id, newStatus }) => {
    await db
      .update(task)
      .set({
        status: newStatus,
      })
      .where(eq(task.id, id));
  },
);
