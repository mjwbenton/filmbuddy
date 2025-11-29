import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const rolls = sqliteTable("rolls", {
  id: text("id").primaryKey(),
  film: text("film").notNull(),
});

export type Roll = typeof rolls.$inferSelect;
export type NewRoll = typeof rolls.$inferInsert;
