import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const rolls = sqliteTable("rolls", {
  id: text("id").primaryKey(),
  filmStock: text("film_stock").notNull(),
  iso: integer("iso").notNull(),
  camera: text("camera").notNull(),
  loadedAt: integer("loaded_at", { mode: "timestamp" }).notNull(),
  finishedAt: integer("finished_at", { mode: "timestamp" }),
});

export type Roll = typeof rolls.$inferSelect;
export type NewRoll = typeof rolls.$inferInsert;
