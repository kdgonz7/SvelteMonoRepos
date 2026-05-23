import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const task = sqliteTable("task", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  priority: integer("priority").notNull().default(1),
  status: text("status").notNull().default("unfinished"),
});

export type Task = typeof task.$inferSelect;
export * from "./auth.schema";
